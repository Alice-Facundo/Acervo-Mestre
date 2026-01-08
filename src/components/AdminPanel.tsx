import { useState } from 'react';
import { Search, UserPlus, Edit } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Ativo' | 'Inativo';
}

const users: User[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'gestor@escola.edu',
    role: 'Gestor',
    status: 'Ativo'
  },
  {
    id: '2',
    name: 'Carlos Santos',
    email: 'coord@escola.edu',
    role: 'Coordenador',
    status: 'Ativo'
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'prof@escola.edu',
    role: 'Professor',
    status: 'Ativo'
  },
  {
    id: '4',
    name: 'João Pedro',
    email: 'aluno@escola.edu',
    role: 'Aluno',
    status: 'Inativo'
  },
  {
    id: '5',
    name: 'Pedro Costa',
    email: 'pedro@escola.edu',
    role: 'Professor',
    status: 'Ativo'
  },
  {
    id: '6',
    name: 'Ana Paula',
    email: 'ana@escola.edu',
    role: 'Coordenador',
    status: 'Ativo'
  }
];

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'users' | 'metadata'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Painel de Administração</h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-2.5 rounded-full transition-colors font-medium text-sm ${
            activeTab === 'users'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Gestão de Usuários
        </button>
        <button
          onClick={() => setActiveTab('metadata')}
          className={`px-6 py-2.5 rounded-full transition-colors font-medium text-sm ${
            activeTab === 'metadata'
              ? 'bg-teal-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Gestão de Metadados
        </button>
      </div>

      {activeTab === 'users' && (
        <>
          {/* Search and Add User */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar por nome..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              <UserPlus className="w-5 h-5" />
              Cadastrar Novo Usuário
            </button>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">E-mail</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Perfil</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          user.status === 'Ativo'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                            user.status === 'Ativo'
                              ? 'text-gray-700 hover:bg-gray-100'
                              : 'text-green-700 hover:bg-green-50'
                          }`}
                        >
                          {user.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'metadata' && (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-600">Gestão de metadados em desenvolvimento...</p>
        </div>
      )}
    </div>
  );
}