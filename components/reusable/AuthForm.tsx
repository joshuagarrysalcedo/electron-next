'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderIcon } from 'lucide-react';

/**
 * AuthForm - A reusable authentication form component
 * 
 * @author Joshua Salcedo
 */
interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onSuccess?: () => void;
  redirectPath?: string;
}

export function AuthForm({ 
  className, 
  onSuccess,
  redirectPath = '/dashboard',
  ...props 
}: AuthFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const success = await login(username, password);
      
      if (success) {
        if (onSuccess) {
          onSuccess();
        } else if (redirectPath) {
          router.push(redirectPath);
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {error && (
        <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <Button disabled={isLoading}>
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
      </form>
      
      <div className="text-sm text-muted-foreground text-center">
        <p>
          Test credentials: 
          <br />
          Admin - username: <strong>admin</strong>, password: <strong>admin</strong>
          <br />
          User - username: <strong>user</strong>, password: <strong>user</strong>
        </p>
      </div>
    </div>
  );
}