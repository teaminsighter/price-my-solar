
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Sheet, BarChart, Users, LogOut, PanelLeft, Webhook, Code, Settings } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/webhooks', label: 'Webhooks', icon: Webhook },
  { href: '/admin/gtm', label: 'GTM', icon: Code },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    // The AuthGuard will handle the redirect
  };

  return (
    <aside className="hidden h-screen w-64 flex-col border-r bg-card text-card-foreground sm:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Image 
            src="https://firebasestorage.googleapis.com/v0/b/clariofs-3b19b.firebasestorage.app/o/PMS%20Images%2FPMS-Final-Logo-2.webp?alt=media&token=486ac4d9-d9dd-4921-ab19-0b4b55b4b2f1"
            alt="Price My Solar Logo"
            width={150}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-4 py-4 text-sm font-medium">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                pathname === href
                  ? 'bg-muted text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
         {user && (
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-sm font-medium leading-none">{user.displayName || 'Admin User'}</span>
                    <span className="text-xs text-muted-foreground leading-none">{user.email}</span>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
         )}
      </div>
    </aside>
  );
}
