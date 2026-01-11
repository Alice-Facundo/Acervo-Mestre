import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Video,       
  FileText,    
  Link as LinkIcon, 
  StickyNote,   
  File          
} from 'lucide-react';
import { ResourceCard } from './ResourceCard';
import { PlaylistCard } from './PlaylistCard';
import { ResourceModal } from '../modals/ResourceModal';
import { RemoveResourceModal } from './RemoveResourceModal';
import { AddToPlaylistModal } from '../modals/AddToPlaylistModal';
import type { Resource, Playlist } from './types';

const API_URL = 'https://acervomestrebackend.onrender.com';

const resourceFormats = [
  { id: 'video', label: 'Vídeo', icon: Video },
  { id: 'pdf', label: 'PDF', icon: FileText },
  { id: 'link', label: 'Link', icon: LinkIcon },
  { id: 'nota', label: 'Nota', icon: StickyNote },
  { id: 'doc', label: 'Documento', icon: File },
];

interface Tag {
  id: number;
  nome: string;
}

interface HomeProps {
  onPlaylistClick: (playlistId: string) => void;
  onResourceClick: (resourceId: string) => void;
}

export function Home({ onPlaylistClick, onResourceClick }: HomeProps) {
  const [highlightedResources, setHighlightedResources] = useState<(Resource | Playlist)[]>([]);
  const [mostSavedResources, setMostSavedResources] = useState<Resource[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  useEffect(() => {
    const init = async () => {
      await fetchTags();
      await fetchContent();
    };
    init();
  }, []);

  const fetchTags = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };
      
      const response = await fetch(`${API_URL}/tags/get_all`, { headers });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setTags(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchContent = async (query: string = '') => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const searchParam = query ? `&palavra_chave=${encodeURIComponent(query)}` : '';
      
      const [resResponse, plResponse] = await Promise.all([
        fetch(`${API_URL}/recursos/get_all?page=1&per_page=20${searchParam}`, { headers }),
        fetch(`${API_URL}/playlists/get_all?page=1&per_page=10`, { headers })
      ]);

      let mappedResources: Resource[] = [];
      let mappedPlaylists: Playlist[] = [];

      if (resResponse.ok) {
        const resData = await resResponse.json();
        mappedResources = (resData.items || []).map((item: any) => {
          let type = 'Documento';
          let style = { bgColor: 'bg-blue-50', iconColor: 'text-blue-400', icon: 'file' };

          if (item.estrutura === 'NOTA') {
            type = 'NOTA';
            style = { bgColor: 'bg-red-50', iconColor: 'text-red-400', icon: 'document' };
          } else if (item.estrutura === 'URL') {
            type = 'LINK';
            style = { bgColor: 'bg-gray-50', iconColor: 'text-gray-400', icon: 'link' };
          } else if (item.estrutura === 'UPLOAD') {
            if (item.mime_type?.includes('pdf')) {
              type = 'PDF';
              style = { bgColor: 'bg-green-50', iconColor: 'text-green-400', icon: 'download' };
            } else if (item.mime_type?.includes('video')) {
              type = 'Vídeo';
              style = { bgColor: 'bg-purple-50', iconColor: 'text-purple-400', icon: 'video' };
            }
          }

          return {
            id: `res-${item.id}`,
            title: item.titulo,
            author: 'Professor',
            subject: item.tags?.[0]?.nome || 'Geral',
            year: 'Ensino Médio',
            type: type,
            icon: style.icon,
            bgColor: style.bgColor,
            iconColor: style.iconColor,
            views: item.visualizacoes,
            downloads: item.downloads,
            likes: item.curtidas,
            isPlaylist: false,
            is_destaque: item.is_destaque
          };
        });
      }

      if (plResponse.ok) {
        const plData = await plResponse.json();
        mappedPlaylists = (plData.items || []).map((item: any) => ({
          id: `pl-${item.id}`,
          title: item.titulo,
          author: 'Mestre',
          subject: 'Playlist',
          year: '',
          type: 'folder',
          icon: 'folder',
          bgColor: 'bg-teal-100',
          iconColor: 'text-teal-700',
          resources: item.quantidade_recursos,
          visibility: 'Público',
          isPlaylist: true,
          views: 0,
          downloads: 0,
          likes: 0
        }));
      }

      const highlights = [
        ...mappedPlaylists,
        ...mappedResources.filter((r) => r.is_destaque)
      ];
      
      if (highlights.length < 4 && mappedResources.length > 0) {
        const remaining = mappedResources.filter(r => !r.is_destaque);
        highlights.push(...remaining.slice(0, 4 - highlights.length));
      }

      const popular = [...mappedResources].sort((a, b) => (b.likes || 0) - (a.likes || 0));

      setHighlightedResources(highlights);
      setMostSavedResources(popular);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSelectedFilter(null);
      fetchContent(searchQuery);
    }
  };

  const handleFilterClick = (filterValue: string) => {
    if (selectedFilter === filterValue) {
      setSelectedFilter(null);
      setSearchQuery('');
      fetchContent('');
    } else {
      setSelectedFilter(filterValue);
      setSearchQuery(filterValue);
      fetchContent(filterValue);
    }
  };

  const handleRemoveClick = (resource: Resource) => {
    setSelectedResource(resource);
    setIsRemoveModalOpen(true);
  };

  const handleAddToPlaylistClick = (resource: Resource) => {
    setSelectedResource(resource);
    setIsAddToPlaylistModalOpen(true);
  };

  const handleConfirmRemove = () => {
    console.log('Removing resource:', selectedResource);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    console.log('Adding resource to playlist:', selectedResource, playlistId);
  };

  const getNumericId = (resourceId: string | undefined) => {
    if (!resourceId) return undefined;
    const numericPart = resourceId.replace(/\D/g, ''); 
    return numericPart ? parseInt(numericPart) : undefined;
  };

  const handleCardClick = (resource: Resource) => {
    // Remove prefixos como 'res-' ou 'pl-' antes de enviar o ID
    if (resource.isPlaylist) {
      const id = resource.id.replace(/\D/g, '');
      onPlaylistClick(id);
    } else {
      const id = resource.id.replace(/\D/g, '');
      onResourceClick(id);
    }
  };

  return (
    <div className="p-8 w-full min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Procurar por conteúdo, formato ou tag..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2 flex-wrap items-center">
            {resourceFormats.map((format) => {
              const Icon = format.icon;
              return (
                <button
                  key={format.id}
                  onClick={() => handleFilterClick(format.label)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-colors font-medium ${
                    selectedFilter === format.label
                      ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <Icon size={16} />
                  {format.label}
                </button>
              );
            })}
            {tags.length > 0 && <div className="w-px h-6 bg-gray-300 mx-1"></div>}
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => handleFilterClick(tag.nome)}
                className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                  selectedFilter === tag.nome
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                }`}
              >
                {tag.nome}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsResourceModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Adicionar Recurso
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-teal-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Destaque</h2>
              <div className="flex gap-2">
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {highlightedResources.length === 0 ? (
                 <div className="col-span-full text-center text-gray-500 py-8">
                   Nenhum conteúdo encontrado.
                 </div>
              ) : (
                highlightedResources.slice(0, 4).map((item) => (
                  <div key={item.id} onClick={() => handleCardClick(item as Resource)} className="cursor-pointer">
                    {item.isPlaylist ? (
                      <PlaylistCard 
                        playlist={item as Playlist} 
                        onClick={() => onPlaylistClick(item.id.replace(/\D/g, ''))} 
                      />
                    ) : (
                      <ResourceCard 
                        resource={item as Resource}
                        onRemoveClick={handleRemoveClick}
                        onAddToPlaylistClick={handleAddToPlaylistClick}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Mais Curtidos</h2>
              <div className="flex gap-2">
                 <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {mostSavedResources.length === 0 ? (
                 <div className="col-span-full text-center text-gray-500 py-8">
                   Nenhum recurso encontrado.
                 </div>
              ) : (
                mostSavedResources.slice(0, 4).map((resource) => (
                  <div key={resource.id} onClick={() => handleCardClick(resource)} className="cursor-pointer">
                    <ResourceCard 
                      resource={resource}
                      onRemoveClick={handleRemoveClick}
                      onAddToPlaylistClick={handleAddToPlaylistClick}
                    />
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}

      <ResourceModal 
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
      />
      <RemoveResourceModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        resourceTitle={selectedResource?.title || ''}
        resourceAuthor={selectedResource?.author || ''}
        resourceId={getNumericId(selectedResource?.id)}
        onConfirmRemove={handleConfirmRemove}
      />
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        resourceTitle={selectedResource?.title || ''}
        resourceId={getNumericId(selectedResource?.id)}
        onAddToPlaylist={handleAddToPlaylist}
      />
    </div>
  );
}