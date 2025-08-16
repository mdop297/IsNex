import PdfViewer from '@/components/pdf/PDFViewer/PDFViewer';
import { SidebarProvider } from '@/components/ui/sidebar';
import WorkspaceSidebar from '@/components/workspace/Sidebar';
import React, { use } from 'react';

const WorkspaceMode = ({ params }: { params: Promise<{ w_id: string }> }) => {
  const { w_id } = use(params);

  return (
    <SidebarProvider
    // style={
    //   {
    //     '--sidebar-width': '15rem',
    //     '--sidebar-width-icon': '15rem',
    //   } as React.CSSProperties
    // }
    >
      <div className="flex-1 flex w-full h-screen">
        {/* document browser */}
        <WorkspaceSidebar href={`/workspace/${w_id}/overview`} />
        {/* pdf reader */}
        <div className="flex-1 h-full bg-green-800">
          <PdfViewer fileUrl="https://arxiv.org/pdf/2109.02653" />
        </div>
        {/* note editor */}
        <div className="flex-1 h-full bg-blue-800"> Note Editor</div>
        {/* chat panel */}
        {/* <div className="flex-1 h-full bg-yellow-800"> Chat panel</div> */}
      </div>
    </SidebarProvider>
  );
};

export default WorkspaceMode;
