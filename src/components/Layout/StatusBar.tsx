import React from 'react';
import { useCanvasStore } from '@/stores/useCanvasStore';

const StatusBar: React.FC = () => {
  const { shapes, selectedShapes, zoom, activeTool } = useCanvasStore();

  return (
    <footer className="bg-panel-bg border-t border-panel-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span>Grid: 20px</span>
        <span>Snap: Enabled</span>
        <span>Tool: {activeTool}</span>
        <span>Zoom: {Math.round(zoom * 100)}%</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Objects: {shapes.length}</span>
        <span>Selected: {selectedShapes.length}</span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-success rounded-full" />
          Ready
        </span>
      </div>
    </footer>
  );
};

export default StatusBar;