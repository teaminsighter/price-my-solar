
import Link from "next/link";
import Image from "next/image";

type FooterProps = {
  logoUrl?: string | null;
}

export function Footer({ logoUrl }: FooterProps) {
  return (
    <footer className="w-full">
      <div className="bg-gradient-to-b from-primary to-orange-400 text-primary-foreground">
        <div className="container mx-auto px-4 py-12 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-start gap-4">
              {logoUrl && (
                <Link href="/" className="flex items-center gap-2 text-xl font-bold">
                   <Image 
                    src={logoUrl}
                    alt="Price My Solar Logo"
                    width={200}
                    height={50}
                    className="h-10 w-auto"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </Link>
              )}
              <p className="text-sm text-primary-foreground/80">
                Compare solar quotes from qualified NZ installers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm md:col-span-2 md:grid-cols-3">
              <div>
                <h3 className="mb-4 font-bold">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="transition-colors hover:text-primary-foreground/80">Terms & Conditions</Link></li>
                  <li><Link href="#" className="transition-colors hover:text-primary-foreground/80">Privacy Policy</Link></li>
                  <li><Link href="#faq" className="transition-colors hover:text-primary-foreground/80">FAQ</Link></li>
                  <li><Link href="#articles" className="transition-colors hover:text-primary-foreground/80">Articles</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-bold">Contact Info</h3>
                <address className="not-italic space-y-1">
                  <p>221 Park Rise Rd,</p>
                  <p>Campbells Bay, Auckland</p>
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card text-foreground">
        <div className="container mx-auto px-4 py-4 md:px-6">
          <div className="text-center text-xs">
            <p>&copy; 2025 Price My Solar. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
