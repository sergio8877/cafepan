import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { ReactNode } from 'react';

export default function AuthLayout({
    title = '',
    description = '',
    header,
    children,
}: {
    title?: string;
    description?: string;
    header?: ReactNode; /////////////
    children: React.ReactNode;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description}>
            {header && <div className="mb-6">{header}</div>}
            {children}
        </AuthLayoutTemplate>
    );
}