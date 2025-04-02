'use client';

export const dynamic = 'force-static';

import React, { useEffect, useState } from 'react';
import { Dashboard } from '@/components/reusable/Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3Icon, ServerIcon, FileTextIcon, ArrowRightIcon, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Service, ServiceAPI, Documentation, DocumentationAPI } from '@/lib/api-services';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * DashboardPage - Main admin dashboard page
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [docs, setDocs] = useState<Documentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cpuUsageData, setCpuUsageData] = useState<any[]>([]);
  const [requestsData, setRequestsData] = useState<any[]>([]);
  
  // Function to get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load services and docs in parallel
        const [servicesData, docsData] = await Promise.all([
          ServiceAPI.getAll(),
          DocumentationAPI.getAll()
        ]);
        
        setServices(servicesData);
        setDocs(docsData);
        
        // Generate mock chart data based on services
        generateChartData(servicesData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const generateChartData = (services: Service[]) => {
    // CPU usage chart data - last 24 hours
    const cpuData = Array(24).fill(0).map((_, i) => {
      const hour = i;
      const time = `${hour}:00`;
      
      // Create data points for each service
      const servicePoints: Record<string, number> = {};
      services.forEach(service => {
        if (service.status !== 'down' && service.status !== 'maintenance') {
          // Generate somewhat realistic data based on the service CPU usage
          const baseCpu = service.metrics?.usageCpu || 10;
          const randomVariation = Math.random() * 10 - 5; // -5 to +5 variation
          servicePoints[service.name] = Math.max(0, Math.min(100, baseCpu + randomVariation));
        } else {
          servicePoints[service.name] = 0;
        }
      });
      
      return {
        time,
        ...servicePoints
      };
    });
    
    // Requests per minute chart data - last 24 hours
    const requestsData = Array(24).fill(0).map((_, i) => {
      const hour = i;
      const time = `${hour}:00`;
      
      // Create data points for each service
      const servicePoints: Record<string, number> = {};
      services.forEach(service => {
        if (service.status !== 'down' && service.status !== 'maintenance') {
          // Generate somewhat realistic data based on the service requests per minute
          const baseRequests = service.metrics?.requestsPerMinute || 50;
          
          // Apply time-of-day pattern (busier during work hours)
          let timeMultiplier = 1;
          if (hour >= 9 && hour <= 17) { // 9 AM to 5 PM
            timeMultiplier = 1.5;
          } else if (hour >= 1 && hour <= 5) { // 1 AM to 5 AM
            timeMultiplier = 0.3;
          }
          
          const randomVariation = Math.random() * 30 - 10; // -10 to +20 variation
          servicePoints[service.name] = Math.max(0, baseRequests * timeMultiplier + randomVariation);
        } else {
          servicePoints[service.name] = 0;
        }
      });
      
      return {
        time,
        ...servicePoints
      };
    });
    
    setCpuUsageData(cpuData);
    setRequestsData(requestsData);
  };
  
  const getServiceStatusCounts = () => {
    return {
      up: services.filter(s => s.status === 'up').length,
      degraded: services.filter(s => s.status === 'degraded').length,
      down: services.filter(s => s.status === 'down').length,
      maintenance: services.filter(s => s.status === 'maintenance').length,
      total: services.length
    };
  };
  
  const getAverageResponseTime = () => {
    const operationalServices = services.filter(s => s.status === 'up' || s.status === 'degraded');
    if (operationalServices.length === 0) return 0;
    
    const sum = operationalServices.reduce((acc, s) => acc + (s.metrics?.responseTime || 0), 0);
    return Math.round(sum / operationalServices.length);
  };
  
  const getCriticalServices = () => {
    return services.filter(s => s.status === 'down' || s.status === 'degraded');
  };
  
  const statusCounts = getServiceStatusCounts();
  const avgResponseTime = getAverageResponseTime();
  const criticalServices = getCriticalServices();
  
  return (
    <Dashboard requireAuth={true}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              {getGreeting()}, {user?.name}. Welcome to your admin dashboard.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/services">
                <ServerIcon className="mr-2 h-4 w-4" />
                Manage Services
              </Link>
            </Button>
            <Button asChild>
              <Link href="/documentation">
                <FileTextIcon className="mr-2 h-4 w-4" />
                Documentation
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Status overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current status of all services and components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex flex-col p-3 bg-green-50 dark:bg-green-950 rounded-md">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span className="font-medium">Operational</span>
                </div>
                <div className="text-3xl font-bold mt-2">{statusCounts.up}</div>
                <div className="text-sm text-muted-foreground">
                  {statusCounts.up === statusCounts.total 
                    ? 'All services operational' 
                    : `${Math.round((statusCounts.up / statusCounts.total) * 100)}% of services`}
                </div>
              </div>
              
              <div className="flex flex-col p-3 bg-yellow-50 dark:bg-yellow-950 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="font-medium">Degraded</span>
                </div>
                <div className="text-3xl font-bold mt-2">{statusCounts.degraded}</div>
                <div className="text-sm text-muted-foreground">
                  {statusCounts.degraded > 0 
                    ? `${Math.round((statusCounts.degraded / statusCounts.total) * 100)}% of services degraded` 
                    : 'No degraded services'}
                </div>
              </div>
              
              <div className="flex flex-col p-3 bg-red-50 dark:bg-red-950 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <span className="font-medium">Down</span>
                </div>
                <div className="text-3xl font-bold mt-2">{statusCounts.down}</div>
                <div className="text-sm text-muted-foreground">
                  {statusCounts.down > 0 
                    ? `${Math.round((statusCounts.down / statusCounts.total) * 100)}% of services down` 
                    : 'No services down'}
                </div>
              </div>
              
              <div className="flex flex-col p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                <div className="flex items-center">
                  <ServerIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium">Avg Response</span>
                </div>
                <div className="text-3xl font-bold mt-2">{avgResponseTime}ms</div>
                <div className="text-sm text-muted-foreground">
                  {avgResponseTime < 50 
                    ? 'Excellent response time' 
                    : avgResponseTime < 100 
                      ? 'Good response time' 
                      : 'Needs optimization'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Critical services */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Critical Services</CardTitle>
              <CardDescription>
                Services requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {criticalServices.length === 0 ? (
                <div className="flex items-center justify-center p-6 text-center">
                  <div>
                    <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-4" />
                    <p className="text-lg font-medium">All systems operational</p>
                    <p className="text-sm text-muted-foreground">No services require attention</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {criticalServices.map(service => (
                    <div key={service.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-muted-foreground">{service.url}</div>
                      </div>
                      <div className="flex items-center">
                        <div 
                          className={`rounded-full h-2 w-2 mr-2 ${service.status === 'down' ? 'bg-red-500' : 'bg-yellow-500'}`} 
                        />
                        <span className="capitalize">{service.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/services">
                  <ServerIcon className="mr-2 h-4 w-4" />
                  View All Services
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Recent documents */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Recent Documentation</CardTitle>
              <CardDescription>
                Latest documentation updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {docs.length === 0 ? (
                <div className="text-center p-6">
                  <p className="text-muted-foreground">No documentation available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {docs.slice(0, 3).map(doc => (
                    <div key={doc.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Updated {new Date(doc.updatedAt).toLocaleDateString()} by {doc.author}
                        </div>
                      </div>
                      <div className="text-sm px-2 py-1 bg-primary/10 rounded-md">
                        {doc.category}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/documentation">
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Browse Documentation
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>CPU Usage</CardTitle>
              <CardDescription>24-hour service CPU usage</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cpuUsageData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip />
                  {services.map((service, index) => (
                    <Area 
                      key={service.id}
                      type="monotone" 
                      dataKey={service.name} 
                      stackId="1"
                      stroke={`hsl(${index * 50}, 70%, 50%)`}
                      fill={`hsl(${index * 50}, 70%, 50%)`}
                      fillOpacity={0.5}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Requests per Minute</CardTitle>
              <CardDescription>24-hour traffic for each service</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={requestsData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  {services.map((service, index) => (
                    <Area 
                      key={service.id}
                      type="monotone" 
                      dataKey={service.name} 
                      stackId="1"
                      stroke={`hsl(${(index * 50) + 150}, 70%, 50%)`}
                      fill={`hsl(${(index * 50) + 150}, 70%, 50%)`}
                      fillOpacity={0.5}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick actions */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Management</CardTitle>
              <CardDescription>
                Monitor and control services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View detailed service status, metrics, and performance data.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/services">
                  View Services <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Manage API documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create, edit, and organize documentation for APIs and services.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/documentation">
                  Documentation Portal <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Entity Designer</CardTitle>
              <CardDescription>
                Design data models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create and manage data entities, fields, and relationships.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/entities">
                  Entity Designer <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage system settings, notifications, and maintenance schedules.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/settings">
                  Settings <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Dashboard>
  );
}
