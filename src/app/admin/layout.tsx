
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
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 flex flex-col bg-slate-50 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
