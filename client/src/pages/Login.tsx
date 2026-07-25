import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card.js';

// Validation Schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Must be a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { authState, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Route where the user wanted to go, default to dashboard
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // If already authenticated, redirect to destination
  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [authState.isAuthenticated, navigate, from]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const success = await login(data.email, data.password);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 transition-colors duration-300">
      {/* Decorative Blob */}
      <div className="glow-blob top-[10%] left-[10%] bg-blue-500" />
      <div className="glow-blob bottom-[10%] right-[10%] bg-indigo-500" />

      {/* Back button */}
      <Link
        to="/"
        className="absolute left-4 top-4 flex items-center gap-1.5 rounded-xl border border-slate-200/50 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:bg-slate-50 dark:border-slate-800/40 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-850"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <Card className="w-full max-w-md border border-slate-200/50 dark:border-slate-800/40 p-2 md:p-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Enter your credentials to access the LeadDesk dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@leaddesk.com"
              id="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              id="password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full rounded-xl py-3 shadow-md mt-2"
              isLoading={isSubmitting}
            >
              Sign In
            </Button>
          </form>

          {/* Quick instructions container */}
          <div className="flex gap-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 p-4 border border-slate-200/40 dark:border-slate-800/40">
            <ShieldAlert className="h-5 w-5 text-brand-550 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">Default Credentials</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Use <strong className="text-slate-700 dark:text-slate-300">admin@leaddesk.com</strong> / <strong className="text-slate-700 dark:text-slate-300">AdminPass123!</strong> if accessing the platform for the first time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
