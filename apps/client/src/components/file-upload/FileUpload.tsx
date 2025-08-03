'use client';
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadIcon, FileIcon, XIcon } from 'lucide-react';

interface FileUploadProps {
  onFilesChange?: (files: File[]) => void;
  acceptedFileTypes?: string;
  maxFiles?: number;
  maxFileSize?: number; // in MB
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesChange,
  acceptedFileTypes = '*',
  maxFiles = 5,
  maxFileSize = 5, // 5MB default
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);

      const droppedFiles = Array.from(e.dataTransfer.files);
      const validFiles = droppedFiles.filter(
        (file) =>
          file.size <= maxFileSize * 1024 * 1024 &&
          (acceptedFileTypes === '*' || file.type.match(acceptedFileTypes)),
      );

      if (files.length + validFiles.length > maxFiles) {
        alert(`Chỉ được phép upload tối đa ${maxFiles} file.`);
        return;
      }

      setFiles((prev) => [...prev, ...validFiles]);
      if (onFilesChange) {
        onFilesChange([...files, ...validFiles]);
      }
    },
    [files, onFilesChange, acceptedFileTypes, maxFiles, maxFileSize],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter(
      (file) =>
        file.size <= maxFileSize * 1024 * 1024 &&
        (acceptedFileTypes === '*' || file.type.match(acceptedFileTypes)),
    );

    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Chỉ được phép upload tối đa ${maxFiles} file.`);
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
    if (onFilesChange) {
      onFilesChange([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      if (onFilesChange) {
        onFilesChange(newFiles);
      }
      return newFiles;
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver ? 'border-primary bg-primary/10' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Kéo và thả file vào đây hoặc{' '}
            <label
              htmlFor="file-upload"
              className="text-primary cursor-pointer hover:underline"
            >
              chọn file
            </label>
          </p>
          <input
            id="file-upload"
            type="file"
            multiple
            accept={acceptedFileTypes}
            className="hidden"
            onChange={handleFileInput}
          />
          <p className="mt-1 text-xs text-gray-500">
            Tối đa {maxFiles} file, mỗi file không quá {maxFileSize}MB
          </p>
        </div>
        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700">
              Danh sách file:
            </h4>
            <ul className="mt-2 space-y-2">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <FileIcon className="h-5 w-5 text-gray-400" />
                    <span>{file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {files.length > 0 && (
          <Button
            className="mt-4 w-full"
            onClick={() => {
              setFiles([]);
              if (onFilesChange) onFilesChange([]);
            }}
          >
            Xóa tất cả
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
