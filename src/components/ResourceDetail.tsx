import { ArrowLeft, Download, Heart, Plus, Eye } from 'lucide-react';
import { FileText } from 'lucide-react';

interface ResourceDetailProps {
  onBack: () => void;
}

export function ResourceDetail({ onBack }: ResourceDetailProps) {
  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Introdução ao Cálculo Diferencial
        </h1>
        <p className="text-gray-600">
          By <span className="text-teal-600 font-medium">Maria Oliveira</span>
        </p>
      </div>

      {/* PDF Document Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">PDF Document</p>
              <h3 className="font-medium text-gray-900 mb-1">
                Introdução ao Cálculo Diferencial - Part 1
              </h3>
              <p className="text-sm text-gray-600">
                Material completo sobre cálculo diferencial para o ensino médio.
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      {/* Actions and Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Heart className="w-5 h-5" />
              Like
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Plus className="w-5 h-5" />
              Add to Playlist
            </button>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-gray-600">
                <Eye className="w-4 h-4" />
                <span className="font-medium">245</span>
              </div>
              <span className="text-gray-500">views</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 text-gray-600">
                <Heart className="w-4 h-4" />
                <span className="font-medium">34</span>
              </div>
              <span className="text-gray-500">likes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm">
            Matemática
          </span>
          <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm">
            3º Ano
          </span>
          <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm">
            PDF
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
        <p className="text-gray-600 leading-relaxed">
          Material completo sobre cálculo diferencial para o ensino médio.
        </p>
      </div>
    </div>
  );
}
