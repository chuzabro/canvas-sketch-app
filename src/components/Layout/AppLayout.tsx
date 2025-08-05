import React from 'react';
import Toolbar from '@/components/Toolbar/Toolbar';
import PartSidebar from '@/components/Sidebar/PartSidebar';
import CanvasWorkspace from '@/components/Canvas/CanvasWorkspace';
import PropertiesPanel from '@/components/Properties/PropertiesPanel';
import StatusBar from '@/components/Layout/StatusBar';

const AppLayout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header with App Title */}
      <header className="bg-panel-header border-b border-panel-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">CtrlSketch Pro</h1>
              <p className="text-xs text-muted-foreground">Professional HVAC & Building Automation Design</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Untitled Project</span>
            <div className="w-2 h-2 bg-success rounded-full" title="Saved" />
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <Toolbar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Library */}
        <PartSidebar />

        {/* Canvas Workspace */}
        <CanvasWorkspace />

        {/* Right Panel - Properties */}
        <PropertiesPanel />
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
};

export default AppLayout;