// Mock API service for demonstration purposes

export interface Service {
  id: string;
  name: string;
  status: 'up' | 'down' | 'degraded' | 'maintenance';
  url: string;
  version: string;
  lastUpdated: string;
  metrics?: {
    responseTime?: number;
    uptime?: number;
    usageCpu?: number;
    usageMemory?: number;
    requestsPerMinute?: number;
  };
}

export interface Documentation {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Entity {
  id: string;
  name: string;
  description: string;
  type: string;
  fields: EntityField[];
  relationships: EntityRelationship[];
  createdAt: string;
  updatedAt: string;
}

export interface EntityField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'enum' | 'object' | 'array';
  required: boolean;
  unique: boolean;
  defaultValue?: any;
  description?: string;
  enumValues?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface EntityRelationship {
  id: string;
  name: string;
  targetEntity: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  required: boolean;
  description?: string;
}

// Mock services data
const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'User Service',
    status: 'up',
    url: 'http://api.example.com/user-service',
    version: '1.2.3',
    lastUpdated: new Date(Date.now() - 120000).toISOString(),
    metrics: {
      responseTime: 42,
      uptime: 99.98,
      usageCpu: 12.5,
      usageMemory: 256,
      requestsPerMinute: 350
    }
  },
  {
    id: '2',
    name: 'Authentication Service',
    status: 'up',
    url: 'http://api.example.com/auth-service',
    version: '2.0.1',
    lastUpdated: new Date(Date.now() - 240000).toISOString(),
    metrics: {
      responseTime: 35,
      uptime: 99.99,
      usageCpu: 8.2,
      usageMemory: 192,
      requestsPerMinute: 420
    }
  },
  {
    id: '3',
    name: 'Payment Service',
    status: 'degraded',
    url: 'http://api.example.com/payment-service',
    version: '1.5.0',
    lastUpdated: new Date(Date.now() - 360000).toISOString(),
    metrics: {
      responseTime: 230,
      uptime: 98.75,
      usageCpu: 45.2,
      usageMemory: 512,
      requestsPerMinute: 120
    }
  },
  {
    id: '4',
    name: 'Notification Service',
    status: 'up',
    url: 'http://api.example.com/notification-service',
    version: '1.1.2',
    lastUpdated: new Date(Date.now() - 180000).toISOString(),
    metrics: {
      responseTime: 28,
      uptime: 99.95,
      usageCpu: 5.8,
      usageMemory: 128,
      requestsPerMinute: 220
    }
  },
  {
    id: '5',
    name: 'Analytics Service',
    status: 'maintenance',
    url: 'http://api.example.com/analytics-service',
    version: '0.9.5',
    lastUpdated: new Date(Date.now() - 7200000).toISOString(),
    metrics: {
      responseTime: 0,
      uptime: 0,
      usageCpu: 0,
      usageMemory: 0,
      requestsPerMinute: 0
    }
  },
  {
    id: '6',
    name: 'Content Service',
    status: 'down',
    url: 'http://api.example.com/content-service',
    version: '2.1.0',
    lastUpdated: new Date(Date.now() - 1800000).toISOString(),
    metrics: {
      responseTime: 500,
      uptime: 89.2,
      usageCpu: 95.0,
      usageMemory: 1024,
      requestsPerMinute: 5
    }
  }
];

// Mock documentation data
const MOCK_DOCS: Documentation[] = [
  {
    id: '1',
    title: 'Getting Started with the API',
    content: 'This guide will help you get started with our APIs. You will learn how to authenticate, make requests, and handle responses.',
    author: 'John Doe',
    category: 'Tutorial',
    tags: ['api', 'getting-started', 'authentication'],
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Authentication Service Documentation',
    content: 'The Authentication Service provides endpoints for user registration, login, token refresh, and password reset functionality.',
    author: 'Jane Smith',
    category: 'API Documentation',
    tags: ['authentication', 'security', 'oauth'],
    createdAt: '2024-03-10T09:30:00Z',
    updatedAt: '2024-03-20T14:15:00Z'
  },
  {
    id: '3',
    title: 'Payment Service Integration Guide',
    content: 'This document explains how to integrate with our Payment Service, including handling transactions, refunds, and subscription billing.',
    author: 'Mike Johnson',
    category: 'Integration',
    tags: ['payments', 'transactions', 'billing'],
    createdAt: '2024-02-28T13:45:00Z',
    updatedAt: '2024-03-18T11:20:00Z'
  },
  {
    id: '4',
    title: 'User Service API Reference',
    content: 'Complete reference for all User Service endpoints including user management, profiles, and preferences.',
    author: 'Sarah Williams',
    category: 'API Documentation',
    tags: ['users', 'profiles', 'reference'],
    createdAt: '2024-03-05T08:20:00Z',
    updatedAt: '2024-03-12T16:30:00Z'
  },
  {
    id: '5',
    title: 'Content Service Development Guide',
    content: 'This guide covers all aspects of working with the Content Service, including creating, updating, and retrieving content items.',
    author: 'David Lee',
    category: 'Development',
    tags: ['content', 'assets', 'media'],
    createdAt: '2024-03-01T11:10:00Z',
    updatedAt: '2024-03-22T09:45:00Z'
  },
  {
    id: '6',
    title: 'Notification Service Best Practices',
    content: 'Learn best practices for using the Notification Service efficiently, including template management, batching, and scheduling.',
    author: 'Emily Chen',
    category: 'Best Practices',
    tags: ['notifications', 'templates', 'scheduling'],
    createdAt: '2024-03-08T14:25:00Z',
    updatedAt: '2024-03-19T10:05:00Z'
  }
];

