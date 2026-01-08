import { ArrowLeft, Play, GripVertical, Eye, Heart, Download } from 'lucide-react';
import { FileText } from 'lucide-react';

interface PlaylistResource {
  id: string;
  order: number;
  title: string;
  description: string;
  subject: string;
  year: string;
  type: string;
  views: number;
  likes: number;
  downloads: number;
  author: string;
}

const playlistResources: PlaylistResource[] = [
  {
    id: '1',
    order: 1,
    title: 'Introdução ao Cálculo Diferencial',
    description: 'Material completo sobre cálculo diferencial.',
    subject: 'Matemática',
    year: '3º Ano',
    type: 'PDF',
    views: 245,
    likes: 34,
    downloads: 89,
    author: 'Maria Oliveira'
  },
  {
    id: '2',
    order: 2,
    title: 'Física - Leis de Newton',
    description: 'Apostila completa sobre as Leis de Newton.',
    subject: 'Física',
    year: '1º Ano',
    type: 'Mecânica',
    views: 567,
    likes: 89,
    downloads: 234,
    author: 'Maria Oliveira'
  }
];

interface PlaylistDetailProps {
  onBack: () => void;
  onResourceClick: (resourceId: string) => void;
}

export function PlaylistDetail({ onBack, onResourceClick }: PlaylistDetailProps) {
  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para Perfil
      </button>

      {/* Playlist Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-teal-600 rounded-lg flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Matemática - 3º Ano</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded">Público</span>
              <span>• 3 recursos</span>
            </div>
            <p className="text-gray-600 text-sm">
              Coleção completa de materiais de matemática para o terceiro ano do ensino médio.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Criado por <span className="text-teal-600 font-medium">Maria Oliveira</span>
            </p>
          </div>
        </div>
      </div>

      {/* Resources List */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Recursos da Playlist</h2>
        <p className="text-sm text-gray-600">(3)</p>
      </div>

      <div className="space-y-4">
        {playlistResources.map((resource) => (
          <div
            key={resource.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4 p-4">
              {/* Order Handle */}
              <div className="flex flex-col items-center gap-1 pt-2">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {resource.order}
                </div>
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>

              {/* Icon */}
              <div className="w-20 h-20 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-10 h-10 text-red-300" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-medium text-gray-900 mb-1 cursor-pointer hover:text-teal-600"
                  onClick={() => onResourceClick(resource.id)}
                >
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>

                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {resource.subject}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {resource.year}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {resource.type}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{resource.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{resource.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{resource.downloads}</span>
                  </div>
                  <span>•</span>
                  <span>por {resource.author}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
