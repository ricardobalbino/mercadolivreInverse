
'use client';
import React, { useEffect, useState } from 'react';
import type { Request, Offer } from '@prisma/client';
import RatingModal from '../components/RatingModal';
import OfferModal from '../components/OfferModal';

type RequestWithOffers = Request & { myOffers?: Offer[] };

export default function ClientSeller(){
  const [items, setItems] = useState<RequestWithOffers[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestWithOffers | null>(null);

  async function load(){ 
    // Carregar pedidos
    const requests = await fetch('/api/requests',{cache:'no-store'}).then(r=>r.json()); 
    
    // Carregar ofertas do vendedor (simulado no MVP)
    const sellerOffers = await fetch('/api/offers?sellerId=seller1').then(r=>r.json());
    setMyOffers(sellerOffers);
    
    // Associar ofertas aos pedidos
    const requestsWithOffers = requests.map((req: Request) => {
      const reqOffers = sellerOffers.filter((o: Offer) => o.requestId === req.id);
      return { ...req, myOffers: reqOffers };
    });
    
    setItems(requestsWithOffers); 
  }
  
  useEffect(()=>{load();},[]);

  async function send(formData: any){
    try {
      await fetch('/api/offers', { 
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify(formData) 
      });
      
      // Feedback visual mais elegante
      const successMessage = document.createElement('div');
      successMessage.className = 'toast success';
      successMessage.textContent = 'Proposta enviada com sucesso!';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        successMessage.classList.add('show');
        setTimeout(() => {
          successMessage.classList.remove('show');
          setTimeout(() => document.body.removeChild(successMessage), 300);
        }, 3000);
      }, 100);
      
      setShowOfferModal(false);
      await load(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      alert('Erro ao enviar proposta. Tente novamente.');
    }
  }
  
  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!selectedRequest) return;
    
    // Em uma aplicação real, enviaríamos a avaliação para o backend
    console.log(`Avaliação enviada: ${rating} estrelas, comentário: ${comment}`);
    
    setShowRatingModal(false);
    alert('Avaliação enviada com sucesso!');
  };
  
  const openRatingModal = (request: RequestWithOffers) => {
    setSelectedRequest(request);
    setShowRatingModal(true);
  };

  return (
    <div className="container row">
      <div className="card">
        <div className="hd"><h2>Pedidos Disponíveis</h2></div>
        <div className="bd row">
          {items.filter(i => i.status === 'OPEN').map(request => (
            <div className="card" key={request.id}>
              <div className="bd row">
                <h3>{request.title}</h3>
                <div className="info-row">
                  <span>Cidade: {request.city}</span>
                  <span>Preço máximo: R$ {request.maxPrice}</span>
                </div>
                <p className="sm">{request.description}</p>
                <button 
                  className="btn" 
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowOfferModal(true);
                  }}
                >
                  Enviar proposta
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="card mt3">
        <div className="hd">
          <h2>Minhas Ofertas</h2>
        </div>
        <div className="bd row">
          {myOffers.length === 0 ? (
            <p className="sm">Você ainda não enviou nenhuma oferta.</p>
          ) : (
            myOffers.map(offer => {
              const request = items.find(r => r.id === offer.requestId);
              return (
                <div className="card" key={offer.id}>
                  <div className="bd row">
                    <div className="hstack">
                      <h3>{request?.title || 'Pedido'}</h3>
                      {request?.status === 'ACCEPTED' && request.acceptedOfferId === offer.id && (
                        <div className="badge success">Oferta aceita ✔</div>
                      )}
                    </div>
                    <div className="info-row">
                      <span className="info-label">Sua oferta:</span>
                      <span><b>R$ {offer.price}</b> • {offer.condition} • {offer.etaDays} dia(s)</span>
                    </div>
                    <p className="sm">{offer.message}</p>
                    
                    {request?.status === 'ACCEPTED' && request.acceptedOfferId === offer.id && (
                      <button className="btn" onClick={() => openRatingModal(request)}>Avaliar Comprador</button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {selectedRequest && (
        <RatingModal 
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
          targetName="Ricardo (comprador)" // Em uma aplicação real, usaríamos o nome do comprador
          targetRole="BUYER"
        />
      )}

      <OfferModal
        isOpen={showOfferModal}
        requests={items.filter(i => i.status === 'OPEN')}
        selectedRequest={selectedRequest}
        onClose={() => {
          setShowOfferModal(false);
          setSelectedRequest(null);
        }}
        onSubmit={send}
      />
    </div>
  );
}
