'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Dashboard } from '@/components/reusable/Dashboard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Entity, EntityField, EntityRelationship, EntityAPI } from '@/lib/api-services';
import { ArrowLeft, Plus, Trash2, Save, RefreshCw, Database, Link2, Table, Layers } from 'lucide-react';
import Link from 'next/link';

export default function EntityDesignPage() {
  const router = useRouter();
  const params = useParams();
  const entityId = params?.id as string;
  
  const [entity, setEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('fields');
  
  // Field dialog state
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [newField, setNewField] = useState<Omit<EntityField, 'id'>>({
    name: '',
    type: 'string',
    required: false,
    unique: false,
    description: ''
  });
  
  // Relationship dialog state
  const [relationshipDialogOpen, setRelationshipDialogOpen] = useState(false);
  const [newRelationship, setNewRelationship] = useState<Omit<EntityRelationship, 'id'>>({
    name: '',
    targetEntity: '',
    type: 'one-to-many',
    required: false,
    description: ''
  });
  
  // Load entity data with useCallback
  const loadEntity = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await EntityAPI.getById(entityId);
      if (data) {
        setEntity(data);
      } else {
        // Entity not found, redirect to entities page
        router.push('/entities');
      }
    } catch (error) {
      console.error('Error loading entity:', error);
    } finally {
      setLoading(false);
    }
  }, [entityId, router]);
  
  useEffect(() => {
    loadEntity();
  }, [loadEntity]);
  
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewField(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFieldSelectChange = (name: string, value: string) => {
    setNewField(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFieldSwitchChange = (name: string, checked: boolean) => {
    setNewField(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleRelationshipChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRelationship(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRelationshipSelectChange = (name: string, value: string) => {
    setNewRelationship(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRelationshipSwitchChange = (name: string, checked: boolean) => {
    setNewRelationship(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!entity) return;
    
    try {
      const field = await EntityAPI.createField(entityId, newField);
      if (field) {
        // Reset form
        setNewField({
          name: '',
          type: 'string',
          required: false,
          unique: false,
          description: ''
        });
        
        // Close dialog
        setFieldDialogOpen(false);
        
        // Reload entity
        await loadEntity();
      }
    } catch (error) {
      console.error('Error creating field:', error);
    }
  };
  
  const handleCreateRelationship = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!entity) return;
    
    try {
      const relationship = await EntityAPI.createRelationship(entityId, newRelationship);
      if (relationship) {
        // Reset form
        setNewRelationship({
          name: '',
          targetEntity: '',
          type: 'one-to-many',
          required: false,
          description: ''
        });
        
        // Close dialog
        setRelationshipDialogOpen(false);
        
        // Reload entity
        await loadEntity();
      }
    } catch (error) {
      console.error('Error creating relationship:', error);
    }
  };
  
  if (loading) {
    return (
      <Dashboard requireAuth={true}>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 text-primary animate-spin" />
        </div>
      </Dashboard>
    );
  }
  
  if (!entity) {
    return (
      <Dashboard requireAuth={true}>
        <div className="flex flex-col items-center justify-center h-64">
          <Database className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Entity not found</p>
          <Button asChild>
            <Link href="/entities">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Entities
            </Link>
          </Button>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard requireAuth={true}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/entities">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{entity.name}</h1>
            <Badge variant="outline" className="capitalize">{entity.type}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Entity Details</CardTitle>
            <CardDescription>{entity.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entity-name">Name</Label>
              <Input id="entity-name" value={entity.name} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="entity-type">Type</Label>
              <Select defaultValue={entity.type}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System Entity</SelectItem>
                  <SelectItem value="business">Business Entity</SelectItem>
                  <SelectItem value="transactional">Transactional Entity</SelectItem>
                  <SelectItem value="reference">Reference Entity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="entity-description">Description</Label>
              <Textarea 
                id="entity-description" 
                value={entity.description} 
                className="mt-1" 
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="fields" className="flex items-center">
                <Table className="h-4 w-4 mr-2" />
                Fields ({entity.fields.length})
              </TabsTrigger>
              <TabsTrigger value="relationships" className="flex items-center">
                <Link2 className="h-4 w-4 mr-2" />
                Relationships ({entity.relationships.length})
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center">
                <Layers className="h-4 w-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'fields' && (
              <Dialog open={fieldDialogOpen} onOpenChange={setFieldDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <form onSubmit={handleCreateField}>
                    <DialogHeader>
                      <DialogTitle>Add Field</DialogTitle>
                      <DialogDescription>
                        Add a new field to the {entity.name} entity.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="field-name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="field-name"
                          name="name"
                          placeholder="Field name"
                          className="col-span-3"
                          value={newField.name}
                          onChange={handleFieldChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="field-type" className="text-right">
                          Type
                        </Label>
                        <Select 
                          value={newField.type} 
                          onValueChange={(value) => handleFieldSelectChange('type', value)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="enum">Enum</SelectItem>
                            <SelectItem value="object">Object</SelectItem>
                            <SelectItem value="array">Array</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <div className="text-right">
                          <Label htmlFor="field-required">Required</Label>
                        </div>
                        <div className="flex items-center space-x-2 col-span-3">
                          <Switch
                            id="field-required"
                            checked={newField.required}
                            onCheckedChange={(checked) => handleFieldSwitchChange('required', checked)}
                          />
                          <Label htmlFor="field-required">
                            {newField.required ? 'Required' : 'Optional'}
                          </Label>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <div className="text-right">
                          <Label htmlFor="field-unique">Unique</Label>
                        </div>
                        <div className="flex items-center space-x-2 col-span-3">
                          <Switch
                            id="field-unique"
                            checked={newField.unique}
                            onCheckedChange={(checked) => handleFieldSwitchChange('unique', checked)}
                          />
                          <Label htmlFor="field-unique">
                            {newField.unique ? 'Unique' : 'Not unique'}
                          </Label>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="field-description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="field-description"
                          name="description"
                          placeholder="Field description"
                          className="col-span-3"
                          value={newField.description || ''}
                          onChange={handleFieldChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Field</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            
            {activeTab === 'relationships' && (
              <Dialog open={relationshipDialogOpen} onOpenChange={setRelationshipDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Relationship
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <form onSubmit={handleCreateRelationship}>
                    <DialogHeader>
                      <DialogTitle>Add Relationship</DialogTitle>
                      <DialogDescription>
                        Add a new relationship to the {entity.name} entity.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rel-name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="rel-name"
                          name="name"
                          placeholder="Relationship name"
                          className="col-span-3"
                          value={newRelationship.name}
                          onChange={handleRelationshipChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rel-target" className="text-right">
                          Target Entity
                        </Label>
                        <Input
                          id="rel-target"
                          name="targetEntity"
                          placeholder="Target entity name"
                          className="col-span-3"
                          value={newRelationship.targetEntity}
                          onChange={handleRelationshipChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rel-type" className="text-right">
                          Type
                        </Label>
                        <Select 
                          value={newRelationship.type} 
                          onValueChange={(value) => handleRelationshipSelectChange('type', value as any)}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select relationship type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one-to-one">One-to-One</SelectItem>
                            <SelectItem value="one-to-many">One-to-Many</SelectItem>
                            <SelectItem value="many-to-one">Many-to-One</SelectItem>
                            <SelectItem value="many-to-many">Many-to-Many</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <div className="text-right">
                          <Label htmlFor="rel-required">Required</Label>
                        </div>
                        <div className="flex items-center space-x-2 col-span-3">
                          <Switch
                            id="rel-required"
                            checked={newRelationship.required}
                            onCheckedChange={(checked) => handleRelationshipSwitchChange('required', checked)}
                          />
                          <Label htmlFor="rel-required">
                            {newRelationship.required ? 'Required' : 'Optional'}
                          </Label>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="rel-description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="rel-description"
                          name="description"
                          placeholder="Relationship description"
                          className="col-span-3"
                          value={newRelationship.description || ''}
                          onChange={handleRelationshipChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Relationship</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <TabsContent value="fields" className="space-y-4">
            {entity.fields.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Table className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4 text-center">
                    No fields defined. Add your first field to define the entity structure.
                  </p>
                  <Button onClick={() => setFieldDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Fields</CardTitle>
                  <CardDescription>
                    Define the properties and attributes of the {entity.name} entity.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Type</th>
                          <th className="px-4 py-2 text-left">Required</th>
                          <th className="px-4 py-2 text-left">Unique</th>
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entity.fields.map((field) => (
                          <tr key={field.id} className="border-b hover:bg-muted/50">
                            <td className="px-4 py-2 font-medium">{field.name}</td>
                            <td className="px-4 py-2 capitalize">
                              <Badge variant="outline">{field.type}</Badge>
                            </td>
                            <td className="px-4 py-2">
                              {field.required ? (
                                <Badge variant="default" className="bg-green-500 hover:bg-green-500">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </td>
                            <td className="px-4 py-2">
                              {field.unique ? (
                                <Badge variant="default" className="bg-blue-500 hover:bg-blue-500">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-muted-foreground">
                              {field.description || 'No description'}
                            </td>
                            <td className="px-4 py-2 text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="relationships" className="space-y-4">
            {entity.relationships.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Link2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4 text-center">
                    No relationships defined. Add your first relationship to connect this entity with others.
                  </p>
                  <Button onClick={() => setRelationshipDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Relationship
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Relationships</CardTitle>
                  <CardDescription>
                    Define how the {entity.name} entity relates to other entities.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Target Entity</th>
                          <th className="px-4 py-2 text-left">Type</th>
                          <th className="px-4 py-2 text-left">Required</th>
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entity.relationships.map((relationship) => (
                          <tr key={relationship.id} className="border-b hover:bg-muted/50">
                            <td className="px-4 py-2 font-medium">{relationship.name}</td>
                            <td className="px-4 py-2">
                              <Badge variant="outline">{relationship.targetEntity}</Badge>
                            </td>
                            <td className="px-4 py-2 capitalize">
                              {relationship.type.split('-').join(' → ')}
                            </td>
                            <td className="px-4 py-2">
                              {relationship.required ? (
                                <Badge variant="default" className="bg-green-500 hover:bg-green-500">Yes</Badge>
                              ) : (
                                <Badge variant="outline">No</Badge>
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-muted-foreground">
                              {relationship.description || 'No description'}
                            </td>
                            <td className="px-4 py-2 text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Entity Preview</CardTitle>
                <CardDescription>
                  Preview of the {entity.name} entity as it would be represented in code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-md overflow-hidden">
                  <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono">
                    {`interface ${entity.name} {
  ${entity.fields.map(field => `${field.name}${field.required ? '' : '?'}: ${getTypeScriptType(field)};`).join('\n  ')}
${entity.relationships.length > 0 ? '  \n  // Relationships' : ''}
  ${entity.relationships.map(rel => `${rel.name}${rel.required ? '' : '?'}: ${getRelationshipType(rel)};`).join('\n  ')}
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>JSON Schema</CardTitle>
                <CardDescription>
                  JSON Schema representation of the {entity.name} entity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-md overflow-hidden">
                  <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono">
                    {`{
  "type": "object",
  "title": "${entity.name}",
  "description": "${entity.description}",
  "properties": {
    ${entity.fields.map(field => getJsonSchemaProperty(field)).join(',\n    ')}
  },
  "required": [${entity.fields.filter(f => f.required).map(f => `"${f.name}"`).join(', ')}]
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
}

function getTypeScriptType(field: EntityField): string {
  switch (field.type) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'date':
      return 'Date';
    case 'enum':
      if (field.enumValues && field.enumValues.length > 0) {
        return field.enumValues.map(v => `'${v}'`).join(' | ');
      }
      return 'string';
    case 'object':
      return 'Record<string, any>';
    case 'array':
      return 'any[]';
    default:
      return 'any';
  }
}

function getRelationshipType(relationship: EntityRelationship): string {
  switch (relationship.type) {
    case 'one-to-one':
      return relationship.targetEntity;
    case 'one-to-many':
      return `${relationship.targetEntity}[]`;
    case 'many-to-one':
      return relationship.targetEntity;
    case 'many-to-many':
      return `${relationship.targetEntity}[]`;
    default:
      return 'any';
  }
}

function getJsonSchemaProperty(field: EntityField): string {
  const baseType = (() => {
    switch (field.type) {
      case 'string':
        return '"type": "string"';
      case 'number':
        return '"type": "number"';
      case 'boolean':
        return '"type": "boolean"';
      case 'date':
        return '"type": "string", "format": "date-time"';
      case 'enum':
        if (field.enumValues && field.enumValues.length > 0) {
          return `"type": "string", "enum": [${field.enumValues.map(v => `"${v}"`).join(', ')}]`;
        }
        return '"type": "string"';
      case 'object':
        return '"type": "object"';
      case 'array':
        return '"type": "array", "items": { "type": "object" }';
      default:
        return '"type": "string"';
    }
  })();
  
  const description = field.description ? `, "description": "${field.description}"` : '';
  
  return `"${field.name}": {
      ${baseType}${description}${field.defaultValue !== undefined ? `, "default": ${JSON.stringify(field.defaultValue)}` : ''}
    }`;
}