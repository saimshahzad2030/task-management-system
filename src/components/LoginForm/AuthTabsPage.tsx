"use client"
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner"
// shadcn/ui components - adjust import paths to your project setup
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// --- Validation Schemas ---
const signupSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Passwords don't match",
  });

type SignupFormValues = z.infer<typeof signupSchema>;

const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// --- SignupForm Component ---
export function SignupForm({ onSubmit }: { onSubmit?: (data: SignupFormValues) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', username: '', password: '', confirmPassword: '' },
  });

  const submit = async (data: SignupFormValues) => {
    if (onSubmit) return onSubmit(data);
    // Example placeholder: replace with your API call
    console.log('Signup data:', data);
    // reset() if you want to clear the form on success
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input className="mt-2" id="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input className="mt-2" id="username" placeholder="yourusername" {...register('username')} />
            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input className="mt-2" id="password" type="password" placeholder="Password" {...register('password')} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input className="mt-2" id="confirmPassword" type="password" placeholder="Confirm password" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create account'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- LoginForm Component ---
export function LoginForm({ onSubmit }: { onSubmit?: (data: LoginFormValues) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrUsername: '', password: '' },
  });
const router = useRouter()
  const submit = async (data: LoginFormValues) => {
    if (onSubmit) return onSubmit(data);
    const loadingToast = toast.loading("Checking credentials...");

  try {
    // Fake async check — replace with real API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (data.emailOrUsername === "user@tms.com" && data.password === "tms-123") {
      toast.dismiss(loadingToast); // remove loading
      toast.success("Login Successful");
      router.push("/user-tasks");
    } else {
      toast.dismiss(loadingToast);
      toast.error("Wrong Credentials! Please try again.");
    }

  } catch (err) {
    toast.dismiss(loadingToast);
    toast.error("Something went wrong!");
  }
    console.log('Login data:', data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <Label htmlFor="emailOrUsername">Email or username</Label>
            <Input className="mt-2" id="emailOrUsername" placeholder="you@example.com or username" {...register('emailOrUsername')} />
            {errors.emailOrUsername && <p className="text-sm text-red-500">{errors.emailOrUsername.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input className="mt-2" id="password" type="password" placeholder="Password" {...register('password')} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// --- Main Tabs Page Component (default export) ---
export default function AuthTabsPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      {/* Center card with shadow (Theme: Card with Shadow) */}
      <div className="w-full max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: illustration or gradient panel */}
          <div className="hidden md:flex items-center justify-center rounded-2xl bg-gradient-to-br from-gray-600 to-gray-900 p-8 text-white shadow-2xl">
            <div className="max-w-xs">
              <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
              <p className="opacity-90">Sign in to continue to your dashboard. Or create an account — it only takes a minute.</p>
            </div>
          </div>

          {/* Right: Tabs + Forms */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-full">
              <Tabs value={tab} onValueChange={(v) => setTab(v as 'login' | 'signup')} className="w-full">
                
                <div className="flex justify-center">
                  <TabsContent value="login">
                    <LoginForm />
                    <div className="text-center mt-4">
                      <p className="text-sm">
                        Don't have an account?{' '}
                        <button className="cursor-pointer underline" onClick={() => setTab('signup')}>
                          Create one
                        </button>
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="signup">
                    <SignupForm />
                    <div className="text-center mt-4">
                      <p className="text-sm">
                        Already have an account?{' '}
                        <button className="underline cursor-pointer" onClick={() => setTab('login')}>
                          Sign in
                        </button>
                      </p>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

 