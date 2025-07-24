
'use client';

import { AuthProvider } from '@/context/auth-context';
import AuthGuard from '@/components/admin/auth-guard';
import AdminSidebar from '@/components/admin/admin-sidebar';
import { useEffect, useState } from 'react';
import { getSetting } from './actions';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loadingLogo, setLoadingLogo] = useState(true);

  useEffect(() => {
    async function fetchLogo() {
      setLoadingLogo(true);
      const { value } = await getSetting('logoUrl');
      setLogoUrl(value || null);
      setLoadingLogo(false);
    }
    fetchLogo();
  }, []);


  return (
    <AuthProvider>
      <AuthGuard>
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar logoUrl={logoUrl} logoLoading={loadingLogo} />
          <main className="flex-1 flex flex-col bg-slate-50 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </AuthGuard>
    </AuthProvider>
  );
}
