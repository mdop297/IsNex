'use client';

interface PDFPreviewProps {
  fileUrl: string;
}

const PDFPreview = ({ fileUrl }: PDFPreviewProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex overflow-hidden h-full">
        <div className=" flex-1 relative ">
          <iframe src={`${fileUrl}`} className="w-full h-full"></iframe>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
