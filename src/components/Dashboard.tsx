import React from 'react';
import { ImageWithFallback } from './ImageWithFallback'; 

export function Dashboard({ user, onNavigate, onLogout }: any) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Bem-vindo, {user.name} ({user.role})</p>
      
      {/* Teste rápido de imagem */}
      <div className="mb-6 border p-4 rounded bg-gray-50">
         <p className="text-sm text-gray-500 mb-2">Teste de componente:</p>
         <ImageWithFallback src="erro-teste" className="w-16 h-16 bg-gray-200 rounded" />
      </div> 

      <div className="flex gap-4">
        <button onClick={() => onNavigate('profile')} className="px-4 py-2 bg-blue-500 text-white rounded">Ir para Perfil</button>
        <button onClick={() => onNavigate('playlist')} className="px-4 py-2 bg-green-500 text-white rounded">Playlists</button>
        <button onClick={onLogout} className="px-4 py-2 border border-red-500 text-red-500 rounded">Sair</button>
      </div>
    </div>
  );
}