// Mock entity data
const MOCK_ENTITIES: Entity[] = [
  {
    id: '1',
    name: 'User',
    description: 'User entity for authentication and profile management',
    type: 'system',
    fields: [
      {
        id: '1',
        name: 'username',
        type: 'string',
        required: true,
        unique: true,
        description: 'Unique username for the user',
        validation: {
          min: 3,
          max: 50,
          pattern: '^[a-zA-Z0-9_-]+$',
          message: 'Username must be alphanumeric with _ or - only'
        }
      },
      {
        id: '2',
        name: 'email',
        type: 'string',
        required: true,
        unique: true,
        description: 'Email address of the user',
        validation: {
          pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
          message: 'Must be a valid email address'
        }
      },
      {
        id: '3',
        name: 'firstName',
        type: 'string',
        required: true,
        unique: false,
        description: 'First name of the user'
      },
      {
        id: '4',
        name: 'lastName',
        type: 'string',
        required: true,
        unique: false,
        description: 'Last name of the user'
      },
      {
        id: '5',
        name: 'role',
        type: 'enum',
        required: true,
        unique: false,
        defaultValue: 'user',
        enumValues: ['user', 'admin', 'moderator'],
        description: 'Role of the user in the system'
      },
      {
        id: '6',
        name: 'isActive',
        type: 'boolean',
        required: true,
        unique: false,
        defaultValue: true,
        description: 'Whether the user account is active'
      },
      {
        id: '7',
        name: 'dateOfBirth',
        type: 'date',
        required: false,
        unique: false,
        description: 'Date of birth of the user'
      }
    ],
    relationships: [
      {
        id: '1',
        name: 'profile',
        targetEntity: 'Profile',
        type: 'one-to-one',
        required: false,
        description: 'User profile with additional information'
      },
      {
        id: '2',
        name: 'posts',
        targetEntity: 'Post',
        type: 'one-to-many',
        required: false,
        description: 'Posts created by the user'
      }
    ],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Product',
    description: 'Product entity for e-commerce system',
    type: 'business',
    fields: [
      {
        id: '1',
        name: 'sku',
        type: 'string',
        required: true,
        unique: true,
        description: 'Stock keeping unit - unique product identifier',
        validation: {
          pattern: '^[A-Z]{2}-\\d{6}$',
          message: 'SKU must be in format XX-000000'
        }
      },
      {
        id: '2',
        name: 'name',
        type: 'string',
        required: true,
        unique: false,
        description: 'Name of the product',
        validation: {
          min: 3,
          max: 100
        }
      },
      {
        id: '3',
        name: 'description',
        type: 'string',
        required: false,
        unique: false,
        description: 'Detailed description of the product'
      },
      {
        id: '4',
        name: 'price',
        type: 'number',
        required: true,
        unique: false,
        description: 'Price of the product',
        validation: {
          min: 0
        }
      },
      {
        id: '5',
        name: 'stock',
        type: 'number',
        required: true,
        unique: false,
        defaultValue: 0,
        description: 'Available stock quantity',
        validation: {
          min: 0
        }
      },
      {
        id: '6',
        name: 'category',
        type: 'enum',
        required: true,
        unique: false,
        enumValues: ['electronics', 'clothing', 'books', 'home', 'sports'],
        description: 'Category of the product'
      },
      {
        id: '7',
        name: 'isActive',
        type: 'boolean',
        required: true,
        unique: false,
        defaultValue: true,
        description: 'Whether the product is available for sale'
      }
    ],
    relationships: [
      {
        id: '1',
        name: 'reviews',
        targetEntity: 'Review',
        type: 'one-to-many',
        required: false,
        description: 'Customer reviews for the product'
      },
      {
        id: '2',
        name: 'categories',
        targetEntity: 'Category',
        type: 'many-to-many',
        required: false,
        description: 'Categories the product belongs to'
      }
    ],
    createdAt: '2024-02-05T11:20:00Z',
    updatedAt: '2024-03-10T09:15:00Z'
  }
];

