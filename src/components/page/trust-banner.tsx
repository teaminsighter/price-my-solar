
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export function TrustBanner() {
  return (
    <section className="w-full bg-card py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-6 text-center md:flex-row md:gap-10">
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Badge variant="secondary" className="px-4 py-1 text-sm">Top New Zealand Installers</Badge>
              <Badge variant="outline" className="border-accent text-accent px-4 py-1 text-sm">NZ No.1 Solar Comparison Site</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Only vetted, SEANZ-registered solar companies.</p>
          </div>
          <Link href="#" target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-80 flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-10 w-10 text-primary" />
             <span className="font-semibold">SEANZ Member</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
