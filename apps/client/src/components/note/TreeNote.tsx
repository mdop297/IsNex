import React from 'react';
import { SidebarContent, SidebarGroup, SidebarProvider } from '../ui/sidebar';

const TreeNote = () => {
  return (
    <div>
      <SidebarProvider>
        <SidebarContent>
          <SidebarGroup></SidebarGroup>
        </SidebarContent>
      </SidebarProvider>
    </div>
  );
};

export default TreeNote;
