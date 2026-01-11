import { useState, useEffect } from 'react';
import { ArrowLeft, Play, GripVertical, Eye, Heart, Download, FileText, Video, Link as LinkIcon, StickyNote, File } from 'lucide-react';

const API_URL = 'https://acervomestrebackend.onrender.com';

interface Resource {
  id: number;
  titulo: string;
  descricao: string;
  estrutura: 'UPLOAD' | 'URL' | 'NOTA';
  mime_type?: string;
  tags?: { id: number; nome: string }[];
  visualizacoes: number;
  curtidas: number;
  downloads: number;
  autor_nome?: string;
}

interface PlaylistResponse {
  id: number;
  titulo: string;
  descricao: string;
  autor_id: number;
  criado_em: string;
  recursos: Resource[];
  visibilidade?: string;
  autor_nome?: string;
  quantidade_recursos?: number;
}

interface PlaylistDetailProps {
  playlistId: string;
  onBack: () => void;
  onResourceClick: (resourceId: string) => void;
}

export function PlaylistDetail({ playlistId, onBack, onResourceClick }: PlaylistDetailProps) {
  const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistData();
    }
  }, [playlistId]);

  const fetchPlaylistData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const numericId = playlistId.replace(/\D/g, '');
      
      if (!numericId) {
        throw new Error("ID inválido");
      }

      const response = await fetch(`${API_URL}/playlists/get/${numericId}`, { headers });
      
      if (response.ok) {
        const data = await response.json();
        setPlaylist(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getResourceStyle = (resource: Resource) => {
    if (resource.estrutura === 'NOTA') return { icon: StickyNote, bg: 'bg-red-50', text: 'text-red-300', label: 'Nota' };
    if (resource.estrutura === 'URL') return { icon: LinkIcon, bg: 'bg-gray-50', text: 'text-gray-400', label: 'Link' };
    if (resource.mime_type?.includes('pdf')) return { icon: FileText, bg: 'bg-green-50', text: 'text-green-400', label: 'PDF' };
    if (resource.mime_type?.includes('video')) return { icon: Video, bg: 'bg-purple-50', text: 'text-purple-400', label: 'Vídeo' };
    return { icon: File, bg: 'bg-blue-50', text: 'text-blue-400', label: 'Arquivo' };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-8 w-full min-h-screen">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 mb-6">
          <ArrowLeft className="w-5 h-5" /> Voltar
        </button>
        <div className="text-center text-gray-500">Playlist não encontrada.</div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full min-h-screen">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para Perfil
      </button>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-teal-600 rounded-lg flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{playlist.titulo}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded uppercase text-xs font-semibold">
                {playlist.visibilidade || 'Público'}
              </span>
              <span>• {playlist.recursos?.length || 0} recursos</span>
            </div>
            <p className="text-gray-600 text-sm">
              {playlist.descricao || 'Sem descrição.'}
            </p>
            {playlist.autor_nome && (
              <p className="text-sm text-gray-500 mt-2">
                Criado por <span className="text-teal-600 font-medium">{playlist.autor_nome}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Recursos da Playlist</h2>
          <p className="text-sm text-gray-600">Visualize os materiais desta coleção</p>
        </div>
      </div>

      <div className="space-y-4">
        {(!playlist.recursos || playlist.recursos.length === 0) ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg border border-dashed">
            Esta playlist está vazia.
          </div>
        ) : (
          playlist.recursos.map((resource, index) => {
            const style = getResourceStyle(resource);
            const IconComponent = style.icon;
            
            return (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start gap-4 p-4">
                  <div className="flex flex-col items-center gap-1 pt-2 cursor-default">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {index + 1}
                    </div>
                    <GripVertical className="w-4 h-4 text-gray-300" />
                  </div>

                  <div className={`w-20 h-20 ${style.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className={`w-10 h-10 ${style.text}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-medium text-gray-900 mb-1 cursor-pointer hover:text-teal-600 truncate"
                      onClick={() => onResourceClick(String(resource.id))}
                    >
                      {resource.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                      {resource.descricao || 'Sem descrição'}
                    </p>

                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      {resource.tags && resource.tags.length > 0 ? (
                        resource.tags.map(tag => (
                          <span key={tag.id} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {tag.nome}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-400 rounded text-xs">Geral</span>
                      )}
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs border border-gray-200">
                        {style.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1" title="Visualizações">
                        <Eye className="w-4 h-4" />
                        <span>{resource.visualizacoes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1" title="Curtidas">
                        <Heart className="w-4 h-4" />
                        <span>{resource.curtidas || 0}</span>
                      </div>
                      <div className="flex items-center gap-1" title="Downloads">
                        <Download className="w-4 h-4" />
                        <span>{resource.downloads || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}