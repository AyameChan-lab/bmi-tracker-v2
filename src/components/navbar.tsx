'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';

export function Navbar() {
    const { data: session } = useSession();

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Activity className="h-6 w-6" />
                    <span>BMI Tracker</span>
                </Link>
                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            <span className="text-sm font-medium hidden sm:inline-block">
                                Hello, {session.user?.name || session.user?.email}
                            </span>
                            <Button variant="ghost" onClick={() => signOut()}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button>Register</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
