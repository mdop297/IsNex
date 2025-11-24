import {
  BodyUploadFile,
  DocumentResponse,
  FileType,
} from '@/lib/generated/core/data-contracts';

// Type definitions
export interface FileItem {
  id: number;
  file: File;
  progress: number;
  status: FileStatus;
  selected: boolean;
  uploadPromise?: Promise<void>;
}

export type FileStatus =
  | 'pending'
  | 'uploading'
  | 'completed'
  | 'error'
  | 'queued';

export interface FileUploadFormProps {
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[];
  maxFiles?: number;
  onUploadComplete?: (files: FileItem[]) => void;
  onUploadError?: (error: string, fileId: number) => void;
  onClose?: () => void;
}

// Background Upload Manager with manual control
export class BackgroundUploadManager {
  private static instance: BackgroundUploadManager;
  private uploadQueue: Map<number, FileItem> = new Map();
  private activeUploads: Set<number> = new Set();
  private maxConcurrentUploads: number = 3;
  private listeners: Set<(files: FileItem[]) => void> = new Set();
  private isUploadingEnabled: boolean = false;
  constructor(
    private uploadFile: (data: BodyUploadFile) => Promise<DocumentResponse>,
  ) {}

  static getInstance(
    uploadFile: (data: BodyUploadFile) => Promise<DocumentResponse>,
  ): BackgroundUploadManager {
    if (!BackgroundUploadManager.instance) {
      BackgroundUploadManager.instance = new BackgroundUploadManager(
        uploadFile,
      );
    }
    return BackgroundUploadManager.instance;
  }

  addListener(callback: (files: FileItem[]) => void) {
    this.listeners.add(callback);
  }

  removeListener(callback: (files: FileItem[]) => void) {
    this.listeners.delete(callback);
  }

  private notifyListeners() {
    const files = Array.from(this.uploadQueue.values());
    this.listeners.forEach((callback) => callback(files));
  }

  addFile(fileItem: FileItem) {
    this.uploadQueue.set(fileItem.id, {
      ...fileItem,
      status: 'pending',
      selected: true,
    });
    this.notifyListeners();
  }

  removeFile(fileId: number) {
    this.uploadQueue.delete(fileId);
    this.activeUploads.delete(fileId);
    this.notifyListeners();
  }

  updateFileStatus(fileId: number, updates: Partial<FileItem>) {
    const file = this.uploadQueue.get(fileId);
    if (file) {
      const updatedFile = { ...file, ...updates };
      this.uploadQueue.set(fileId, updatedFile);
      this.notifyListeners();
    }
  }

  toggleFileSelection(fileId: number) {
    const file = this.uploadQueue.get(fileId);
    if (file && file.status === 'pending') {
      this.updateFileStatus(fileId, { selected: !file.selected });
    }
  }

  selectAllFiles(selected: boolean) {
    this.uploadQueue.forEach((file) => {
      if (file.status === 'pending') {
        this.updateFileStatus(file.id, { selected });
      }
    });
  }

  startSelectedUploads() {
    this.isUploadingEnabled = true;
    this.processQueue();
  }

  pauseUploads() {
    this.isUploadingEnabled = false;
  }

  private async processQueue() {
    if (!this.isUploadingEnabled) return;

    // Start uploads for selected pending files
    const selectedPendingFiles = Array.from(this.uploadQueue.values()).filter(
      (f) => f.status === 'pending' && f.selected,
    );

    for (const file of selectedPendingFiles) {
      if (this.activeUploads.size >= this.maxConcurrentUploads) {
        this.updateFileStatus(file.id, { status: 'queued' });
      } else {
        this.activeUploads.add(file.id);
        this.startUpload(file);
      }
    }

    // Process queued files
    const queuedFiles = Array.from(this.uploadQueue.values()).filter(
      (f) => f.status === 'queued',
    );

    for (const file of queuedFiles) {
      if (this.activeUploads.size >= this.maxConcurrentUploads) {
        break;
      }

      this.activeUploads.add(file.id);
      this.startUpload(file);
    }
  }

  private async startUpload(fileItem: FileItem) {
    this.updateFileStatus(fileItem.id, { status: 'uploading', progress: 0 });
    console.log('===============================');
    console.log('Uploading file: ==>', fileItem.file.name);
    console.log('===============================');

    this.updateFileStatus(fileItem.id, { status: 'uploading', progress: 0 });

    try {
      const documentCreateData = {
        name: fileItem.file.name,
        num_pages: 0,
        file_size: fileItem.file.size.toString(),
        type: FileType.Pdf,
      };

      const body: BodyUploadFile = {
        file: fileItem.file,
        metadata: JSON.stringify(documentCreateData),
      };

      const response = await this.uploadFile(body);
      console.log('Upload response:', response);

      this.updateFileStatus(fileItem.id, {
        status: 'completed',
        progress: 100,
      });
    } catch (error) {
      this.updateFileStatus(fileItem.id, { status: 'error' });
      console.error('Upload error:', error);
    } finally {
      this.activeUploads.delete(fileItem.id);
      setTimeout(() => this.processQueue(), 100);
    }
  }

  getFiles(): FileItem[] {
    return Array.from(this.uploadQueue.values());
  }

  hasActiveUploads(): boolean {
    return (
      this.activeUploads.size > 0 ||
      Array.from(this.uploadQueue.values()).some((f) => f.status === 'queued')
    );
  }

  hasPendingUploads(): boolean {
    return Array.from(this.uploadQueue.values()).some(
      (f) => f.status === 'pending' && f.selected,
    );
  }

  getUploadStats() {
    const files = this.getFiles();
    const selectedFiles = files.filter((f) => f.selected);
    return {
      total: files.length,
      selected: selectedFiles.length,
      completed: files.filter((f) => f.status === 'completed').length,
      uploading: files.filter((f) => f.status === 'uploading').length,
      queued: files.filter((f) => f.status === 'queued').length,
      error: files.filter((f) => f.status === 'error').length,
      pendingSelected: files.filter((f) => f.status === 'pending' && f.selected)
        .length,
    };
  }

  clearCompleted() {
    const completedFiles = Array.from(this.uploadQueue.values()).filter(
      (f) => f.status === 'completed',
    );

    completedFiles.forEach((file) => {
      this.uploadQueue.delete(file.id);
    });

    this.notifyListeners();
  }
}
