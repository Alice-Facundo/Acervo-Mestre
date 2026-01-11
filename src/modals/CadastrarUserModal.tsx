import React, { useState, ChangeEvent, FormEvent } from 'react';
import { UserPlus, X, CheckCircle, Calendar, Lock, Mail, User } from 'lucide-react';
import './Modal.css';

interface CadastrarUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserFormData {
  nome: string;
  email: string;
  senha: string;
  dataNascimento: string;
  perfil: string;
}

const CadastrarUserModal: React.FC<CadastrarUserModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<UserFormData>({
    nome: '',
    email: '',
    senha: '',
    dataNascimento: '',
    perfil: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const temCamposVazios = Object.values(formData).some(valor => valor.trim() === "");

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
      senha: formData.senha,
      data_nascimento: formData.dataNascimento
    };

    try {
      const response = await fetch('https://acervomestrebackend.onrender.com/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dadosParaEnvio)
      });

      if (response.ok) {
        alert("Usuário cadastrado com sucesso!");
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Erro no cadastro: ${errorData.detail || 'Falha na requisição'}`);
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <header className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserPlus size={24} color="#0c5a6d" />
            <h2>Cadastrar Usuário</h2>
          </div>
          <button 
            className="close-modal-btn" 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
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
              placeholder="Digite seu nome" 
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
              placeholder="exemplo@email.com" 
              value={formData.email}
              onChange={handleChange} 
            />
          </div>

          <div className="input-group">
            <label>Perfil</label>
            <select name="perfil" value={formData.perfil} onChange={handleChange} required>
              <option value="">Selecione um perfil</option>
              <option value="Gestor">Gestor</option>
              <option value="Coordenador">Coordenador</option>
              <option value="Professor">Professor</option>
              <option value="Aluno">Aluno</option>
            </select>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} /> Senha
              </label>
              <input 
                type="password" 
                name="senha" 
                placeholder="********" 
                value={formData.senha}
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} /> Nascimento
              </label>
              <input 
                type="date" 
                name="dataNascimento" 
                value={formData.dataNascimento}
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-save" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
            >
              <CheckCircle size={18} /> Cadastrar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarUserModal;