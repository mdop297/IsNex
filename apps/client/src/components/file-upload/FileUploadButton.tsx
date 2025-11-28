import { SidebarMenuButton, useSidebar } from '../ui/sidebar';
import { FileUploadFormProps } from './UploadManager';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { FileUploadForm } from './FileUpload';
import { cn } from '@/lib/utils';
import { useUploadFileStore } from './useUploadFileStore';

// Main Component with Trigger Button
export const FileUploadButton: React.FC<
  Omit<FileUploadFormProps, 'onClose'>
> = (props) => {
  const { openUploadModal, setOpenUploadModal, toggleUploadModal } =
    useUploadFileStore();
  const { state } = useSidebar();

  return (
    <>
      {/* Trigger Button */}
      <SidebarMenuButton
        onClick={toggleUploadModal}
        asChild
        className={cn(
          'flex justify-center items-center cursor-pointer ',
          'bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-foreground',
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
      <Dialog open={openUploadModal} onOpenChange={setOpenUploadModal}>
        <DialogContent className="min-w-1/2 max-h-[90vh] overflow-y-auto hide-scrollbar">
          <DialogHeader>
            <DialogTitle className="sr-only text-foreground">
              Upload Files
            </DialogTitle>
          </DialogHeader>
          <FileUploadForm {...props} onClose={toggleUploadModal} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FileUploadButton;
