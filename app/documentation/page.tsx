'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@/components/reusable/Dashboard';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Documentation, DocumentationAPI } from '@/lib/api-services';
import { Plus, Search, Tag, CalendarDays, User, FileText, Edit, Trash2 } from 'lucide-react';

export default function DocumentationPage() {
  const [docs, setDocs] = useState<Documentation[]>([]);
  const [filteredDocs, setFilteredDocs] = useState<Documentation[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Documentation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // New document form state
  const [newDoc, setNewDoc] = useState({
    title: '',
    content: '',
    author: '',
    category: '',
    tags: ''
  });
  
  const router = useRouter();

  const loadDocs = async () => {
    try {
      setLoading(true);
      const data = await DocumentationAPI.getAll();
      setDocs(data);
      setFilteredDocs(data);
      
      // Extract unique categories and tags
      const uniqueCategories = Array.from(new Set(data.map(doc => doc.category)));
      setCategories(uniqueCategories);
      
      const uniqueTags = Array.from(new Set(data.flatMap(doc => doc.tags)));
      setAllTags(uniqueTags);
    } catch (error) {
      console.error('Error loading documentation:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  useEffect(() => {
    // Filter docs when search query, category, or docs change
    let filtered = [...docs];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) || 
        doc.content.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }
    
    setFilteredDocs(filtered);
  }, [searchQuery, selectedCategory, docs]);

  const handleViewDoc = (doc: Documentation) => {
    setSelectedDoc(doc);
    setActiveTab('view');
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDoc(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Format tags from comma-separated string to array
      const tagsArray = newDoc.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const created = await DocumentationAPI.create({
        title: newDoc.title,
        content: newDoc.content,
        author: newDoc.author || 'Anonymous',
        category: newDoc.category || 'Uncategorized',
        tags: tagsArray
      });
      
      // Reset form
      setNewDoc({
        title: '',
        content: '',
        author: '',
        category: '',
        tags: ''
      });
      
      // Refresh the docs list
      await loadDocs();
      
      // Show the created doc
      setSelectedDoc(created);
      setActiveTab('view');
    } catch (error) {
      console.error('Error creating documentation:', error);
    }
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Dashboard requireAuth={true}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
            <p className="text-muted-foreground">
              Browse, search, and create documentation for services and APIs.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => setActiveTab('create')} 
              className="h-9 md:w-auto w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Document
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="browse">Browse</TabsTrigger>
            {selectedDoc && <TabsTrigger value="view">View Document</TabsTrigger>}
            <TabsTrigger value="create">Create New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="md:w-1/4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div 
                      onClick={() => handleCategoryFilter(null)}
                      className={`cursor-pointer p-2 rounded hover:bg-muted ${!selectedCategory ? 'bg-muted' : ''}`}
                    >
                      All Categories
                    </div>
                    {categories.map(category => (
                      <div 
                        key={category}
                        onClick={() => handleCategoryFilter(category)}
                        className={`cursor-pointer p-2 rounded hover:bg-muted ${selectedCategory === category ? 'bg-muted' : ''}`}
                      >
                        {category}
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Popular Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 10).map(tag => (
                        <Badge key={tag} variant="outline" className="cursor-pointer">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:w-3/4 space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documentation..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                </div>
                
                {filteredDocs.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-muted-foreground">No documentation found matching your search criteria.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredDocs.map(doc => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex justify-between items-start">
                          <span>{doc.title}</span>
                          <Badge>{doc.category}</Badge>
                        </CardTitle>
                        <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {doc.author}
                          </div>
                          <div className="flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            Last updated: {formatDate(doc.updatedAt)}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="line-clamp-2 text-sm">{doc.content}</p>
                        <div className="flex mt-2 gap-1 flex-wrap">
                          {doc.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDoc(doc)}
                          className="w-full mt-2 sm:w-auto"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Document
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="view">
            {selectedDoc && (
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      <CardTitle className="text-2xl">{selectedDoc.title}</CardTitle>
                      <CardDescription className="flex flex-col md:flex-row gap-2 md:items-center mt-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {selectedDoc.author}
                        </div>
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          Created: {formatDate(selectedDoc.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          Updated: {formatDate(selectedDoc.updatedAt)}
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="ml-auto">{selectedDoc.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="prose max-w-none dark:prose-invert">
                  <div className="whitespace-pre-line">{selectedDoc.content}</div>
                  
                  <div className="flex gap-1 mt-6 flex-wrap">
                    {selectedDoc.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('browse')}
                  >
                    Back to List
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="create">
            <Card>
              <form onSubmit={handleCreateDoc}>
                <CardHeader>
                  <CardTitle>Create New Document</CardTitle>
                  <CardDescription>
                    Add new documentation for services, APIs, or other resources.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      placeholder="Document title"
                      value={newDoc.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea 
                      id="content" 
                      name="content" 
                      placeholder="Document content..."
                      value={newDoc.content}
                      onChange={handleInputChange}
                      rows={10}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input 
                        id="author" 
                        name="author" 
                        placeholder="Your name"
                        value={newDoc.author}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input 
                        id="category" 
                        name="category" 
                        placeholder="Documentation category"
                        value={newDoc.category}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input 
                      id="tags" 
                      name="tags" 
                      placeholder="api, authentication, guide"
                      value={newDoc.tags}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setActiveTab('browse')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Document
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
}
