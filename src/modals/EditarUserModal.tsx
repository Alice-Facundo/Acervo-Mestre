import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { User, Mail, Shield, Calendar, X, Save } from 'lucide-react';
import './Modal.css';

interface EditarUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | number | null;
}

interface UserFormData {
  nome: string;
  email: string;
  perfil: string;
  dataNascimento: string;
}

const EditarUserModal: React.FC<EditarUserModalProps> = ({ isOpen, onClose, userId }) => {
  const [formData, setFormData] = useState<UserFormData>({
    nome: '',
    email: '',
    perfil: '',
    dataNascimento: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingGet, setLoadingGet] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ nome: '', email: '', perfil: '', dataNascimento: '' });
      return;
    }

    if (userId) {
      const carregarUsuario = async () => {
        setLoadingGet(true);
        const token = localStorage.getItem('token_acervo');
        try {
          const response = await fetch(`https://acervomestrebackend.onrender.com/users/get/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setFormData({
              nome: data.nome || '',
              email: data.email || '',
              perfil: data.perfil || '',
              dataNascimento: data.data_nascimento || ''
            });
          }
        } catch (error) {
          console.error("Erro ao carregar usuário:", error);
        } finally {
          setLoadingGet(false);
        }
      };
      carregarUsuario();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const temCamposVazios = Object.values(formData).some(valor => String(valor).trim() === "");
    if (temCamposVazios) {
      alert("Erro: Todos os campos são obrigatórios. Por favor, preencha todos os dados.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Erro: O formato do e-mail inserido é inválido.");
      return;
    }

    const token = localStorage.getItem('token_acervo');
    const dadosParaEnvio = {
      nome: formData.nome,
      email: formData.email,
      perfil: formData.perfil,
      data_nascimento: formData.dataNascimento
    };

    try {
      setLoading(true);
      const response = await fetch(`https://acervomestrebackend.onrender.com/users/patch/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosParaEnvio)
      });

      if (response.ok) {
        alert("Usuário atualizado com sucesso!");
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Erro na atualização: ${errorData.detail || 'Falha na requisição'}`);
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {loadingGet ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <header className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={24} color="#0c5a6d" />
                <h2>Editar Usuário</h2>
              </div>
              <button className="close-modal-btn" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} color="#6c757d" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="modal-form" noValidate>
              <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} /> Nome Completo
                </label>
                <input 
                  type="text" 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleChange} 
                />
              </div>

              <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={16} /> E-mail
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                />
              </div>

              <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} /> Perfil
                </label>
                <select name="perfil" value={formData.perfil} onChange={handleChange}>
                  <option value="">Selecione um perfil</option>
                  <option value="Gestor">Gestor</option>
                  <option value="Coordenador">Coordenador</option>
                  <option value="Professor">Professor</option>
                  <option value="Aluno">Aluno</option>
                </select>
              </div>

              <div className="input-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} /> Data de Nascimento
                </label>
                <input 
                  type="date" 
                  name="dataNascimento" 
                  value={formData.dataNascimento} 
                  onChange={handleChange} 
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-save" 
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                >
                  <Save size={18} />
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EditarUserModal;