
import type { Metadata, ResolvingMetadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { getGtmSnippet, getSetting } from '@/app/actions';
import Script from 'next/script';

const defaultMetadata = {
  title: 'Compare Solar Quotes – Price My Solar NZ',
  description: 'Quotes from NZ qualified installers for your home or business. 100% Free, No Obligation, SEANZ Approved.',
};

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { value: faviconUrl } = await getSetting('faviconUrl');
 
  return {
    ...defaultMetadata,
    icons: {
      icon: faviconUrl || '/favicon.ico', // fallback to a default if not set
    },
  }
}


// Augment the Window interface for GTM dataLayer
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { snippet: gtmHeadSnippet } = await getGtmSnippet();

  return (
    <html lang="en" className="!scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Script id="gtm-datalayer" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
          `}
        </Script>
        {gtmHeadSnippet && (
          <Script id="gtm-script" strategy="afterInteractive">
            {gtmHeadSnippet.replace(/<script>|<\/script>/g, '')}
          </Script>
        )}
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
