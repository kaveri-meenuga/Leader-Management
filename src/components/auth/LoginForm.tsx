import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, BarChart3 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onToggleMode: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@leadflow.com',
      password: 'password',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data.email, data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md shadow-large border-border">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-foreground">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to your LeadFlow account to continue managing your leads
          </CardDescription>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-9"
                {...register('email')}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="pl-9 pr-9"
                {...register('password')}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Demo Credentials Helper */}
          <div className="p-3 rounded-lg bg-accent/50 border border-accent">
            <p className="text-xs text-accent-foreground font-medium mb-1">Demo Credentials:</p>
            <p className="text-xs text-accent-foreground">Email: demo@leadflow.com</p>
            <p className="text-xs text-accent-foreground">Password: password</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || isLoading}
            aria-describedby="login-button-description"
          >
            {isSubmitting || isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
          
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={onToggleMode}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Don't have an account? Sign up
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};