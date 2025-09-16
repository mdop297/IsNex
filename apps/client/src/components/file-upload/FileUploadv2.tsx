import React, {
  useState,
  useRef,
  ChangeEvent,
  DragEvent,
  useEffect,
} from 'react';
import {
  Upload,
  X,
  File,
  Image,
  Video,
  FileText,
  CheckCircle2,
  Loader2,
  Clock,
  Play,
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
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { SidebarMenuButton, useSidebar } from '../ui/sidebar';
import {
  BackgroundUploadManager,
  FileItem,
  FileStatus,
  FileUploadFormProps,
} from './UploadManager';

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
  onClose,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  //  eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [uploadStats, setUploadStats] = useState({
    total: 0,
    selected: 0,
    completed: 0,
    uploading: 0,
    queued: 0,
    error: 0,
    pendingSelected: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadManager = BackgroundUploadManager.getInstance();

  // Listen to background upload updates
  useEffect(() => {
    const handleUploadUpdate = (updatedFiles: FileItem[]) => {
      setFiles(updatedFiles);
      setUploadStats(uploadManager.getUploadStats());
    };

    uploadManager.addListener(handleUploadUpdate);

    // Initialize with current files
    setFiles(uploadManager.getFiles());
    setUploadStats(uploadManager.getUploadStats());

    return () => {
      uploadManager.removeListener(handleUploadUpdate);
    };
  }, [uploadManager]);

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
      case 'queued':
        return 'outline';
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
      case 'queued':
        return 'Queued';
      default:
        return 'Ready';
    }
  };

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'queued':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Upload className="h-4 w-4 text-muted-foreground" />;
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

    // Add files to manager (they will be in pending state)
    validFiles.forEach((file, index) => {
      const fileItem: FileItem = {
        id: Date.now() + index,
        file,
        progress: 0,
        status: 'pending' as FileStatus,
        selected: true, // Auto-select new files
      };

      uploadManager.addFile(fileItem);
    });
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
    uploadManager.removeFile(fileId);
  };

  const handleSelectAll = (checked: boolean): void => {
    uploadManager.selectAllFiles(checked);
  };

  const handleFileToggle = (fileId: number): void => {
    uploadManager.toggleFileSelection(fileId);
  };

  const startUploads = (): void => {
    uploadManager.startSelectedUploads();
  };

  // Check if there are files that are not completed
  const hasActiveUploads = (): boolean => {
    return uploadManager.hasActiveUploads();
  };

  // // Handle close with warning check
  // const handleCloseAttempt = (): void => {
  //   if (hasActiveUploads()) {
  //     setShowWarning(true);
  //   } else {
  //     handleFinish();
  //   }
  // };

  const handleFinish = (): void => {
    setIsDragging(false);
    setShowWarning(false);

    // Close modal
    if (onClose) {
      onClose();
    }
  };

  // // Force close and cancel all uploads
  // const handleForceClose = (): void => {
  //   // Cancel all active uploads
  //   files.forEach((file) => {
  //     if (file.status === 'uploading' || file.status === 'queued') {
  //       uploadManager.removeFile(file.id);
  //     }
  //   });

  //   setShowWarning(false);
  //   handleFinish();
  // };

  // // Cancel close action
  // const handleCancelClose = (): void => {
  //   setShowWarning(false);
  // };

  const allFilesCompleted =
    files.length > 0 && uploadStats.completed === files.length;
  const hasFiles = files.length > 0;
  const hasPendingFiles = files.some((f) => f.status === 'pending');
  const hasSelectedPendingFiles = uploadStats.pendingSelected > 0;
  const allPendingSelected =
    files.filter((f) => f.status === 'pending').length ===
    files.filter((f) => f.status === 'pending' && f.selected).length;

  return (
    <>
      <div className="space-y-4 px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <Upload className="h-8 w-8 text-foreground" />
          </div>
          <h2 className="text-2xl font-semibold">Upload Your Files</h2>
          <p className="text-muted-foreground">
            Select files, review them, then click Upload All to start
          </p>
        </div>

        {/* Upload Stats Summary */}
        {hasFiles && (
          <Alert className="border-ring bg-secondary">
            <Upload className="h-4 w-4 text-foreground" />
            <AlertDescription>
              <div className="flex items-center justify-between w-full">
                <div className="flex justify-between w-full">
                  <p className="font-medium text-foreground">
                    Progress: {uploadStats.completed}/{uploadStats.total} files
                    completed
                  </p>
                  <div className="flex gap-4 text-sm text-foreground">
                    <span>✅ {uploadStats.selected} selected</span>
                    {uploadStats.uploading > 0 && (
                      <span>🔄 {uploadStats.uploading} uploading</span>
                    )}
                    {uploadStats.queued > 0 && (
                      <span>⏳ {uploadStats.queued} queued</span>
                    )}
                    {uploadStats.error > 0 && (
                      <span>❌ {uploadStats.error} failed</span>
                    )}
                  </div>
                </div>
                {uploadStats.uploading > 0 && (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

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

            <div className="space-y-3">
              <div
                className={cn(
                  'mx-auto flex h-12 w-12 items-center justify-center rounded-full transition-all',
                  isDragging ? 'bg-primary/10' : 'bg-muted',
                )}
              >
                <Upload
                  className={cn(
                    'h-5 w-5 transition-colors',
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
                <p>Maximum {maxFiles} files • Review before upload</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {hasFiles && (
          <div className="space-y-4 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center  gap-3 whitespace-nowrap w-full">
                <h3 className="text-lg font-medium">
                  Files ({files.length}/{maxFiles})
                </h3>

                {hasPendingFiles && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={allPendingSelected}
                      onCheckedChange={handleSelectAll}
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Select All ({uploadStats.pendingSelected} selected)
                    </label>
                  </div>
                )}
                {/* Success Message & Actions */}
                {allFilesCompleted && (
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <p className="font-medium text-green-800">
                        All files uploaded successfully!
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Button
                        onClick={() => uploadManager.clearCompleted()}
                        variant="outline"
                        size="sm"
                      >
                        Clear Completed
                      </Button>
                      <Button
                        onClick={handleFinish}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {hasSelectedPendingFiles && (
                <Button
                  onClick={startUploads}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Upload Selected ({uploadStats.pendingSelected})
                </Button>
              )}
            </div>

            <div className="max-h-60 space-y-3 overflow-y-auto minimal-scrollbar">
              {files.map((fileItem) => (
                <Card key={fileItem.id} className="py-0">
                  <CardContent className="flex items-center p-4">
                    <div className="mr-3 flex-shrink-0">
                      {fileItem.status === 'pending' && (
                        <Checkbox
                          checked={fileItem.selected}
                          onCheckedChange={() => handleFileToggle(fileItem.id)}
                        />
                      )}
                      {fileItem.status !== 'pending' && (
                        <div className="w-4 h-4 flex items-center justify-center">
                          {getStatusIcon(fileItem.status)}
                        </div>
                      )}
                    </div>

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
                          className="text-xs flex items-center gap-1"
                        >
                          {getStatusText(fileItem.status)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between space-x-2 whitespace-nowrap">
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(fileItem.file.size)}
                        </p>

                        {(fileItem.status === 'uploading' ||
                          fileItem.status === 'completed') && (
                          <>
                            <Progress
                              value={fileItem.progress}
                              className="h-2 [&_[data-slot=progress-indicator]]:bg-green-500"
                            />
                            <p className="text-xs text-muted-foreground">
                              {fileItem.status === 'completed'
                                ? 'Completed'
                                : `${fileItem.progress}% uploaded`}
                            </p>
                          </>
                        )}
                      </div>

                      {fileItem.status === 'queued' && (
                        <p className="text-xs text-amber-600">
                          Waiting in queue...
                        </p>
                      )}

                      {fileItem.status === 'error' && (
                        <p className="text-xs text-destructive">
                          Upload failed
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
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

        {/* Action Buttons */}
        <div className="flex justify-end pt-4">
          {hasFiles && hasActiveUploads() && (
            <div className="text-xs text-muted-foreground">
              * Uploads will continue in background if you close this window
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Main Component with Trigger Button
export const FileUploadButton: React.FC<
  Omit<FileUploadFormProps, 'onClose'>
> = (props) => {
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
          'flex justify-center items-center cursor-pointer ',
          'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-foreground',
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
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Handle close through FileUploadForm
          }
          setIsModalOpen(open);
        }}
      >
        <DialogContent className="min-w-1/2 max-h-[90vh] overflow-y-auto hide-scrollbar">
          <DialogHeader>
            <DialogTitle className="sr-only text-foreground">
              Upload Files
            </DialogTitle>
          </DialogHeader>
          <FileUploadForm {...props} onClose={closeModal} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileUploadButton;
