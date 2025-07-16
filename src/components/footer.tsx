import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
               <Image 
                src="https://firebasestorage.googleapis.com/v0/b/clariofs-3b19b.firebasestorage.app/o/PMS%20Images%2FPMS-Final-Logo-2.webp?alt=media&token=486ac4d9-d9dd-4921-ab19-0b4b55b4b2f1"
                alt="Price My Solar Logo"
                width={200}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-secondary-foreground/80">
              Compare solar quotes from qualified NZ installers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm md:col-span-2 md:grid-cols-3">
            <div>
              <h3 className="mb-4 font-bold">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="transition-colors hover:text-primary">Terms & Conditions</Link></li>
                <li><Link href="#" className="transition-colors hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#faq" className="transition-colors hover:text-primary">FAQ</Link></li>
                <li><Link href="#articles" className="transition-colors hover:text-primary">Articles</Link></li>
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
        <div className="mt-8 border-t border-secondary-foreground/20 pt-8 text-center text-sm text-secondary-foreground/60">
          <p>&copy; 2025 Price My Solar. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
