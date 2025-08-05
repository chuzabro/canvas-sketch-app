import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvasStore } from '@/stores/useCanvasStore';

interface Point {
  x: number;
  y: number;
}

interface Shape {
  id: string;
  type: 'rectangle' | 'circle' | 'line' | 'text';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  endX?: number;
  endY?: number;
  text?: string;
  stroke: string;
  fill: string;
  strokeWidth: number;
}

const CanvasWorkspace: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  
  const { 
    activeTool, 
    shapes, 
    selectedShapes, 
    zoom, 
    pan, 
    addShape, 
    selectShape, 
    clearSelection,
    updatePan 
  } = useCanvasStore();

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const gridSize = 20 * zoom;
    ctx.strokeStyle = 'hsl(var(--canvas-grid))';
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = (pan.x % gridSize); x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = (pan.y % gridSize); y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [zoom, pan]);

  const drawShape = useCallback((ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.strokeStyle = shape.stroke;
    ctx.fillStyle = shape.fill;
    ctx.lineWidth = shape.strokeWidth;

    const x = (shape.x + pan.x) * zoom;
    const y = (shape.y + pan.y) * zoom;

    switch (shape.type) {
      case 'rectangle':
        if (shape.width && shape.height) {
          const width = shape.width * zoom;
          const height = shape.height * zoom;
          ctx.fillRect(x, y, width, height);
          ctx.strokeRect(x, y, width, height);
        }
        break;
      case 'circle':
        if (shape.radius) {
          ctx.beginPath();
          ctx.arc(x, y, shape.radius * zoom, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        }
        break;
      case 'line':
        if (shape.endX !== undefined && shape.endY !== undefined) {
          const endX = (shape.endX + pan.x) * zoom;
          const endY = (shape.endY + pan.y) * zoom;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
        break;
    }

    // Draw text label if present
    if (shape.text) {
      ctx.fillStyle = shape.stroke;
      ctx.font = `${12 * zoom}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      let textX = x;
      let textY = y;
      
      if (shape.type === 'rectangle' && shape.width && shape.height) {
        textX = x + (shape.width * zoom) / 2;
        textY = y + (shape.height * zoom) / 2;
      }
      
      ctx.fillText(shape.text, textX, textY);
    }

    // Draw selection indicator
    if (selectedShapes.includes(shape.id)) {
      ctx.strokeStyle = 'hsl(var(--primary))';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      if (shape.type === 'rectangle' && shape.width && shape.height) {
        ctx.strokeRect(x - 2, y - 2, shape.width * zoom + 4, shape.height * zoom + 4);
      } else if (shape.type === 'circle' && shape.radius) {
        ctx.beginPath();
        ctx.arc(x, y, shape.radius * zoom + 2, 0, 2 * Math.PI);
        ctx.stroke();
      }
      
      ctx.setLineDash([]);
    }
  }, [selectedShapes, zoom, pan]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid(ctx, canvas);
    
    // Draw all shapes
    shapes.forEach(shape => drawShape(ctx, shape));
    
    // Draw current shape being drawn
    if (currentShape) {
      drawShape(ctx, currentShape);
    }
  }, [shapes, currentShape, drawGrid, drawShape]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [redrawCanvas]);

  const getCanvasPoint = (e: React.MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / zoom,
      y: (e.clientY - rect.top - pan.y) / zoom
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool === 'select') {
      // Handle selection logic here
      const point = getCanvasPoint(e);
      // For now, just clear selection
      clearSelection();
      return;
    }

    const point = getCanvasPoint(e);
    setStartPoint(point);
    setIsDrawing(true);

    if (activeTool !== 'pan') {
      const newShape: Shape = {
        id: `shape-${Date.now()}`,
        type: activeTool as any,
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        radius: 0,
        endX: point.x,
        endY: point.y,
        stroke: '#2563eb',
        fill: 'rgba(37, 99, 235, 0.1)',
        strokeWidth: 2
      };
      setCurrentShape(newShape);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return;

    const point = getCanvasPoint(e);

    if (activeTool === 'pan') {
      const deltaX = (e.clientX - startPoint.x) / zoom;
      const deltaY = (e.clientY - startPoint.y) / zoom;
      updatePan(deltaX, deltaY);
      return;
    }

    if (currentShape) {
      const updatedShape = { ...currentShape };
      
      switch (activeTool) {
        case 'rectangle':
          updatedShape.width = Math.abs(point.x - startPoint.x);
          updatedShape.height = Math.abs(point.y - startPoint.y);
          updatedShape.x = Math.min(startPoint.x, point.x);
          updatedShape.y = Math.min(startPoint.y, point.y);
          break;
        case 'circle':
          const radius = Math.sqrt(
            Math.pow(point.x - startPoint.x, 2) + Math.pow(point.y - startPoint.y, 2)
          );
          updatedShape.radius = radius;
          break;
        case 'line':
          updatedShape.endX = point.x;
          updatedShape.endY = point.y;
          break;
      }
      
      setCurrentShape(updatedShape);
      redrawCanvas();
    }
  };

  const handleMouseUp = () => {
    if (currentShape && isDrawing && activeTool !== 'pan') {
      addShape(currentShape);
    }
    
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentShape(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json'));
      const point = getCanvasPoint(e as any);
      
      // Create a new shape from the dropped component
      const newShape: Shape = {
        id: `${componentData.id}-${Date.now()}`,
        type: 'rectangle', // Default to rectangle for components
        x: point.x,
        y: point.y,
        width: 80,
        height: 60,
        stroke: '#2563eb',
        fill: 'rgba(37, 99, 235, 0.1)',
        strokeWidth: 2,
        text: componentData.name
      };
      
      addShape(newShape);
    } catch (error) {
      console.error('Failed to drop component:', error);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-canvas-bg border border-border relative overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
    </div>
  );
};

export default CanvasWorkspace;