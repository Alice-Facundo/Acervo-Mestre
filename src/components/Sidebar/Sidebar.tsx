import React from 'react';
import { Home, User, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* Logo do Acervo Mestre */}
        <div className="sidebar-logo-container">
          <img 
            src="/logo acervo mestre.png" 
            alt="Acervo Mestre" 
            className="full-logo"
          />
        </div>
      </div>
      
      <nav className="nav-group">
        <div className="nav-item active">
          <Home size={20} /> <span>Início</span>
        </div>
        <div className="nav-item">
          <User size={20} /> <span>Meu Perfil</span>
        </div>
        <div className="nav-item">
          <Settings size={20} /> <span>Administração</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <p className="user-name">Ana Silva</p>
          <p className="user-role">Gestor</p>
        </div>
        <button 
          className="logout-btn" 
          onClick={() => console.log("Logout clicado")}
        >
          <LogOut size={20} /> <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;