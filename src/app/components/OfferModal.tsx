'use client';
import React, { useState, useEffect } from 'react';
import type { Request } from '@prisma/client';

type OfferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: OfferFormData) => void;
  availableRequests: Request[];
};

type OfferFormData = {
  requestId: string;
  price: number;
  condition: string;
  message: string;
  etaDays: number;
};

export default function OfferModal({ isOpen, onClose, onSubmit, availableRequests }: OfferModalProps) {
  const [form, setForm] = useState<OfferFormData>({
    requestId: '',
    price: 0,
    condition: 'seminovo',
    message: 'Produto testado, NF e garantia 90 dias',
    etaDays: 2
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({
        requestId: '',
        price: 0,
        condition: 'seminovo',
        message: 'Produto testado, NF e garantia 90 dias',
        etaDays: 2
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.requestId || form.price <= 0) {
      alert('Por favor, selecione um pedido e informe um preço válido.');
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Enviar Proposta</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="input-label">Pedido</label>
              <select 
                className="input" 
                value={form.requestId} 
                onChange={e => setForm({...form, requestId: e.target.value})}
                required
              >
                <option value="">Selecione um pedido…</option>
                {availableRequests.filter(i => i.status === 'OPEN').map(i => (
                  <option key={i.id} value={i.id}>
                    {i.title} — {i.city} — Até R$ {i.maxPrice}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group-grid">
              <div className="form-group">
                <label className="input-label">Preço</label>
                <input 
                  className="input" 
                  type="number" 
                  placeholder="Preço" 
                  value={form.price} 
                  onChange={e => setForm({...form, price: parseInt(e.target.value || '0', 10)})}
                  required
                  min="1"
                />
              </div>
              <div className="form-group">
                <label className="input-label">Condição</label>
                <input 
                  className="input" 
                  placeholder="Condição" 
                  value={form.condition} 
                  onChange={e => setForm({...form, condition: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="form-group-grid">
              <div className="form-group">
                <label className="input-label">Entrega (dias)</label>
                <input 
                  className="input" 
                  type="number" 
                  placeholder="Entrega (dias)" 
                  value={form.etaDays} 
                  onChange={e => setForm({...form, etaDays: parseInt(e.target.value || '0', 10)})}
                  required
                  min="1"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="input-label">Mensagem</label>
              <textarea 
                className="input" 
                placeholder="Mensagem" 
                value={form.message} 
                onChange={e => setForm({...form, message: e.target.value})}
                required
                rows={4}
              ></textarea>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn alt" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn">Enviar Proposta</button>
          </div>
        </form>
      </div>
    </div>
  );
}