// Service API functions
export const ServiceAPI = {
  async getAll(): Promise<Service[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_SERVICES];
  },

  async getById(id: string): Promise<Service | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_SERVICES.find(service => service.id === id);
  },

  async updateStatus(id: string, status: Service['status']): Promise<Service | undefined> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const serviceIndex = MOCK_SERVICES.findIndex(service => service.id === id);
    
    if (serviceIndex === -1) return undefined;
    
    const updatedService = {
      ...MOCK_SERVICES[serviceIndex],
      status,
      lastUpdated: new Date().toISOString()
    };
    
    MOCK_SERVICES[serviceIndex] = updatedService;
    return updatedService;
  }
};

// Documentation API functions
export const DocumentationAPI = {
  async getAll(): Promise<Documentation[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_DOCS];
  },

  async getById(id: string): Promise<Documentation | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_DOCS.find(doc => doc.id === id);
  },

  async create(doc: Omit<Documentation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Documentation> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newDoc: Documentation = {
      ...doc,
      id: String(MOCK_DOCS.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    MOCK_DOCS.push(newDoc);
    return newDoc;
  },

  async update(id: string, updates: Partial<Documentation>): Promise<Documentation | undefined> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const docIndex = MOCK_DOCS.findIndex(doc => doc.id === id);
    if (docIndex === -1) return undefined;
    
    const updatedDoc = {
      ...MOCK_DOCS[docIndex],
      ...updates,
      id, // Ensure id doesn't change
      updatedAt: new Date().toISOString()
    };
    
    MOCK_DOCS[docIndex] = updatedDoc;
    return updatedDoc;
  },

  async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const docIndex = MOCK_DOCS.findIndex(doc => doc.id === id);
    if (docIndex === -1) return false;
    
    MOCK_DOCS.splice(docIndex, 1);
    return true;
  }
};

// Entity API functions
export const EntityAPI = {
  async getAll(): Promise<Entity[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MOCK_ENTITIES];
  },

  async getById(id: string): Promise<Entity | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_ENTITIES.find(entity => entity.id === id);
  },

  async create(entity: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Entity> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newEntity: Entity = {
      ...entity,
      id: String(MOCK_ENTITIES.length + 1),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    MOCK_ENTITIES.push(newEntity);
    return newEntity;
  },

  async update(id: string, updates: Partial<Entity>): Promise<Entity | undefined> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const entityIndex = MOCK_ENTITIES.findIndex(entity => entity.id === id);
    if (entityIndex === -1) return undefined;
    
    const updatedEntity = {
      ...MOCK_ENTITIES[entityIndex],
      ...updates,
      id, // Ensure id doesn't change
      updatedAt: new Date().toISOString()
    };
    
    MOCK_ENTITIES[entityIndex] = updatedEntity;
    return updatedEntity;
  },

  async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    const entityIndex = MOCK_ENTITIES.findIndex(entity => entity.id === id);
    if (entityIndex === -1) return false;
    
    MOCK_ENTITIES.splice(entityIndex, 1);
    return true;
  },

  async createField(entityId: string, field: Omit<EntityField, 'id'>): Promise<EntityField | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const entityIndex = MOCK_ENTITIES.findIndex(entity => entity.id === entityId);
    if (entityIndex === -1) return undefined;
    
    const newField: EntityField = {
      ...field,
      id: String(MOCK_ENTITIES[entityIndex].fields.length + 1)
    };
    
    MOCK_ENTITIES[entityIndex].fields.push(newField);
    MOCK_ENTITIES[entityIndex].updatedAt = new Date().toISOString();
    
    return newField;
  },

  async createRelationship(entityId: string, relationship: Omit<EntityRelationship, 'id'>): Promise<EntityRelationship | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const entityIndex = MOCK_ENTITIES.findIndex(entity => entity.id === entityId);
    if (entityIndex === -1) return undefined;
    
    const newRelationship: EntityRelationship = {
      ...relationship,
      id: String(MOCK_ENTITIES[entityIndex].relationships.length + 1)
    };
    
    MOCK_ENTITIES[entityIndex].relationships.push(newRelationship);
    MOCK_ENTITIES[entityIndex].updatedAt = new Date().toISOString();
    
    return newRelationship;
  }
};