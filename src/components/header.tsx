"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SolarSaverLogo } from "@/components/icons";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "#faq", label: "FAQ" },
    { href: "#articles", label: "Articles" },
    { href: "#contact", label: "Contact Us" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <SolarSaverLogo className="h-8 w-8 text-primary" />
          <span className="hidden sm:inline">Price My Solar NZ</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Button className="hidden rounded-full md:flex" asChild>
            <Link href="#get-quotes">Get Quotes</Link>
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col p-6">
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                        <SolarSaverLogo className="h-8 w-8 text-primary" />
                        <span>Price My Solar</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>
                <nav className="flex flex-col gap-4 text-lg">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <Button className="mt-6 rounded-full" asChild>
                  <Link href="#get-quotes" onClick={() => setIsOpen(false)}>Get Quotes</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
