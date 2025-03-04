'use client';

export const dynamic = 'force-static';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { AuthCard } from '../../components/reusable/AuthCard';
import { FormInput } from '../../components/reusable/FormInput';
import { Button } from '../../components/ui/button';
import { AlertCircleIcon, LoaderIcon } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import Link from 'next/link';

/**
 * LoginPage - User login page component
 * 
 * @author Joshua Salcedo
 */
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!username || !password) {
      setError('Please enter both username and password');
      setIsLoading(false);
      return;
    }
    
    try {
      const success = await login(username, password);
      
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md">
        <AuthCard
          title="Login"
          description="Enter your credentials to access your account"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <FormInput
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
              disabled={isLoading}
              required
            />
            
            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isLoading}
              required
            />
            
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </div>
            
            <div className="text-sm text-center text-muted-foreground">
              <p>
                Test credentials: 
                <br />
                Admin - username: <strong>admin</strong>, password: <strong>admin</strong>
                <br />
                User - username: <strong>user</strong>, password: <strong>user</strong>
              </p>
            </div>
            
            <div className="text-center text-sm">
              <Link href="/" className="text-primary hover:underline">
                Return to home
              </Link>
            </div>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}