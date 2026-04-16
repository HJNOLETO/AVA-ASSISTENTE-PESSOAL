import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Upload,
  File,
  X,
  FileText,
  FileCode,
  Table,
  FileJson,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface FilePreview {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface DocumentUploaderProps {
  onClose: () => void;
}

const ACCEPTED_TYPES = [
  ".pdf", ".doc", ".docx", ".csv", ".xls", ".xlsx",
  ".json", ".html", ".js", ".ts", ".txt", ".md",
  ".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".tiff", ".tif"
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileExtension(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return `.${ext}`;
}

function getFileIcon(type: string) {
  const ext = getFileExtension(type);
  if (ext === ".pdf") return <FileText className="h-5 w-5 text-red-500" />;
  if (ext === ".doc" || ext === ".docx") return <FileText className="h-5 w-5 text-blue-500" />;
  if (ext === ".xls" || ext === ".xlsx" || ext === ".csv") return <Table className="h-5 w-5 text-green-500" />;
  if (ext === ".json") return <FileJson className="h-5 w-5 text-yellow-500" />;
  if (ext === ".js" || ext === ".ts" || ext === ".html") return <FileCode className="h-5 w-5 text-purple-500" />;
  return <File className="h-5 w-5 text-muted-foreground" />;
}

export function DocumentUploader({ onClose }: DocumentUploaderProps) {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [externalId, setExternalId] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [legalStatus, setLegalStatus] = useState("vigente");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [sendToReview, setSendToReview] = useState(false);

  const trpcUtils = trpc.useContext();

  const uploadMutation = trpc.documents.upload.useMutation();

  const readFileAsBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1] || "");
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  }, []);

  const processFiles = async (fileList: File[]) => {
    const validFiles: FilePreview[] = [];

    for (const file of fileList) {
      const ext = getFileExtension(file.name);
      if (!ACCEPTED_TYPES.includes(ext)) {
        toast.warning(`Tipo de arquivo não suportado: ${ext}`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.warning(`Arquivo muito grande: ${file.name} (max 50MB)`);
        continue;
      }

      validFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type || ext,
        file,
      });
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Selecione pelo menos um arquivo");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    let uploaded = 0;
    let deduplicated = 0;
    let reviewQueued = 0;
    let failed = 0;

    try {
      const hasBatch = files.length > 1;
      if (hasBatch && externalId.trim()) {
        toast.info("ID Externo sera ignorado em envio multiplo para evitar conflitos.");
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const base64Content = await readFileAsBase64(file.file);
          const result = await uploadMutation.mutateAsync({
            name: file.name,
            mimeType: file.type,
            base64Content,
            externalId: hasBatch ? undefined : externalId || undefined,
            sourceType: sourceType || undefined,
            legalStatus,
            effectiveDate: effectiveDate || undefined,
            autoIndex: !sendToReview,
          });

          uploaded += 1;
          if (result?.deduplicated) deduplicated += 1;
          if (result?.needsReview) reviewQueued += 1;
        } catch (error: any) {
          failed += 1;
          toast.error(`Falha ao enviar ${file.name}: ${error?.message || "erro desconhecido"}`);
        } finally {
          setUploadProgress(Math.round(((i + 1) / files.length) * 100));
        }
      }

      await trpcUtils.documents.list.invalidate();

      if (uploaded > 0) {
        const baseMsg = `${uploaded} documento(s) enviado(s)`;
        const dedupMsg = deduplicated > 0 ? `, ${deduplicated} reaproveitado(s)` : "";
        const reviewMsg = reviewQueued > 0 ? `, ${reviewQueued} em revisao` : "";
        const failMsg = failed > 0 ? `, ${failed} com falha` : "";
        toast.success(`${baseMsg}${dedupMsg}${reviewMsg}${failMsg}.`);
      } else {
        toast.error("Nenhum documento foi enviado com sucesso.");
      }

      if (failed === 0 && uploaded > 0) {
        onClose();
      }
    } finally {
      setIsUploading(false);
    }
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Arraste arquivos aqui ou clique para selecionar</p>
             <p className="text-xs text-muted-foreground mt-1">
               PDF, DOC, DOCX, XLS, XLSX, CSV, JSON, HTML, JS, TS, TXT, MD e imagens
             </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Selecionar arquivos
          </Button>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Arquivos selecionados ({files.length})</Label>
            <span className="text-xs text-muted-foreground">
              Total: {formatFileSize(totalSize)}
            </span>
          </div>
          
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getFileIcon(file.type)}
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="externalId">ID Externo (opcional)</Label>
          <Input
            id="externalId"
            placeholder="ex: cf_1988"
            value={externalId}
            onChange={(e) => setExternalId(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sourceType">Tipo (opcional)</Label>
          <select
            id="sourceType"
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
            className="h-10 w-full px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Selecione...</option>
            <option value="lei_federal">Lei Federal</option>
            <option value="decreto">Decreto</option>
            <option value="jurisprudencia">Jurisprudência</option>
            <option value="doutrina">Doutrina</option>
            <option value="manual">Manual</option>
            <option value="livro">Livro</option>
            <option value="artigo">Artigo</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="legalStatus">Status Legal</Label>
          <select
            id="legalStatus"
            value={legalStatus}
            onChange={(e) => setLegalStatus(e.target.value)}
            className="h-10 w-full px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="vigente">Vigente</option>
            <option value="ab-rogada">Ab-rogada</option>
            <option value="derrogada">Derrogada</option>
            <option value="extinta">Extinta</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="effectiveDate">Data de vigência (opcional)</Label>
          <Input
            id="effectiveDate"
            type="date"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <p className="text-sm font-medium">Enviar para revisao antes de indexar</p>
          <p className="text-xs text-muted-foreground">
            Recomendado para PDFs escaneados e documentos sensiveis
          </p>
        </div>
        <Switch checked={sendToReview} onCheckedChange={setSendToReview} />
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Enviando documento...</span>
             <span className="text-muted-foreground">{uploadProgress}%</span>
           </div>
           <Progress value={uploadProgress} className="h-2" />
         </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isUploading}>
          Cancelar
        </Button>
        <Button onClick={handleUpload} disabled={files.length === 0 || isUploading}>
          {isUploading ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </div>
  );
}
