import { Home, User, Settings, LogOut } from 'lucide-react';
import type { View } from '../App';

// REMOVIDO: import logo from 'figma:asset/...' que causava o erro

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside className="w-[240px] bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        {/* Substituído por um texto ou imagem via URL provisória */}
        <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-teal-700 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-xl text-gray-800">Acervo Mestre</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <button
          onClick={() => onNavigate('home')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-1 ${
            currentView === 'home' 
              ? 'bg-cyan-50 text-cyan-900' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Início</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors mb-1 ${
            currentView === 'profile' 
              ? 'bg-cyan-50 text-cyan-900' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Meu Perfil</span>
        </button>

        <button
          onClick={() => onNavigate('admin')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
            currentView === 'admin' 
              ? 'bg-cyan-50 text-cyan-900' 
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Administração</span>
        </button>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-3">
          <div className="font-medium text-gray-900">Ana Silva</div>
          <div className="text-sm text-gray-500">Gestor</div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}