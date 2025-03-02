'use client';

import React from 'react';
import Image from "next/image";
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, HomeIcon, LogInIcon, LayoutDashboardIcon } from 'lucide-react';

/**
 * Home - Landing page component
 * 
 * @author Joshua Salcedo
 */
export default function Home() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HomeIcon className="h-6 w-6" />
            <span className="text-xl font-bold">Electron Next</span>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button asChild>
                <Link href="/dashboard">
                  <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href="/login">
                  <LogInIcon className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8 text-center">
          <Image
            className="mx-auto dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          
          <h1 className="text-4xl font-bold tracking-tight">Electron Next App</h1>
          
          <p className="text-xl text-muted-foreground">
            A cross-platform application built with Electron and Next.js
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="gap-2">
                <Link href="/login">
                  Login to continue
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Button>
            )}
            
            <Button asChild variant="outline" size="lg">
              <a 
                href="https://github.com/your-username/electron-next" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <GithubIcon className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 pt-12">
            <div className="border rounded-lg p-6">
              <DesktopIcon className="h-12 w-12 mb-4 mx-auto text-primary" />
              <h2 className="text-xl font-bold mb-2">Desktop App</h2>
              <p className="text-muted-foreground">
                Run as a desktop application on Windows, macOS, and Linux with Electron.
              </p>
            </div>
            
            <div className="border rounded-lg p-6">
              <SmartphoneIcon className="h-12 w-12 mb-4 mx-auto text-primary" />
              <h2 className="text-xl font-bold mb-2">Mobile App</h2>
              <p className="text-muted-foreground">
                Run as a mobile application on iOS and Android with Capacitor.
              </p>
            </div>
            
            <div className="border rounded-lg p-6">
              <GlobeIcon className="h-12 w-12 mb-4 mx-auto text-primary" />
              <h2 className="text-xl font-bold mb-2">Web App</h2>
              <p className="text-muted-foreground">
                Run as a web application in any modern browser with Next.js.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-muted/40 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Electron Next App. Created by Joshua Salcedo.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Icon components
function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function DesktopIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  );
}

function SmartphoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <line x1="12" x2="12.01" y1="18" y2="18" />
    </svg>
  );
}

function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
