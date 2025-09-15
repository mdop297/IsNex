import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
  Upload,
  X,
  File,
  Image,
  Video,
  FileText,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { SidebarMenuButton, useSidebar } from '../ui/sidebar';

// Type definitions
interface FileItem {
  id: number;
  file: File;
  progress: number;
  status: FileStatus;
}

type FileStatus = 'pending' | 'uploading' | 'completed' | 'error';

interface FileUploadFormProps {
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[];
  maxFiles?: number;
  onUploadComplete?: (files: FileItem[]) => void;
  onUploadError?: (error: string, fileId: number) => void;
  onClose?: () => void;
}

// File type checking utilities
const IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];
const VIDEO_TYPES = [
  'video/mp4',
  'video/avi',
  'video/mov',
  'video/wmv',
  'video/webm',
];
const DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const isImageFile = (fileType: string): boolean =>
  IMAGE_TYPES.includes(fileType);
const isVideoFile = (fileType: string): boolean =>
  VIDEO_TYPES.includes(fileType);
const isDocumentFile = (fileType: string): boolean =>
  DOCUMENT_TYPES.includes(fileType);

// File Upload Form Component
export const FileUploadForm: React.FC<FileUploadFormProps> = ({
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  acceptedFileTypes = ['image/*', 'video/*', '.pdf', '.doc', '.docx', '.txt'],
  maxFiles = 10,
  onUploadComplete,
  onUploadError,
  onClose,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileType: string): React.ReactElement => {
    if (isImageFile(fileType)) {
      return <Image className="h-4 w-4 text-blue-500" />;
    }
    if (isVideoFile(fileType)) {
      return <Video className="h-4 w-4 text-purple-500" />;
    }
    if (isDocumentFile(fileType)) {
      return <FileText className="h-4 w-4 text-gray-500" />;
    }
    if (fileType === 'application/pdf') {
      return <FileText className="h-4 w-4 text-red-500" />;
    }
    return <File className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusVariant = (status: FileStatus) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'error':
        return 'destructive';
      case 'uploading':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusText = (status: FileStatus) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Failed';
      case 'uploading':
        return 'Uploading';
      default:
        return 'Pending';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB'];
    const i: number = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)}`;
    }
    return null;
  };

  const handleFileSelect = (selectedFiles: FileList): void => {
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles: File[] = [];
    Array.from(selectedFiles).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        alert(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    const newFiles: FileItem[] = validFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      progress: 0,
      status: 'pending' as FileStatus,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      handleFileSelect(selectedFiles);
    }
    e.target.value = '';
  };

  const removeFile = (fileId: number): void => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const updateFileStatus = (
    fileId: number,
    updates: Partial<FileItem>,
  ): void => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, ...updates } : f)),
    );
  };

  const simulateUpload = async (fileId: number): Promise<void> => {
    updateFileStatus(fileId, { status: 'uploading', progress: 0 });

    try {
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise<void>((resolve) => setTimeout(resolve, 100));
        updateFileStatus(fileId, { progress });
      }

      updateFileStatus(fileId, { status: 'completed' });

      if (onUploadComplete) {
        const completedFiles = files.filter((f) => f.status === 'completed');
        onUploadComplete(completedFiles);
      }
    } catch (error) {
      updateFileStatus(fileId, { status: 'error' });
      if (onUploadError) {
        onUploadError(
          error instanceof Error ? error.message : 'Upload failed',
          fileId,
        );
      }
    }
  };

  const uploadAll = async (): Promise<void> => {
    setIsUploading(true);
    const pendingFiles = files.filter((f) => f.status === 'pending');

    try {
      await Promise.all(pendingFiles.map((file) => simulateUpload(file.id)));
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinish = (): void => {
    // Reset form
    setFiles([]);
    setIsUploading(false);
    setIsDragging(false);

    // Close modal
    if (onClose) {
      onClose();
    }
  };

  const allFilesCompleted =
    files.length > 0 && files.every((f) => f.status === 'completed');

  return (
    <div className="space-y-4 px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
          <Upload className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold">Upload Your Files</h2>
        <p className="text-muted-foreground">
          Drag and drop your files or click to browse
        </p>
      </div>

      {/* Drag and Drop Area */}
      <Card className="py-0 border-2 border-dashed hover:rounded-xl">
        <CardContent
          className={cn(
            ' p-4 text-center transition-all',
            isDragging
              ? 'border-primary bg-primary/5 scale-105'
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleInputChange}
            accept={acceptedFileTypes.join(',')}
          />

          <div className="space-y-4">
            <div
              className={cn(
                'mx-auto flex h-16 w-16 items-center justify-center rounded-full transition-all',
                isDragging ? 'bg-primary/10' : 'bg-muted',
              )}
            >
              <Upload
                className={cn(
                  'h-8 w-8 transition-colors',
                  isDragging ? 'text-primary' : 'text-muted-foreground',
                )}
              />
            </div>

            <div className="space-y-2">
              <p className="text-lg font-medium">
                {isDragging ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-muted-foreground">or</p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Browse Files
              </Button>
            </div>

            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                Supports: Images, Videos, PDF, Documents (Max{' '}
                {formatFileSize(maxFileSize)} each)
              </p>
              <p>Maximum {maxFiles} files allowed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Selected Files ({files.length}/{maxFiles})
            </h3>
            {files.some((f) => f.status === 'pending') && (
              <Button
                onClick={uploadAll}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUploading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isUploading ? 'Uploading...' : 'Upload All'}
              </Button>
            )}
          </div>

          <div className="max-h-60 space-y-3 overflow-y-auto minimal-scrollbar">
            {files.map((fileItem) => (
              <Card key={fileItem.id} className="py-0">
                <CardContent className="flex items-center p-4">
                  <div className="mr-4 flex-shrink-0">
                    {getFileIcon(fileItem.file.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">
                        {fileItem.file.name}
                      </p>
                      <Badge
                        variant={getStatusVariant(fileItem.status)}
                        className="text-xs"
                      >
                        {getStatusText(fileItem.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(fileItem.file.size)}
                    </p>

                    {(fileItem.status === 'uploading' ||
                      fileItem.status === 'completed') && (
                      <div className="space-y-1">
                        <Progress value={fileItem.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {fileItem.status === 'completed'
                            ? 'Upload completed'
                            : `${fileItem.progress}% uploaded`}
                        </p>
                      </div>
                    )}

                    {fileItem.status === 'error' && (
                      <p className="text-xs text-destructive">Upload failed</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {fileItem.status === 'completed' && (
                      <CheckCircle2 className="h-5 w-5 text-blue-500" />
                    )}

                    {fileItem.status === 'pending' && (
                      <Button
                        onClick={() => simulateUpload(fileItem.id)}
                        variant="ghost"
                        size="sm"
                      >
                        Upload
                      </Button>
                    )}

                    <Button
                      onClick={() => removeFile(fileItem.id)}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Success Message & Actions */}
      {allFilesCompleted && (
        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-800">
                All files uploaded successfully!
              </p>
              <p className="text-blue-700">
                {files.length} file{files.length > 1 ? 's' : ''} processed
              </p>
            </div>
            <Button
              onClick={handleFinish}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Done
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

// Main Component with Trigger Button
export const FileUploadModal: React.FC<Omit<FileUploadFormProps, 'onClose'>> = (
  props,
) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { state } = useSidebar();
  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <SidebarMenuButton
        onClick={openModal}
        asChild
        className={cn(
          'flex justify-center items-center cursor-pointer',
          'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
          `${state == 'collapsed' ? 'gap-0' : 'gap-2'}`,
        )}
        tooltip="Upload Files"
      >
        <div>
          <Upload />
          <span>Upload Files</span>
        </div>
      </SidebarMenuButton>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="min-w-1/2 max-h-[90vh] overflow-y-auto hide-scrollbar">
          <DialogHeader>
            <DialogTitle className="sr-only">Upload Files</DialogTitle>
          </DialogHeader>
          <FileUploadForm {...props} onClose={closeModal} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileUploadModal;
