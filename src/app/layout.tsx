import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Te Declarei - Compartilhe seu Sentimento',
  description: 'Crie momentos inesquecíveis e expresse seus sentimentos mais profundos com nossa encantadora coleção de cartões digitais e propostas especiais.',
  keywords: ['cartões de amor', 'pedido de namoro', 'cartões românticos', 'declaração de amor'],
  authors: [{ name: 'Te Declarei Team' }],
  openGraph: {
    title: 'Te Declarei - Compartilhe seu Sentimento',
    description: 'Crie momentos inesquecíveis e expresse seus sentimentos',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
