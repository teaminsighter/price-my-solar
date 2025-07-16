
'use client';

import { AuthProvider } from '@/context/auth-context';
import AuthGuard from '@/components/admin/auth-guard';
import AdminSidebar from '@/components/admin/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AuthGuard>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 bg-slate-50 p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
