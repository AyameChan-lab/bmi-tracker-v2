'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface AuthFormProps {
    type: 'login' | 'register';
}

export function AuthForm({ type }: AuthFormProps) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (type === 'register') {
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, name }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || 'Registration failed');
                }

                // Auto login after register
                const loginRes = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });

                if (loginRes?.error) {
                    throw new Error(loginRes.error);
                }

                router.push('/');
                router.refresh();
            } else {
                const res = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                });

                if (res?.error) {
                    throw new Error('Invalid email or password');
                }

                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{type === 'login' ? 'Login' : 'Create an account'}</CardTitle>
                <CardDescription>
                    {type === 'login'
                        ? 'Enter your email below to login to your account'
                        : 'Enter your email below to create your account'}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <div className="grid w-full items-center gap-4">
                        {type === 'register' && (
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        )}
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder='123456'
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full" type="submit" disabled={loading}>
                        {loading ? 'Loading...' : type === 'login' ? 'Sign In' : 'Sign Up'}
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        {type === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <Link
                            href={type === 'login' ? '/register' : '/login'}
                            className="text-primary hover:underline"
                        >
                            {type === 'login' ? 'Sign Up' : 'Sign In'}
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
