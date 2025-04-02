'use client';

import React, { useEffect, useState } from 'react';
import { Dashboard } from '@/components/reusable/Dashboard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Entity, EntityAPI } from '@/lib/api-services';
import { Plus, FileSymlink, Layers, Database, Edit, Trash2, FileText, Share2, PackagePlus } from 'lucide-react';
import Link from 'next/link';

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newEntity, setNewEntity] = useState({
    name: '',
    description: '',
    type: 'business',
    fields: [],
    relationships: []
  });

  const loadEntities = async () => {
    try {
      setLoading(true);
      const data = await EntityAPI.getAll();
      setEntities(data);
    } catch (error) {
      console.error('Error loading entities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntities();
  }, []);
  
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await EntityAPI.create({
        name: newEntity.name,
        description: newEntity.description,
        type: newEntity.type,
        fields: [],
        relationships: []
      });
      
      // Reset form
      setNewEntity({
        name: '',
        description: '',
        type: 'business',
        fields: [],
        relationships: []
      });
      
      // Close dialog
      setCreateDialogOpen(false);
      
      // Reload entities
      await loadEntities();
    } catch (error) {
      console.error('Error creating entity:', error);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEntity(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setNewEntity(prev => ({ ...prev, type: value }));
  };

  return (
    <Dashboard requireAuth={true}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Entities</h1>
            <p className="text-muted-foreground">
              Design, create, and manage data entities for your application.
            </p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-9 md:w-auto w-full">
                <Plus className="mr-2 h-4 w-4" />
                Create Entity
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create New Entity</DialogTitle>
                  <DialogDescription>
                    Create a new entity to model your application's data structure.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Entity name"
                      className="col-span-3"
                      value={newEntity.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select 
                      value={newEntity.type} 
                      onValueChange={handleSelectChange}
                    >
                      <SelectTrigger className="col-span-3">
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Entity description"
                      className="col-span-3"
                      value={newEntity.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Entity</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Entities</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="transactional">Transactional</TabsTrigger>
            <TabsTrigger value="reference">Reference</TabsTrigger>
          </TabsList>
          
          {['all', 'system', 'business', 'transactional', 'reference'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entities
                  .filter(entity => tab === 'all' || entity.type === tab)
                  .map(entity => (
                    <Card key={entity.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{entity.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {entity.fields.length} fields, {entity.relationships.length} relationships
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {entity.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {entity.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {entity.fields.slice(0, 3).map(field => (
                            <Badge key={field.id} variant="secondary" className="text-xs">
                              {field.name}
                            </Badge>
                          ))}
                          {entity.fields.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{entity.fields.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                        >
                          <Link href={`/entities/${entity.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <Link href={`/entities/${entity.id}/design`}>
                            <Layers className="h-4 w-4 mr-2" />
                            Design
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
              
              {entities.filter(entity => tab === 'all' || entity.type === tab).length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Database className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4 text-center">
                      No entities found. Create your first entity to start modeling your data.
                    </p>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Entity
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Entity Management</CardTitle>
            <CardDescription>
              Tools and actions for working with entities
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <PackagePlus className="h-5 w-5 mr-2 text-primary" />
                  Import Entities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Import entities from OpenAPI, JSON Schema, or database.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm">Import</Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Generate Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Generate code from your entity models.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm">Generate</Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-primary" />
                  Export Schema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Export entities as JSON Schema, TypeScript, or SQL.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm">Export</Button>
              </CardFooter>
            </Card>
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  );
}