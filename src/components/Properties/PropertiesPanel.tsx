import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCanvasStore } from '@/stores/useCanvasStore';
import { Settings2, Palette, Move, RotateCw } from 'lucide-react';

const PropertiesPanel: React.FC = () => {
  const { selectedShapes, shapes, updateShape } = useCanvasStore();
  
  const selectedShape = selectedShapes.length === 1 
    ? shapes.find(s => s.id === selectedShapes[0])
    : null;

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedShape) {
      updateShape(selectedShape.id, { [property]: value });
    }
  };

  if (!selectedShape) {
    return (
      <div className="w-80 bg-panel-bg border-l border-panel-border p-4">
        <div className="text-center text-muted-foreground">
          <Settings2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select an object to view properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-panel-bg border-l border-panel-border p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Properties</h3>
        <Badge variant="secondary" className="ml-auto">
          {selectedShape.type}
        </Badge>
      </div>

      {/* Position & Size */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Move className="w-4 h-4" />
            Position & Size
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="x" className="text-xs">X</Label>
              <Input
                id="x"
                type="number"
                value={Math.round(selectedShape.x)}
                onChange={(e) => handlePropertyChange('x', parseFloat(e.target.value) || 0)}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="y" className="text-xs">Y</Label>
              <Input
                id="y"
                type="number"
                value={Math.round(selectedShape.y)}
                onChange={(e) => handlePropertyChange('y', parseFloat(e.target.value) || 0)}
                className="h-8"
              />
            </div>
          </div>
          
          {selectedShape.type === 'rectangle' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="width" className="text-xs">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={Math.round(selectedShape.width || 0)}
                  onChange={(e) => handlePropertyChange('width', parseFloat(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-xs">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={Math.round(selectedShape.height || 0)}
                  onChange={(e) => handlePropertyChange('height', parseFloat(e.target.value) || 0)}
                  className="h-8"
                />
              </div>
            </div>
          )}

          {selectedShape.type === 'circle' && (
            <div>
              <Label htmlFor="radius" className="text-xs">Radius</Label>
              <Input
                id="radius"
                type="number"
                value={Math.round(selectedShape.radius || 0)}
                onChange={(e) => handlePropertyChange('radius', parseFloat(e.target.value) || 0)}
                className="h-8"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="stroke" className="text-xs">Stroke Color</Label>
            <div className="flex gap-2">
              <Input
                id="stroke"
                type="color"
                value={selectedShape.stroke}
                onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                className="w-12 h-8 p-1"
              />
              <Input
                type="text"
                value={selectedShape.stroke}
                onChange={(e) => handlePropertyChange('stroke', e.target.value)}
                className="h-8 font-mono text-xs"
                placeholder="#000000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="fill" className="text-xs">Fill Color</Label>
            <div className="flex gap-2">
              <Input
                id="fill"
                type="color"
                value={selectedShape.fill.replace(/rgba?\([^)]+\)/, '#3b82f6')}
                onChange={(e) => handlePropertyChange('fill', e.target.value)}
                className="w-12 h-8 p-1"
              />
              <Input
                type="text"
                value={selectedShape.fill}
                onChange={(e) => handlePropertyChange('fill', e.target.value)}
                className="h-8 font-mono text-xs"
                placeholder="rgba(59, 130, 246, 0.1)"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="strokeWidth" className="text-xs">Stroke Width</Label>
            <Input
              id="strokeWidth"
              type="number"
              min="1"
              max="10"
              value={selectedShape.strokeWidth}
              onChange={(e) => handlePropertyChange('strokeWidth', parseInt(e.target.value) || 1)}
              className="h-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <RotateCw className="w-4 h-4 mr-2" />
            Duplicate
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Delete
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesPanel;