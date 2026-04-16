import io
import logging
import os
import pickle
from pathlib import Path

from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


SCOPES = ["https://www.googleapis.com/auth/drive.file"]

PROJECT_ROOT = Path(__file__).parent.parent
DEFAULT_DATA_DIR = PROJECT_ROOT.parent / f"{PROJECT_ROOT.name}-dados"
DATA_DIR = Path(os.getenv("AVA_DATA_DIR", str(DEFAULT_DATA_DIR)))
LOCAL_SYNC_FOLDER = Path(os.getenv("AVA_DRIVE_SYNC_DIR", str(DATA_DIR / "Drive_Sync")))
CREDENTIALS_FILE = PROJECT_ROOT / "credentials.json"
TOKEN_FILE = PROJECT_ROOT / "token.pickle"
DRIVE_FOLDER_NAME = os.getenv("DRIVE_SYNC_FOLDER_NAME", "SISTEMA_AVA_KNOWLEDGE")


def authenticate_google_drive():
    creds = None

    if TOKEN_FILE.exists():
        with open(TOKEN_FILE, "rb") as token:
            creds = pickle.load(token)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIALS_FILE.exists():
                raise FileNotFoundError(
                    f"Arquivo {CREDENTIALS_FILE} nao encontrado. Coloque credentials.json na raiz do projeto."
                )

            flow = InstalledAppFlow.from_client_secrets_file(str(CREDENTIALS_FILE), SCOPES)
            creds = flow.run_local_server(port=0)

        with open(TOKEN_FILE, "wb") as token:
            pickle.dump(creds, token)

    return build("drive", "v3", credentials=creds)


def get_or_create_folder(service, folder_name, parent_id=None):
    query_parts = [
        "mimeType='application/vnd.google-apps.folder'",
        f"name='{folder_name}'",
        "trashed=false",
    ]
    if parent_id:
        query_parts.append(f"'{parent_id}' in parents")

    query = " and ".join(query_parts)
    results = service.files().list(q=query, fields="files(id, name)").execute()
    files = results.get("files", [])

    if files:
        return files[0]["id"]

    metadata = {
        "name": folder_name,
        "mimeType": "application/vnd.google-apps.folder",
    }
    if parent_id:
        metadata["parents"] = [parent_id]

    created = service.files().create(body=metadata, fields="id").execute()
    return created["id"]


def ensure_remote_folder_tree(service, root_folder_id, relative_parts):
    current_parent = root_folder_id
    for part in relative_parts:
        current_parent = get_or_create_folder(service, part, current_parent)
    return current_parent


def upload_files_recursive(service, root_folder_id):
    LOCAL_SYNC_FOLDER.mkdir(parents=True, exist_ok=True)

    for file_path in LOCAL_SYNC_FOLDER.rglob("*"):
        if not file_path.is_file():
            continue

        relative_path = file_path.relative_to(LOCAL_SYNC_FOLDER)
        relative_parts = list(relative_path.parts)
        if not relative_parts:
            continue

        filename = relative_parts[-1]
        parent_parts = relative_parts[:-1]
        parent_id = ensure_remote_folder_tree(service, root_folder_id, parent_parts)

        query = (
            f"name='{filename}' and '{parent_id}' in parents and trashed=false"
        )
        existing = service.files().list(q=query, fields="files(id)").execute().get("files", [])

        media = MediaFileUpload(str(file_path), resumable=True)

        if existing:
            file_id = existing[0]["id"]
            service.files().update(fileId=file_id, media_body=media).execute()
            logger.info("Arquivo atualizado no Drive: %s", relative_path.as_posix())
        else:
            service.files().create(
                body={"name": filename, "parents": [parent_id]},
                media_body=media,
                fields="id",
            ).execute()
            logger.info("Arquivo enviado ao Drive: %s", relative_path.as_posix())


def list_folder_files(service, folder_id):
    query = f"'{folder_id}' in parents and trashed=false"
    page_token = None

    while True:
        results = service.files().list(
            q=query,
            fields="nextPageToken, files(id, name, mimeType)",
            pageToken=page_token,
        ).execute()

        for item in results.get("files", []):
            yield item

        page_token = results.get("nextPageToken")
        if not page_token:
            break


def download_tree(service, folder_id, local_dir):
    local_dir.mkdir(parents=True, exist_ok=True)

    for item in list_folder_files(service, folder_id):
        item_id = item["id"]
        item_name = item["name"]
        mime_type = item.get("mimeType", "")

        if mime_type == "application/vnd.google-apps.folder":
            download_tree(service, item_id, local_dir / item_name)
            continue

        target = local_dir / item_name
        if target.exists():
            continue

        request = service.files().get_media(fileId=item_id)
        handle = io.BytesIO()
        downloader = MediaIoBaseDownload(handle, request)
        done = False
        while not done:
            _, done = downloader.next_chunk()

        with open(target, "wb") as f:
            f.write(handle.getvalue())

        logger.info("Arquivo baixado do Drive: %s", target.relative_to(LOCAL_SYNC_FOLDER).as_posix())


def main():
    logger.info("Sincronizando Drive <-> %s", LOCAL_SYNC_FOLDER)
    service = authenticate_google_drive()
    root_folder_id = get_or_create_folder(service, DRIVE_FOLDER_NAME)

    upload_files_recursive(service, root_folder_id)
    download_tree(service, root_folder_id, LOCAL_SYNC_FOLDER)

    logger.info("Sincronizacao concluida com sucesso")


if __name__ == "__main__":
    main()
