'use client';
import React, { useState } from 'react';

type RatingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  targetName: string;
  targetRole: 'BUYER' | 'SELLER';
};

export default function RatingModal({ isOpen, onClose, onSubmit, targetName, targetRole }: RatingModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
    setRating(5);
    setComment('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Avaliar {targetRole === 'BUYER' ? 'Comprador' : 'Vendedor'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p>Como foi sua experiência com <strong>{targetName}</strong>?</p>
            
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(star => (
                <span 
                  key={star} 
                  className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  ★
                </span>
              ))}
            </div>
            
            <textarea 
              className="input" 
              rows={4} 
              placeholder="Deixe um comentário sobre sua experiência (opcional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn alt" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn">Enviar Avaliação</button>
          </div>
        </form>
      </div>
    </div>
  );
}