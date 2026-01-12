import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Profile } from './components/Profile';
import { Sidebar } from './components/Sidebar';
import { PlaylistDetail } from './components/PlaylistDetail';
import { AdminPanel } from './components/AdminPanel';
import { ResourceDetail } from './components/ResourceDetail';
import { Login } from './components/Login';
import { ActivateAccount } from './components/ActivateAccount';
import { PasswordModal } from './modals/PasswordModal';
import { AddToPlaylistModal } from './modals/AddToPlaylistModal'; // Importe o modal aqui

export type View = 'home' | 'profile' | 'admin' | 'playlist' | 'resource';

const API_URL = 'https://acervomestrebackend.onrender.com';

export interface User {
  id: number;
  nome?: string;
  name?: string;
  email: string;
  perfil: string;
  role?: string;
  url_perfil?: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showActivateAccount, setShowActivateAccount] = useState(false);
  
  // Estados para Playlist Modal
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [playlistResourceData, setPlaylistResourceData] = useState<{id: number, title: string} | null>(null);

  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      fetchCurrentUser(token);
    }
  }, []);

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    const token = localStorage.getItem('accessToken');
    if (token) fetchCurrentUser(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleForgotPassword = () => {
    setShowPasswordModal(true);
  };

  const handleActivateAccount = () => {
    setShowActivateAccount(true);
  };

  const handleActivateSubmit = () => {
    setShowActivateAccount(false);
    alert('Conta ativada com sucesso! Faça login para continuar.');
  };

  const handlePasswordSubmit = (password: string) => {
    console.log(password);
    setShowPasswordModal(false);
    alert('Senha alterada com sucesso! Faça login com a nova senha.');
  };

  // Funções de Navegação e Modais
  const handlePlaylistClick = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setCurrentView('playlist');
  };

  const handleResourceClick = (resourceId: string) => {
    setSelectedResourceId(resourceId);
    setCurrentView('resource');
  };

  // Função para abrir o modal vindo do ResourceDetail
  const handleOpenPlaylistModal = (id: number, title: string) => {
    setPlaylistResourceData({ id, title });
    setIsAddToPlaylistOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <>
        <Login 
          onLogin={handleLogin} 
          onForgotPassword={handleForgotPassword}
          onActivateAccount={handleActivateAccount}
        />
        <ActivateAccount
          isOpen={showActivateAccount}
          onClose={() => setShowActivateAccount(false)}
          onSuccess={handleActivateSubmit}
        />
        <PasswordModal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          mode="change"
          onSubmit={handlePasswordSubmit}
        />
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        user={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        {currentView === 'home' && (
          <Home 
            onPlaylistClick={handlePlaylistClick}
            onResourceClick={handleResourceClick}
          />
        )}
        
        {currentView === 'profile' && (
          <Profile 
            onPlaylistClick={handlePlaylistClick} 
            onResourceClick={handleResourceClick}
            user={currentUser}
          />
        )}
        
        {currentView === 'admin' && <AdminPanel />}
        
        {currentView === 'playlist' && (
          <PlaylistDetail
            playlistId={selectedPlaylistId}
            onBack={() => setCurrentView('profile')}
            onResourceClick={handleResourceClick}
          />
        )}
        
        {currentView === 'resource' && (
          <ResourceDetail 
            resourceId={selectedResourceId}
            onBack={() => setCurrentView('home')} 
            onAddToPlaylistClick={handleOpenPlaylistModal} // Passando a função para o detalhe
          />
        )}
      </main>

      {/* Modais Globais */}
      <AddToPlaylistModal 
        isOpen={isAddToPlaylistOpen}
        onClose={() => setIsAddToPlaylistOpen(false)}
        resourceTitle={playlistResourceData?.title || ''}
        resourceId={playlistResourceData?.id}
      />

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        mode="change"
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
}