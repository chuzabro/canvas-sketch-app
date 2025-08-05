import { create } from 'zustand';

export interface Shape {
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

export interface CanvasState {
  // Tools
  activeTool: 'select' | 'rectangle' | 'circle' | 'line' | 'text' | 'pan';
  
  // Canvas state
  zoom: number;
  pan: { x: number; y: number };
  
  // Shapes
  shapes: Shape[];
  selectedShapes: string[];
  
  // History
  history: Shape[][];
  historyIndex: number;
  
  // Actions
  setActiveTool: (tool: CanvasState['activeTool']) => void;
  setZoom: (zoom: number) => void;
  updatePan: (deltaX: number, deltaY: number) => void;
  resetPan: () => void;
  
  addShape: (shape: Shape) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  deleteShape: (id: string) => void;
  selectShape: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  // Initial state
  activeTool: 'select',
  zoom: 1,
  pan: { x: 0, y: 0 },
  shapes: [],
  selectedShapes: [],
  history: [[]],
  historyIndex: 0,

  // Tool actions
  setActiveTool: (tool) => set({ activeTool: tool }),
  
  // Zoom and pan
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),
  updatePan: (deltaX, deltaY) => {
    const { pan } = get();
    set({ pan: { x: pan.x + deltaX, y: pan.y + deltaY } });
  },
  resetPan: () => set({ pan: { x: 0, y: 0 } }),

  // Shape management
  addShape: (shape) => {
    const { shapes, history, historyIndex } = get();
    const newShapes = [...shapes, shape];
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newShapes);
    
    set({
      shapes: newShapes,
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },

  updateShape: (id, updates) => {
    const { shapes } = get();
    const newShapes = shapes.map(shape => 
      shape.id === id ? { ...shape, ...updates } : shape
    );
    set({ shapes: newShapes });
  },

  deleteShape: (id) => {
    const { shapes, selectedShapes } = get();
    const newShapes = shapes.filter(shape => shape.id !== id);
    const newSelection = selectedShapes.filter(shapeId => shapeId !== id);
    set({ 
      shapes: newShapes, 
      selectedShapes: newSelection 
    });
  },

  // Selection
  selectShape: (id, multi = false) => {
    const { selectedShapes } = get();
    if (multi) {
      const newSelection = selectedShapes.includes(id)
        ? selectedShapes.filter(shapeId => shapeId !== id)
        : [...selectedShapes, id];
      set({ selectedShapes: newSelection });
    } else {
      set({ selectedShapes: [id] });
    }
  },

  clearSelection: () => set({ selectedShapes: [] }),

  // History
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        shapes: history[newIndex],
        historyIndex: newIndex,
        selectedShapes: []
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        shapes: history[newIndex],
        historyIndex: newIndex,
        selectedShapes: []
      });
    }
  },

  clearCanvas: () => {
    set({
      shapes: [],
      selectedShapes: [],
      history: [[]],
      historyIndex: 0
    });
  }
}));