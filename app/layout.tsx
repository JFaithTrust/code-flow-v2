// eslint-disable-next-line import/order
import { Inter, Space_Grotesk } from 'next/font/google';

import './globals.css';
import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '700', '800', '900'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '700'],
});

export const metadata = {
  title: 'Codeflow',
  description:
    'Codeflow is a community-driven platform to ask and answer real-world programming questions. Learn, grow, and connect with developers around the world.',

  generator: 'Next.js',
  applicationName: 'Codeflow',
  referrer: 'origin-when-cross-origin',

  keywords: [
    'Codeflow',
    'programming questions',
    'developer Q&A',
    'web development',
    'JavaScript',
    'React',
    'Node.js',
    'algorithms',
    'data structures',
    'developer community',
  ],

  authors: [{ name: 'Jahongir' }, { name: 'Codeflow Team', url: 'https://codeflow.dev/team' }],
  creator: 'Jahongir Solijoniy',
  publisher: 'Codeflow',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/images/site-logo.svg', // regular favicon
    shortcut: '/favicon.ico', // browser address bar icon
    apple: '/apple-touch-icon.png', // Apple devices
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },

  // Optional: Color for Microsoft tiles and pinned sites
  msapplication: {
    TileColor: '#ffffff',
    TileImage: '/mstile-150x150.png',
  },
};

export const viewport = {
  themeColor: '#18181b',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <SessionProvider>
        <body className={`${inter.className} ${spaceGrotesk.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-right" richColors />
            {children}
          </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  );
}
