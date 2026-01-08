import { useState } from 'react';
import { Home } from './components/Home';
import { Profile } from './components/Profile';
import { Sidebar } from './components/Sidebar';
import { PlaylistDetail } from './components/PlaylistDetail';
import { AdminPanel } from './components/AdminPanel';
import { ResourceDetail } from './components/ResourceDetail';

export type View = 'home' | 'profile' | 'admin' | 'playlist' | 'resource';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1">
        {currentView === 'home' && <Home />}
        {currentView === 'profile' && (
          <Profile onPlaylistClick={() => setCurrentView('playlist')} />
        )}
        {currentView === 'admin' && <AdminPanel />}
        {currentView === 'playlist' && (
          <PlaylistDetail
            onBack={() => setCurrentView('profile')}
            onResourceClick={() => setCurrentView('resource')}
          />
        )}
        {currentView === 'resource' && (
          <ResourceDetail onBack={() => setCurrentView('playlist')} />
        )}
      </main>
    </div>
  );
}