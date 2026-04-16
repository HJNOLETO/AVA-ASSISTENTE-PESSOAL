import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

/**
 * SERVIÇO DE SINCRONIZAÇÃO NATIVA: GOOGLE APIS
 * Este arquivo substitui os antigos drive_sync.py e sync_manager.py
 */

const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/calendar.events',
];

// Opcional: Variáveis para JWT (Service Account)
const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(process.cwd(), 'gcp-credentials.json');

export class AVA_GoogleServices {
  private authClient: any;
  private drive: any;
  private calendar: any;

  constructor() {
    this.initAuth();
  }

  private initAuth() {
    if (!fs.existsSync(CREDENTIALS_PATH)) {
      console.warn(`⚠️ Aviso: Credenciais do GCP não encontradas em ${CREDENTIALS_PATH}. As funções de Nuvem não funcionarão até você configurar sua Service Account.`);
      return;
    }

    try {
      this.authClient = new google.auth.GoogleAuth({
        keyFile: CREDENTIALS_PATH,
        scopes: SCOPES,
      });

      this.drive = google.drive({ version: 'v3', auth: this.authClient });
      this.calendar = google.calendar({ version: 'v3', auth: this.authClient });
      console.log("✅ Serviço Google API inicializado nativamente!");
    } catch (e) {
      console.error("❌ Falha na autenticação do GCP:", e);
    }
  }

  /**
   * Baixa um arquivo diretamente para o contexto RAG
   */
  async downloadDriveFile(fileId: string, destFolder: string, newFileName: string) {
    if (!this.drive) return;

    try {
      console.log(`Baixando ID ${fileId} do Drive...`);
      const dest = fs.createWriteStream(path.join(destFolder, newFileName));
      
      const res = await this.drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );
      
      return new Promise((resolve, reject) => {
        res.data
          .on('end', () => resolve(true))
          .on('error', (err: any) => reject(err))
          .pipe(dest);
      });
    } catch (error) {
      console.error('Erro no download do Google Drive:', error);
      throw error;
    }
  }

  /**
   * Envia um Evento para a Agenda (ex: Audiência ou Reunião Externa)
   */
  async forceCalendarEvent(summary: string, description: string, startTimeIso: string, endTimeIso: string) {
    if (!this.calendar) return;

    try {
      const event = {
        summary: summary,
        description: description,
        start: {
          dateTime: startTimeIso,
          timeZone: 'America/Sao_Paulo',
        },
        end: {
          dateTime: endTimeIso,
          timeZone: 'America/Sao_Paulo',
        },
      };

      const res = await this.calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      console.log('✅ Evento criado com sucesso na Agenda Jurídica/Comercial: %s', res.data.htmlLink);
      return res.data;
    } catch (error) {
      console.error('Erro na criação de evento no Calendar:', error);
      throw error;
    }
  }
}

// Teste CLI Rápido
if (process.argv[1] === new URL(import.meta.url).pathname || process.argv[1] === __filename) {
  console.log("Serviço em Dry Run...");
  new AVA_GoogleServices();
}
