import './globals.css';
import React from 'react';
import Header from './components/Header';

export const metadata = { title: 'Mercado Inverso • MVP', description: 'Compradores pedem, vendedores ofertam' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
