'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link href="/" className="logo">Mercado Inverso</Link>
          <nav className="nav">
            <Link href="/requests" className={`nav-link ${pathname === '/requests' ? 'active' : ''}`}>Pedidos</Link>
            <Link href="/seller" className={`nav-link ${pathname === '/seller' ? 'active' : ''}`}>Vendedor</Link>
            <Link href="/profile" className={`nav-link ${pathname === '/profile' ? 'active' : ''}`}>Perfil</Link>
            <Link href="/notifications" className={`nav-link ${pathname === '/notifications' ? 'active' : ''}`}>
              Notificações
              <span className="notification-badge">2</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}