import { AuthForm } from '@/components/auth-form';

export default function RegisterPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <AuthForm type="register" />
        </div>
    );
}
