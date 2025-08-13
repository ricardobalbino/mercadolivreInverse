'use client';
import React, { useEffect, useState } from 'react';

type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: 'offer' | 'acceptance' | 'rating' | 'system';
};

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  useEffect(() => {
    // Simulando carregamento de notificações
    // Em uma aplicação real, isso viria de uma API
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Nova oferta recebida',
        message: 'Você recebeu uma nova oferta para seu pedido "Notebook Gamer RTX 4060".',
        isRead: false,
        createdAt: new Date().toISOString(),
        type: 'offer'
      },
      {
        id: '2',
        title: 'Oferta aceita',
        message: 'O comprador aceitou sua oferta para o pedido "iPhone 13 Pro Max".',
        isRead: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        type: 'acceptance'
      },
      {
        id: '3',
        title: 'Avalie o vendedor',
        message: 'Por favor, avalie o vendedor "Loja Centro SP" pela sua compra recente.',
        isRead: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
        type: 'rating'
      },
      {
        id: '4',
        title: 'Bem-vindo ao Mercado Inverso',
        message: 'Obrigado por se juntar à nossa plataforma! Comece criando seu primeiro pedido.',
        isRead: true,
        createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 dias atrás
        type: 'system'
      }
    ];
    
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'offer': return '💰';
      case 'acceptance': return '✅';
      case 'rating': return '⭐';
      case 'system': return 'ℹ️';
      default: return '📩';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container row">
      <div className="card">
        <div className="hd hstack">
          <h2>Notificações</h2>
          <div className="hstack" style={{ gap: '12px' }}>
            {unreadCount > 0 && (
              <span className="badge">{unreadCount} não lida(s)</span>
            )}
            <button className="btn" onClick={markAllAsRead}>Marcar todas como lidas</button>
          </div>
        </div>
        <div className="bd row">
          {notifications.length === 0 ? (
            <p className="sm">Você não tem notificações.</p>
          ) : (
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-icon">{getNotificationIcon(notification.type)}</div>
                <div className="notification-content">
                  <div className="notification-header">
                    <h3>{notification.title}</h3>
                    <span className="sm">{formatDate(notification.createdAt)}</span>
                  </div>
                  <p>{notification.message}</p>
                </div>
                {!notification.isRead && <div className="notification-indicator"></div>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}