
'use client';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import type { Request, Offer } from '@prisma/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiFilter, FiX, FiTag, FiImage, FiClock, FiMapPin, FiDollarSign, FiStar, FiInfo, FiCheckCircle, FiAlertCircle, FiShare2, FiGrid, FiList, FiUpload } from 'react-icons/fi';

export default function Client(){
  const router = useRouter();
  const [items, setItems] = useState<Request[]>([]);
  const [q, setQ] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [newTagText, setNewTagText] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [form, setForm] = useState({ 
    title:'', 
    category:'Eletrônicos', 
    description:'', 
    maxPrice:2000, 
    radiusKm:10, 
    city:'São Paulo', 
    buyerId:'',
    urgency: 'NORMAL', // URGENT, NORMAL, FLEXIBLE
    images: [] as string[],
    tags: [] as string[]
  });
  
  // Categorias populares pré-definidas com ícones e cores
  const popularCategories = [
    { name: 'Eletrônicos', icon: '📱', color: '#3b82f6' },
    { name: 'Informática', icon: '💻', color: '#6366f1' },
    { name: 'Celulares', icon: '📱', color: '#8b5cf6' },
    { name: 'Eletrodomésticos', icon: '🔌', color: '#ec4899' },
    { name: 'Móveis', icon: '🪑', color: '#f59e0b' },
    { name: 'Moda', icon: '👕', color: '#10b981' },
    { name: 'Esportes', icon: '⚽', color: '#ef4444' },
    { name: 'Brinquedos', icon: '🧸', color: '#f97316' },
    { name: 'Livros', icon: '📚', color: '#6366f1' },
    { name: 'Outros', icon: '📦', color: '#64748b' }
  ];
  
  // Opções de urgência
  const urgencyOptions = [
    { value: 'URGENT', label: 'Urgente', icon: <FiAlertCircle /> },
    { value: 'NORMAL', label: 'Normal', icon: <FiClock /> },
    { value: 'FLEXIBLE', label: 'Flexível', icon: <FiCheckCircle /> }
  ];
  
  // Referência para o input de imagem
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load(){
    try {
      setLoading(true);
      const r = await fetch('/api/requests', { cache:'no-store' }).then(r=>r.json());
      setItems(r);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      alert('Não foi possível carregar os pedidos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(()=>{
    load();
    
    // Simular carregamento de dados de usuário (em uma aplicação real, isso viria do backend)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  },[]);
  
  // Função para adicionar tags ao formulário
  const addTag = (tag: string) => {
    if (tag.trim() === '') return;
    
    if (!form.tags.includes(tag)) {
      setForm({...form, tags: [...form.tags, tag]});
      setNewTagText(''); // Limpar o input após adicionar
    } else {
      // Feedback visual se a tag já existir
      const tagInput = document.getElementById('tag-input');
      if (tagInput) {
        tagInput.classList.add('shake');
        setTimeout(() => tagInput.classList.remove('shake'), 500);
      }
    }
  };
  
  // Função para lidar com a adição de tag pelo input
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(newTagText);
    }
  };
  
  // Função para remover tags do formulário
  const removeTag = (tag: string) => {
    setForm({...form, tags: form.tags.filter(t => t !== tag)});
  };
  
  // Função para simular upload de imagens
  const handleImageUpload = () => {
    // Em uma aplicação real, aqui teríamos um upload de verdade
    const mockImageUrl = `https://source.unsplash.com/random/300x200?${form.category.toLowerCase()}&${Date.now()}`;
    
    // Limitar o número de imagens (máximo 5)
    if (form.images.length >= 5) {
      alert('Você pode adicionar no máximo 5 imagens por pedido.');
      return;
    }
    
    // Adicionar imagem com efeito de carregamento
    const tempId = Date.now().toString();
    setForm({...form, images: [...form.images, mockImageUrl]});
    
    // Simular carregamento da imagem
    setTimeout(() => {
      // Em uma aplicação real, aqui atualizaríamos a URL da imagem após o upload
    }, 1000);
  };
  
  // Função para abrir o seletor de arquivos
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Função para remover imagem
  const removeImage = (index: number) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({...form, images: newImages});
  };
  
  // Função para alternar a visualização expandida de um pedido
  const toggleExpandRequest = (id: string) => {
    setExpandedRequestId(expandedRequestId === id ? null : id);
  };

  async function create(){
    if(!form.title || !form.description) return;
    
    // Validações adicionais
    if (form.maxPrice <= 0) {
      alert('O preço máximo deve ser maior que zero');
      return;
    }
    
    // Mostrar indicador de carregamento
    setLoading(true);
    
    try {
      // Simular um pequeno atraso para mostrar o carregamento
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = await fetch('/api/requests', { 
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify(form) 
      });
      
      if (response.ok) {
        // Limpar o formulário mantendo alguns campos
        setForm({ 
          ...form, 
          title:'', 
          description:'', 
          images: [],
          tags: [],
          maxPrice: 2000,
          urgency: 'NORMAL'
        });
        await load();
        
        // Feedback visual mais elegante (em uma aplicação real, usaríamos um toast)
        const successMessage = document.createElement('div');
        successMessage.className = 'toast success';
        successMessage.textContent = 'Pedido criado com sucesso!';
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          successMessage.classList.add('show');
          setTimeout(() => {
            successMessage.classList.remove('show');
            setTimeout(() => document.body.removeChild(successMessage), 300);
          }, 3000);
        }, 100);
      } else {
        alert('Erro ao criar pedido. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert('Erro ao criar pedido. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }
  
  async function del(id:string){ 
    if (confirm('Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.')) {
      try {
        setLoading(true);
        await fetch('/api/requests?id='+id, { method:'DELETE' }); 
        await load();
        
        // Feedback visual
        const successMessage = document.createElement('div');
        successMessage.className = 'toast success';
        successMessage.textContent = 'Pedido excluído com sucesso!';
        document.body.appendChild(successMessage);
        
        setTimeout(() => {
          successMessage.classList.add('show');
          setTimeout(() => {
            successMessage.classList.remove('show');
            setTimeout(() => document.body.removeChild(successMessage), 300);
          }, 3000);
        }, 100);
      } catch (error) {
        console.error('Erro ao excluir pedido:', error);
        alert('Erro ao excluir pedido. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  }

  // Filtragem avançada com múltiplos critérios
  const filtered = useMemo(() => {
    return items.filter(r => {
      // Filtro de texto (busca em título, descrição, categoria e tags)
      const textMatch = !q || 
        (r.title + " " + r.description + " " + r.category + " " + 
         (r.tags ? r.tags.join(" ") : "")).toLowerCase().includes(q.toLowerCase());
      
      // Filtro de categoria
      const categoryMatch = !selectedCategory || r.category === selectedCategory;
      
      // Filtro de preço
      const priceMatch = r.maxPrice >= priceRange[0] && r.maxPrice <= priceRange[1];
      
      return textMatch && categoryMatch && priceMatch;
    });
  }, [items, q, selectedCategory, priceRange]);
  
  // Ordenar pedidos por data de criação (mais recentes primeiro)
  const sortedRequests = useMemo(() => {
    return [...filtered].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filtered]);

  return (
    <div className="container row">
      {/* Formulário de novo pedido */}
      <div className="card">
        <div className="hd hstack">
          <h2>Novo pedido</h2>
          <span className="sm">Taxa só no sucesso (simulado)</span>
        </div>
        <div className="bd row">
          <div className="grid2">
            <div>
              <label className="input-label">Título</label>
              <input 
                className="input" 
                placeholder="Título (ex.: iPhone 13 128GB)" 
                value={form.title} 
                onChange={e=>setForm({...form,title:e.target.value})}
              />
            </div>
            <div>
              <label className="input-label">Categoria</label>
              <select 
                className="input" 
                value={form.category} 
                onChange={e=>setForm({...form,category:e.target.value})}
              >
                {popularCategories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="input-label">Descrição</label>
            <textarea 
              className="input" 
              rows={4} 
              placeholder="Descrição detalhada do que você está procurando" 
              value={form.description} 
              onChange={e=>setForm({...form,description:e.target.value})}
            />
          </div>
          
          {/* Seleção de urgência */}
          <div className="grid3">
            {urgencyOptions.map(option => (
              <button 
                key={option.value}
                type="button"
                className={`btn ${form.urgency === option.value ? '' : 'alt'}`}
                onClick={() => setForm({...form, urgency: option.value})}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                  {option.icon} {option.label}
                </span>
              </button>
            ))}
          </div>
          
          {/* Tags */}
          <div>
            <div className="hstack" style={{ marginBottom: '8px' }}>
              <label className="input-label">Tags (opcional)</label>
              <span className="sm">Ajudam na busca</span>
            </div>
            <div className="hstack">
              <input 
                id="tag-input"
                className="input" 
                placeholder="Adicione tags (ex: novo, garantia)" 
                value={newTagText}
                onChange={e => setNewTagText(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
              />
              <button 
                className="btn" 
                style={{ marginLeft: '8px' }}
                onClick={() => addTag(newTagText)}
              >
                <FiTag /> Adicionar
              </button>
            </div>
            
            {form.tags.length > 0 && (
              <div className="tagContainer">
                {form.tags.map(tag => (
                  <div key={tag} className="tag">
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Upload de imagens */}
          <div>
            <div className="hstack" style={{ marginBottom: '8px' }}>
              <label className="input-label">Imagens (opcional)</label>
              <span className="sm">Máximo 5 imagens</span>
            </div>
            <button 
              className="btn alt pulse" 
              onClick={triggerFileInput}
              style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                gap: '6px', 
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = ''}
            >
              <FiUpload size={18} /> 
              <span style={{ fontSize: '12px' }}>Fazer upload</span>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleImageUpload}
            />
            
            {form.images.length > 0 && (
              <div className="imagePreview">
                {form.images.map((img, index) => (
                  <div key={index} className="imageItem">
                    {/* Em uma aplicação real, usaríamos o componente Image do Next.js */}
                    <img src={img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removeImage(index)} className="pulse">
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid2">
            <div>
              <label className="input-label">Preço máximo (R$)</label>
              <input 
                className="input" 
                type="number" 
                placeholder="Preço máximo" 
                value={form.maxPrice} 
                onChange={e=>setForm({...form,maxPrice:parseInt(e.target.value||'0',10)})}
              />
            </div>
            <div>
              <label className="input-label">Localização</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  className="input" 
                  placeholder="Cidade" 
                  value={form.city} 
                  onChange={e=>setForm({...form,city:e.target.value})}
                  style={{ flex: 2 }}
                />
                <input 
                  className="input" 
                  type="number" 
                  placeholder="Raio (km)" 
                  value={form.radiusKm} 
                  onChange={e=>setForm({...form,radiusKm:parseInt(e.target.value||'0',10)})}
                  style={{ flex: 1 }}
                />
              </div>
            </div>
          </div>
          
          <button 
            className="btn" 
            onClick={create}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? (
              <>
                <div className={styles.loadingSpinnerSm}></div>
                Publicando...
              </>
            ) : (
              <>
                <FiCheckCircle size={18} />
                Publicar pedido
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Lista de pedidos */}
      <div className="card mt3">
        <div className="hd hstack">
          <h2>Pedidos abertos</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div>
              <label className="input-label" style={{ marginBottom: '4px' }}>Buscar</label>
              <input 
                className="input" 
                placeholder="Buscar…" 
                value={q} 
                onChange={e=>setQ(e.target.value)}
              />
            </div>
            <button 
              className="btn alt" 
              onClick={() => setShowFilters(!showFilters)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <FiFilter /> Filtros
            </button>
          </div>
        </div>
        
        {/* Painel de filtros */}
        {showFilters && (
          <div className="bd filterPanel">
            <h3>Filtros avançados</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label className="input-label">Categorias</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <div 
                  className={`categoryPill ${selectedCategory === '' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('')}
                >
                  Todas
                </div>
                {popularCategories.map(cat => (
                  <div 
                    key={cat.name}
                    className={`categoryPill ${selectedCategory === cat.name ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.name)}
                    style={{ borderColor: cat.color }}
                  >
                    {cat.icon} {cat.name}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="input-label">Faixa de preço: R$ {priceRange[0]} - R$ {priceRange[1]}</label>
              <input 
                type="range" 
                min="0" 
                max="10000" 
                step="100"
                className="priceRange"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              />
              <div className="rangeLabels">
                <span>R$ 0</span>
                <span>R$ 10.000+</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Categorias em destaque */}
        <div className="bd" style={{ borderBottom: '1px solid rgba(255,255,255,.5)' }}>
          <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '8px' }}>
            {popularCategories.map(cat => (
              <div 
                key={cat.name}
                className={`categoryPill ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)}
                style={{ borderColor: cat.color }}
              >
                {cat.icon} {cat.name}
              </div>
            ))}
          </div>
        </div>
        
        {/* Resultados */}
        <div className="bd">
          <div className="hstack" style={{ marginBottom: '16px' }}>
            <div>
              {loading ? (
                <span>Carregando pedidos...</span>
              ) : (
                <span>{sortedRequests.length} pedido(s) encontrado(s)</span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className={`btn ${viewMode === 'grid' ? '' : 'alt'}`} 
                onClick={() => setViewMode('grid')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <FiGrid size={16} /> Grid
              </button>
              <button 
                className={`btn ${viewMode === 'list' ? '' : 'alt'}`} 
                onClick={() => setViewMode('list')}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <FiList size={16} /> Lista
              </button>
            </div>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div className="loading-spinner"></div>
              <p>Carregando pedidos...</p>
            </div>
          ) : sortedRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <p>Nenhum pedido encontrado com os filtros atuais.</p>
              <button className="btn" onClick={() => {
                setQ('');
                setSelectedCategory('');
                setPriceRange([0, 10000]);
              }}>
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid2' : 'row'}>
              {sortedRequests.map(r => (
                <RequestItem 
                  key={r.id} 
                  r={r} 
                  onChange={load} 
                  onDelete={() => del(r.id)}
                  isExpanded={expandedRequestId === r.id}
                  onToggleExpand={() => toggleExpandRequest(r.id)}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import RatingModal from '../components/RatingModal';
import styles from './requests.module.css';

type RequestItemProps = {
  r: Request;
  onChange: () => void;
  onDelete: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  viewMode?: 'grid' | 'list';
};

function RequestItem({ r, onChange, onDelete, isExpanded: initialExpanded = false, onToggleExpand }: RequestItemProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [showAllDescription, setShowAllDescription] = useState(false);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [acceptedOffer, setAcceptedOffer] = useState<Offer | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  // Formatar a data de criação
  const formattedDate = useMemo(() => {
    const date = new Date(r.createdAt);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }, [r.createdAt]);
  
  // Determinar a cor e ícone do status
  const statusInfo = useMemo(() => {
    switch (r.status) {
      case 'ACCEPTED':
        return { className: 'accepted', label: 'Oferta aceita', icon: <FiCheckCircle /> };
      case 'PENDING':
      default:
        return { className: 'pending', label: 'Aguardando ofertas', icon: <FiClock /> };
    }
  }, [r.status]);
  
  // Determinar a cor e ícone da urgência
  const urgencyInfo = useMemo(() => {
    switch (r.urgency) {
      case 'URGENT':
        return { className: 'urgent', label: 'Urgente', icon: <FiAlertCircle /> };
      case 'FLEXIBLE':
        return { className: 'flexible', label: 'Flexível', icon: <FiCheckCircle /> };
      case 'NORMAL':
      default:
        return { className: 'normal', label: 'Normal', icon: <FiClock /> };
    }
  }, [r.urgency]);
  
  // Truncar descrição se for muito longa
  const truncatedDescription = useMemo(() => {
    if (!r.description) return '';
    return r.description.length > 150 && !showAllDescription
      ? r.description.substring(0, 150) + '...'
      : r.description;
  }, [r.description, showAllDescription]);
  
  // Sincronizar o estado local com a prop isExpanded
  useEffect(() => {
    setIsExpanded(initialExpanded);
  }, [initialExpanded]);
  
  useEffect(() => { 
    if (isExpanded) {
      setLoadingOffers(true);
      fetch('/api/offers?requestId='+r.id)
        .then(r=>r.json())
        .then(offers => {
          setOffers(offers);
          if (r.acceptedOfferId) {
            const accepted = offers.find(o => o.id === r.acceptedOfferId);
            if (accepted) setAcceptedOffer(accepted);
          }
          setLoadingOffers(false);
        })
        .catch(err => {
          console.error('Erro ao carregar ofertas:', err);
          setLoadingOffers(false);
        });
    }
  }, [r.id, r.acceptedOfferId, isExpanded]);
  
  async function accept(offerId:string){ 
    try {
      await fetch(`/api/requests/${r.id}/accept`, { 
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify({ offerId })
      }); 
      await onChange(); 
      
      // Feedback visual
      const successMessage = document.createElement('div');
      successMessage.className = 'toast success';
      successMessage.textContent = 'Oferta aceita com sucesso!';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        successMessage.classList.add('show');
        setTimeout(() => {
          successMessage.classList.remove('show');
          setTimeout(() => document.body.removeChild(successMessage), 300);
        }, 3000);
      }, 100);
    } catch (error) {
      console.error('Erro ao aceitar oferta:', error);
      alert('Erro ao aceitar oferta. Tente novamente.');
    }
  }
  
  const handleRatingSubmit = async (rating: number, comment: string) => {
    if (!acceptedOffer) return;
    
    // Em uma aplicação real, enviaríamos a avaliação para o backend
    // Aqui estamos apenas simulando
    console.log(`Avaliação enviada: ${rating} estrelas, comentário: ${comment}`);
    
    // Fechar o modal após enviar
    setShowRatingModal(false);
    
    // Feedback visual
    const successMessage = document.createElement('div');
    successMessage.className = 'toast success';
    successMessage.textContent = 'Avaliação enviada com sucesso!';
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      successMessage.classList.add('show');
      setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => document.body.removeChild(successMessage), 300);
      }, 3000);
    }, 100);
  };
  
  return (
    <div className={`card ${styles.requestCard}`}>
      <div className={styles.requestHeader}>
        <div className="hstack">
          <h3 className={styles.requestTitle}>{r.title}</h3>
          <span className="sm">{formattedDate}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
          <span className="badge">{r.category}</span>
          <span className={`${styles.statusBadge} ${styles[statusInfo.className]}`}>
            {statusInfo.icon} {statusInfo.label}
          </span>
          {r.urgency && (
            <span className={`${styles.urgencyBadge} ${styles[urgencyInfo.className]}`}>
              {urgencyInfo.icon} {urgencyInfo.label}
            </span>
          )}
        </div>
      </div>
      
      <div className={styles.requestBody}>
        <div className={styles.requestHighlight}>
          <div className="hstack">
            <div className={styles.requestDetail}>
              <div className={styles.requestDetailIcon}>
                <FiMapPin size={14} />
              </div>
              <span>{r.city} • Raio de {r.radiusKm}km</span>
            </div>
            <div className={styles.requestDetail}>
              <div className={styles.requestDetailIcon}>
                <FiDollarSign size={14} />
              </div>
              <span style={{ fontWeight: 'bold' }}>Até R$ {r.maxPrice.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>
        
        <p className={styles.requestDescription}>{truncatedDescription}</p>
        
        {r.description && r.description.length > 150 && (
          <button 
            className={styles.expandButton} 
            onClick={() => setShowAllDescription(!showAllDescription)}
          >
            {showAllDescription ? 'Mostrar menos' : 'Mostrar mais'}
          </button>
        )}
        
        {/* Tags do pedido */}
        {r.tags && r.tags.length > 0 && (
          <div className={styles.tagContainer}>
            {r.tags.map((tag, index) => (
              <div key={index} className={styles.tag}>
                <FiTag size={12} /> {tag}
              </div>
            ))}
          </div>
        )}
        
        {/* Imagens do pedido */}
        {r.images && r.images.length > 0 && (
          <div className={styles.imagePreview}>
            {r.images.map((img, index) => (
              <div key={index} className={styles.imageItem}>
                <img src={img} alt={`Imagem ${index+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}
        
        {r.status === 'ACCEPTED' && (
          <div className="hstack">
            <div className={`${styles.statusBadge} ${styles.accepted}`}>
              <FiCheckCircle /> Oferta aceita
            </div>
            <button 
              className="btn" 
              onClick={() => setShowRatingModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <FiStar /> Avaliar Vendedor
            </button>
          </div>
        )}
      </div>
      
      <div className={styles.requestFooter}>
        <div>
          <button 
            className={styles.expandButton} 
            onClick={() => {
              // Atualizar o estado local e chamar a função de callback
              setIsExpanded(!isExpanded);
              if (onToggleExpand) onToggleExpand();
            }}
          >
            {isExpanded ? 'Ocultar ofertas' : `Ver ${offers.length || ''} ofertas`}
          </button>
          
          <button 
            className={styles.expandButton}
            onClick={() => {
              // Simular compartilhamento
              const shareData = {
                title: `Pedido: ${r.title}`,
                text: `Confira este pedido: ${r.title} - ${r.description?.substring(0, 50)}...`,
                url: `https://exemplo.com/pedidos/${r.id}`
              };
              
              if (navigator.share && navigator.canShare(shareData)) {
                navigator.share(shareData)
                  .then(() => {
                    // Feedback visual
                    const successMessage = document.createElement('div');
                    successMessage.className = `${styles.toast} ${styles.toastSuccess}`;
                    successMessage.textContent = 'Pedido compartilhado!';
                    document.body.appendChild(successMessage);
                    
                    setTimeout(() => {
                      successMessage.classList.add(styles.toastShow);
                      setTimeout(() => {
                        successMessage.classList.remove(styles.toastShow);
                        setTimeout(() => document.body.removeChild(successMessage), 300);
                      }, 3000);
                    }, 100);
                  })
                  .catch(err => console.error('Erro ao compartilhar:', err));
              } else {
                // Fallback para navegadores que não suportam a API Web Share
                alert(`Link copiado: https://exemplo.com/pedidos/${r.id}`);
              }
            }}
            style={{ marginLeft: '8px' }}
          >
            <FiShare2 /> Compartilhar
          </button>
        </div>
        
        <button 
          className="btn alt" 
          onClick={onDelete}
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <FiX /> Excluir
        </button>
      </div>
      
      {isExpanded && (
        <div className="bd">
          <div className="hstack">
            <h4>Ofertas recebidas</h4>
            <div>
              <span className="sm">{offers.length} oferta(s)</span>
              <button 
                className={styles.expandButton}
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                style={{ marginLeft: '8px' }}
              >
                {viewMode === 'list' ? <FiGrid size={14} /> : <FiList size={14} />}
                {viewMode === 'list' ? ' Ver em grid' : ' Ver em lista'}
              </button>
            </div>
          </div>
          
          {loadingOffers ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div className="loading-spinner"></div>
              <p>Carregando ofertas...</p>
            </div>
          ) : offers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p>Nenhuma oferta recebida ainda.</p>
            </div>
          ) : (
            <div className={viewMode === 'list' ? `row ${styles.offersList}` : styles.offersGrid}>
              {offers.map(o=> (
                <div className={viewMode === 'list' ? "card" : styles.offerCard} key={o.id}>
                  <div className={viewMode === 'list' ? "bd row" : ""}>
                    <div className={styles.offerPrice}>
                      <FiDollarSign size={18} />
                      <span>R$ {o.price.toLocaleString('pt-BR')}</span>
                    </div>
                    
                    <div className="sm" style={{ marginBottom: '8px' }}>
                      <span className="input-label" style={{ marginRight: '4px' }}>Condição:</span> {o.condition} • 
                      <span className="input-label" style={{ marginRight: '4px', marginLeft: '4px' }}>Entrega em:</span> {o.etaDays} dia(s)
                    </div>
                    
                    <div className={styles.offerUser}>
                      <div className={styles.offerUserAvatar}>V</div>
                      <div className={styles.offerUserInfo}>
                        <div>
                          <span className="input-label" style={{ marginRight: '4px' }}>Vendedor:</span>
                          <span className={styles.offerUserName}>Vendedor</span>
                        </div>
                        <div>
                          <span className="input-label" style={{ marginRight: '4px' }}>Avaliação:</span>
                          <span className={styles.offerUserRating}>
                            <FiStar size={14} /> 4.8 (25)
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <span className="input-label" style={{ display: 'block', marginBottom: '4px' }}>Mensagem:</span>
                      <p className={styles.offerDescription}>{o.message}</p>
                    </div>
                    
                    {r.status !== 'ACCEPTED' && (
                      <div className={styles.offerActions}>
                        <button 
                          className="btn" 
                          onClick={()=>accept(o.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center', width: '100%' }}
                        >
                          <FiCheckCircle /> Aceitar oferta
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {acceptedOffer && (
        <RatingModal 
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
          targetName="Loja Centro SP" // Em uma aplicação real, usaríamos o nome do vendedor
          targetRole="SELLER"
        />
      )}
    </div>
  );
}
