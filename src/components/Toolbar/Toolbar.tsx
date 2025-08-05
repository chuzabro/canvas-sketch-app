import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCanvasStore } from '@/stores/useCanvasStore';
import {
  MousePointer2,
  Square,
  Circle,
  Minus,
  Type,
  Hand,
  RotateCcw,
  RotateCw,
  Download,
  Upload,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const Toolbar: React.FC = () => {
  const { 
    activeTool, 
    setActiveTool, 
    zoom, 
    setZoom, 
    undo, 
    redo, 
    clearCanvas 
  } = useCanvasStore();

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'pan', icon: Hand, label: 'Pan' },
  ] as const;

  const handleZoomIn = () => setZoom(zoom + 0.1);
  const handleZoomOut = () => setZoom(zoom - 0.1);

  return (
    <div className="bg-panel-bg border-b border-panel-border p-2 flex items-center gap-2">
      {/* Drawing Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTool(tool.id)}
              className={`
                w-8 h-8 p-0
                ${activeTool === tool.id 
                  ? 'bg-tool-active text-primary-foreground' 
                  : 'hover:bg-tool-hover'
                }
              `}
              title={tool.label}
            >
              <Icon className="w-4 h-4" />
            </Button>
          );
        })}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* History Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          className="w-8 h-8 p-0 hover:bg-tool-hover"
          title="Undo"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          className="w-8 h-8 p-0 hover:bg-tool-hover"
          title="Redo"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomOut}
          disabled={zoom <= 0.1}
          className="w-8 h-8 p-0 hover:bg-tool-hover"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-sm font-mono text-muted-foreground min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleZoomIn}
          disabled={zoom >= 5}
          className="w-8 h-8 p-0 hover:bg-tool-hover"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* File Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 hover:bg-tool-hover"
          title="Import"
        >
          <Upload className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 hover:bg-tool-hover"
          title="Export"
        >
          <Download className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1" />

      {/* Clear Canvas */}
      <Button
        variant="outline"
        size="sm"
        onClick={clearCanvas}
        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        Clear All
      </Button>
    </div>
  );
};

export default Toolbar;