'use client';

import React, { useEffect, useState } from 'react';
import { Dashboard } from '@/components/reusable/Dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, CheckCircle2, AlertTriangle, AlertCircle, Clock, ExternalLink, RefreshCcw } from 'lucide-react';
import { Service, ServiceAPI } from '@/lib/api-services';

const getStatusColor = (status: Service['status']) => {
  switch (status) {
    case 'up':
      return 'bg-green-500';
    case 'down':
      return 'bg-red-500';
    case 'degraded':
      return 'bg-yellow-500';
    case 'maintenance':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusBadge = (status: Service['status']) => {
  switch (status) {
    case 'up':
      return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="mr-1 h-3 w-3" /> Operational</Badge>;
    case 'down':
      return <Badge className="bg-red-500 hover:bg-red-600"><AlertCircle className="mr-1 h-3 w-3" /> Down</Badge>;
    case 'degraded':
      return <Badge className="bg-yellow-500 hover:bg-yellow-600"><AlertTriangle className="mr-1 h-3 w-3" /> Degraded</Badge>;
    case 'maintenance':
      return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="mr-1 h-3 w-3" /> Maintenance</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} minutes ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
  return `${Math.floor(diffSec / 86400)} days ago`;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadServices = async () => {
    try {
      setRefreshing(true);
      const data = await ServiceAPI.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadServices();
    
    // Refresh data every 60 seconds
    const interval = setInterval(() => {
      loadServices();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const overallStatus = () => {
    if (services.length === 0) return 'unknown';
    if (services.some(s => s.status === 'down')) return 'critical';
    if (services.some(s => s.status === 'degraded')) return 'warning';
    if (services.some(s => s.status === 'maintenance')) return 'maintenance';
    return 'healthy';
  };

  const getOverallStatusComponent = () => {
    const status = overallStatus();
    
    switch (status) {
      case 'healthy':
        return (
          <div className="flex items-center p-4 bg-green-100 text-green-800 rounded-lg">
            <CheckCircle2 className="h-6 w-6 mr-2" />
            <span className="text-lg font-medium">All services operational</span>
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center p-4 bg-yellow-100 text-yellow-800 rounded-lg">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <span className="text-lg font-medium">Some services are experiencing issues</span>
          </div>
        );
      case 'critical':
        return (
          <div className="flex items-center p-4 bg-red-100 text-red-800 rounded-lg">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span className="text-lg font-medium">Service outage detected</span>
          </div>
        );
      case 'maintenance':
        return (
          <div className="flex items-center p-4 bg-blue-100 text-blue-800 rounded-lg">
            <Clock className="h-6 w-6 mr-2" />
            <span className="text-lg font-medium">Scheduled maintenance in progress</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center p-4 bg-gray-100 text-gray-800 rounded-lg">
            <span className="text-lg font-medium">Service status unknown</span>
          </div>
        );
    }
  };

  return (
    <Dashboard requireAuth={true}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Services Status</h1>
            <p className="text-muted-foreground">
              Monitor the real-time status of all system services and components.
            </p>
          </div>
          <Button onClick={loadServices} disabled={refreshing} variant="outline" className="h-9 md:w-auto w-full">
            <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        
        {getOverallStatusComponent()}
        
        <Tabs defaultValue="status">
          <TabsList>
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {services.map(service => (
                <Card key={service.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{service.name}</CardTitle>
                        <CardDescription>
                          v{service.version}
                        </CardDescription>
                      </div>
                      <div>
                        {getStatusBadge(service.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last updated:</span>
                        <span>{formatTime(service.lastUpdated)}</span>
                      </div>
                      <div className="flex items-center mt-2">
                        <a 
                          href={service.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs flex items-center text-primary hover:underline"
                        >
                          Service URL <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle>Service Performance Metrics</CardTitle>
                <CardDescription>
                  Real-time metrics for all services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>CPU Usage</TableHead>
                      <TableHead>Memory</TableHead>
                      <TableHead>Req/Min</TableHead>
                      <TableHead>Uptime</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell className="font-medium">{service.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                            <span>{service.status.charAt(0).toUpperCase() + service.status.slice(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {service.metrics?.responseTime ? `${service.metrics.responseTime}ms` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {service.metrics?.usageCpu ? (
                            <div className="flex items-center space-x-2">
                              <Progress 
                                value={service.metrics.usageCpu} 
                                className="w-20" 
                              />
                              <span>{service.metrics.usageCpu}%</span>
                            </div>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {service.metrics?.usageMemory ? `${service.metrics.usageMemory}MB` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {service.metrics?.requestsPerMinute ?? 'N/A'}
                        </TableCell>
                        <TableCell>
                          {service.metrics?.uptime ? `${service.metrics.uptime}%` : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
}
