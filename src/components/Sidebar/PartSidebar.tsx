import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Layers, Grid, Zap, Settings, Thermometer } from 'lucide-react';

interface ComponentCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  components: ComponentItem[];
}

interface ComponentItem {
  id: string;
  name: string;
  description: string;
  category: string;
}

const PartSidebar: React.FC = () => {
  const categories: ComponentCategory[] = [
    {
      id: 'hvac',
      name: 'HVAC Components',
      icon: Thermometer,
      components: [
        { id: 'ahu', name: 'Air Handler', description: 'Main air handling unit', category: 'hvac' },
        { id: 'vav', name: 'VAV Box', description: 'Variable air volume terminal', category: 'hvac' },
        { id: 'damper', name: 'Damper', description: 'Airflow control damper', category: 'hvac' },
        { id: 'fan', name: 'Fan', description: 'Ventilation fan unit', category: 'hvac' },
      ]
    },
    {
      id: 'controls',
      name: 'Control Devices',
      icon: Settings,
      components: [
        { id: 'controller', name: 'DDC Controller', description: 'Direct digital controller', category: 'controls' },
        { id: 'sensor', name: 'Temperature Sensor', description: 'Room temperature sensor', category: 'controls' },
        { id: 'actuator', name: 'Actuator', description: 'Valve/damper actuator', category: 'controls' },
        { id: 'panel', name: 'Control Panel', description: 'Operator interface panel', category: 'controls' },
      ]
    },
    {
      id: 'electrical',
      name: 'Electrical',
      icon: Zap,
      components: [
        { id: 'transformer', name: 'Transformer', description: 'Power transformer', category: 'electrical' },
        { id: 'breaker', name: 'Circuit Breaker', description: 'Electrical protection', category: 'electrical' },
        { id: 'relay', name: 'Relay', description: 'Control relay', category: 'electrical' },
      ]
    },
    {
      id: 'network',
      name: 'Network',
      icon: Grid,
      components: [
        { id: 'gateway', name: 'BACnet Gateway', description: 'Protocol gateway', category: 'network' },
        { id: 'router', name: 'Network Router', description: 'BACnet router', category: 'network' },
        { id: 'switch', name: 'Ethernet Switch', description: 'Network switch', category: 'network' },
      ]
    }
  ];

  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  const filteredCategories = categories.map(category => ({
    ...category,
    components: category.components.filter(component =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.components.length > 0);

  const handleDragStart = (e: React.DragEvent, component: ComponentItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
  };

  return (
    <div className="w-64 bg-panel-bg border-r border-panel-border flex flex-col h-full">
      <div className="p-4 border-b border-panel-border">
        <h2 className="font-semibold text-foreground mb-3">Component Library</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            const isExpanded = activeCategory === category.id || activeCategory === null;

            return (
              <Card key={category.id} className="bg-background border-border">
                <CardHeader 
                  className="pb-2 cursor-pointer"
                  onClick={() => setActiveCategory(
                    activeCategory === category.id ? null : category.id
                  )}
                >
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    {category.name}
                    <Badge variant="secondary" className="ml-auto">
                      {category.components.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {category.components.map((component) => (
                        <div
                          key={component.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, component)}
                          className="p-2 rounded border border-border hover:bg-secondary cursor-grab active:cursor-grabbing transition-colors"
                        >
                          <div className="font-medium text-sm text-foreground">
                            {component.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {component.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-panel-border">
        <Button variant="outline" size="sm" className="w-full">
          <Layers className="w-4 h-4 mr-2" />
          Manage Library
        </Button>
      </div>
    </div>
  );
};

export default PartSidebar;