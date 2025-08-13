'use client';
import React, { useEffect, useState, useRef } from 'react';
import type { User } from '@prisma/client';
import styles from './profile.module.css';
import { FiMapPin, FiCalendar, FiStar, FiEdit2, FiPlus, FiX, FiUser, FiMail, FiPhone, FiUpload, FiActivity, FiShoppingBag, FiDollarSign, FiSettings } from 'react-icons/fi';

export default function ProfileClient() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('atividades');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '',
    city: '',
    role: 'BUYER',
    bio: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando carregamento do usuário atual (no MVP usamos o buyer1 fixo)
    setLoading(true);
    fetch('/api/users/current')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setForm({
          name: data.name,
          city: data.city || 'São Paulo',
          role: data.role,
          bio: data.bio || 'Olá! Estou usando o marketplace para encontrar os melhores produtos.',
          email: data.email || 'usuario@exemplo.com',
          phone: data.phone || '(11) 98765-4321'
        });
        // Dados simulados para demonstração
        setSkills(['Negociação', 'Tecnologia', 'Fotografia']);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar usuário:', error);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedUser = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).then(res => res.json());
      
      setUser(updatedUser);
      setIsEditing(false);
      
      // Mostrar notificação de sucesso
      const notification = document.createElement('div');
      notification.className = 'notification success';
      notification.textContent = 'Perfil atualizado com sucesso!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      
      // Mostrar notificação de erro
      const notification = document.createElement('div');
      notification.className = 'notification error';
      notification.textContent = 'Erro ao atualizar perfil. Tente novamente.';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };
  
  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Aqui você implementaria o upload real da imagem
      console.log('Arquivo selecionado:', file.name);
      
      // Simulando sucesso de upload
      const notification = document.createElement('div');
      notification.className = 'notification success';
      notification.textContent = 'Foto de perfil atualizada!';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  if (!user) {
    return <div className="container">Erro ao carregar perfil. Tente novamente.</div>;
  }

  // Dados simulados para demonstração
  const recentActivity = [
    { id: 1, type: 'request', title: 'Pedido de Câmera DSLR criado', date: '2023-10-15' },
    { id: 2, type: 'offer', title: 'Oferta aceita para Notebook Dell', date: '2023-10-10' },
    { id: 3, type: 'payment', title: 'Pagamento realizado - R$ 1.299,00', date: '2023-10-08' },
    { id: 4, type: 'request', title: 'Pedido de Smartphone atualizado', date: '2023-10-05' },
  ];
  
  const stats = [
    { label: 'Pedidos', value: 12, icon: <FiShoppingBag /> },
    { label: 'Avaliação', value: user.rating.toFixed(1), icon: <FiStar /> },
    { label: 'Transações', value: 8, icon: <FiDollarSign /> },
  ];

  return (
    <div className="container">
      {/* Header do perfil */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarLarge}>
          {user.name.charAt(0)}
          <button className={styles.avatarUpload} onClick={handleAvatarUpload}>
            <FiUpload size={16} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>
            {user.name}
            {!isEditing && (
              <button className={styles.editButton} onClick={() => setIsEditing(true)} style={{ marginLeft: '12px' }}>
                <FiEdit2 size={14} /> Editar perfil
              </button>
            )}
          </h1>
          
          <div className="badge" style={{ marginTop: '4px' }}>
            {user.role === 'BUYER' ? 'Comprador' : 'Vendedor'}
          </div>
          
          <div className={styles.profileMeta}>
            <div className={styles.profileMetaItem}>
              <FiMapPin size={16} />
              {user.city}
            </div>
            <div className={styles.profileMetaItem}>
              <FiStar size={16} />
              {user.rating.toFixed(1)} ({Math.floor(Math.random() * 50) + 10} avaliações)
            </div>
            <div className={styles.profileMetaItem}>
              <FiCalendar size={16} />
              Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
      </div>
      
      {/* Estatísticas */}
      <div className="grid3" style={{ marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <p className={styles.statValue}>
              <span style={{ marginRight: '8px', color: 'var(--primary)', opacity: 0.8 }}>
                {stat.icon}
              </span>
              {stat.value}
            </p>
            <p className={styles.statLabel}>{stat.label}</p>
          </div>
        ))}
      </div>
      
      {isEditing ? (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="hd hstack">
            <h2>Editar Perfil</h2>
            <div>
              <button className="btn btn-outline" onClick={() => setIsEditing(false)} style={{ marginRight: '8px' }}>
                Cancelar
              </button>
              <button className="btn" onClick={handleSave} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
          <div className="bd">
            <div className="grid2">
              <div>
                <label className="input-label">Nome completo</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--muted)' }}>
                    <FiUser size={16} />
                  </span>
                  <input 
                    className="input" 
                    style={{ paddingLeft: '40px' }}
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Cidade</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--muted)' }}>
                    <FiMapPin size={16} />
                  </span>
                  <input 
                    className="input" 
                    style={{ paddingLeft: '40px' }}
                    value={form.city} 
                    onChange={e => setForm({...form, city: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid2" style={{ marginTop: '16px' }}>
              <div>
                <label className="input-label">Email</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--muted)' }}>
                    <FiMail size={16} />
                  </span>
                  <input 
                    className="input" 
                    style={{ paddingLeft: '40px' }}
                    value={form.email} 
                    onChange={e => setForm({...form, email: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Telefone</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--muted)' }}>
                    <FiPhone size={16} />
                  </span>
                  <input 
                    className="input" 
                    style={{ paddingLeft: '40px' }}
                    value={form.phone} 
                    onChange={e => setForm({...form, phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <label className="input-label">Função</label>
              <select 
                className="input" 
                value={form.role}
                onChange={e => setForm({...form, role: e.target.value})}
              >
                <option value="BUYER">Comprador</option>
                <option value="SELLER">Vendedor</option>
              </select>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <label className="input-label">Biografia</label>
              <textarea 
                className={styles.textArea}
                value={form.bio}
                onChange={e => setForm({...form, bio: e.target.value})}
                placeholder="Conte um pouco sobre você..."
              />
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <label className="input-label">Habilidades e interesses</label>
              <div className={styles.skillsContainer}>
                {skills.map((skill, index) => (
                  <div key={index} className={styles.skillTag}>
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)}>
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', marginTop: '12px' }}>
                <input 
                  className="input" 
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  placeholder="Nova habilidade ou interesse"
                  onKeyPress={e => e.key === 'Enter' && handleAddSkill()}
                  style={{ flex: 1, marginRight: '8px' }}
                />
                <button className="btn" onClick={handleAddSkill}>
                  <FiPlus size={16} /> Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Abas */}
          <div className={styles.tabContainer}>
            <div 
              className={`${styles.tab} ${activeTab === 'atividades' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('atividades')}
            >
              <FiActivity size={16} style={{ marginRight: '8px' }} /> Atividades recentes
            </div>
            <div 
              className={`${styles.tab} ${activeTab === 'pedidos' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('pedidos')}
            >
              <FiShoppingBag size={16} style={{ marginRight: '8px' }} /> {user.role === 'BUYER' ? 'Meus Pedidos' : 'Minhas Ofertas'}
            </div>
            <div 
              className={`${styles.tab} ${activeTab === 'configuracoes' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('configuracoes')}
            >
              <FiSettings size={16} style={{ marginRight: '8px' }} /> Configurações
            </div>
          </div>
          
          {/* Conteúdo da aba */}
          {activeTab === 'atividades' && (
            <>
              <div className={styles.bioSection}>
                <div className={styles.bioTitle}>
                  <FiUser size={16} /> Sobre mim
                  <button className={styles.editButton} onClick={() => setIsEditingBio(true)} style={{ marginLeft: 'auto' }}>
                    <FiEdit2 size={14} /> Editar
                  </button>
                </div>
                
                {isEditingBio ? (
                  <div>
                    <textarea 
                      className={styles.textArea}
                      value={form.bio}
                      onChange={e => setForm({...form, bio: e.target.value})}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                      <button 
                        className="btn btn-sm btn-outline" 
                        onClick={() => setIsEditingBio(false)} 
                        style={{ marginRight: '8px' }}
                      >
                        Cancelar
                      </button>
                      <button 
                        className="btn btn-sm" 
                        onClick={() => {
                          setIsEditingBio(false);
                          handleSave();
                        }}
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className={styles.bioContent}>{form.bio}</p>
                )}
              </div>
              
              <div className={styles.bioSection}>
                <div className={styles.bioTitle}>
                  <FiStar size={16} /> Habilidades e interesses
                </div>
                <div className={styles.skillsContainer}>
                  {skills.map((skill, index) => (
                    <div key={index} className={styles.skillTag}>{skill}</div>
                  ))}
                </div>
              </div>
              
              <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Atividades recentes</h3>
              
              {recentActivity.map(activity => (
                <div key={activity.id} className={styles.activityItem}>
                  <div className={styles.activityIcon}>
                    {activity.type === 'request' ? <FiShoppingBag /> : 
                     activity.type === 'offer' ? <FiDollarSign /> : 
                     <FiActivity />}
                  </div>
                  <div className={styles.activityContent}>
                    <p className={styles.activityTitle}>{activity.title}</p>
                    <p className={styles.activityDate}>{activity.date}</p>
                  </div>
                </div>
              ))}
            </>
          )}
          
          {activeTab === 'pedidos' && (
            <div className="card">
              <div className="bd">
                <p className="sm" style={{ textAlign: 'center', padding: '40px 0' }}>
                  {user.role === 'BUYER' 
                    ? 'Seus pedidos aparecerão aqui quando você criar algum.' 
                    : 'Suas ofertas aparecerão aqui quando você fizer alguma.'}
                </p>
              </div>
            </div>
          )}
          
          {activeTab === 'configuracoes' && (
            <div className="card">
              <div className="hd">
                <h3>Configurações da conta</h3>
              </div>
              <div className="bd">
                <p className="sm" style={{ marginBottom: '24px' }}>
                  Gerencie suas preferências e configurações de conta.
                </p>
                
                <button className="btn btn-outline" onClick={() => setIsEditing(true)}>
                  <FiEdit2 size={16} style={{ marginRight: '8px' }} /> Editar informações do perfil
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}