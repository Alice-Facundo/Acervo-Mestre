import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';

const API_URL = '/api';

interface Tag {
  id: number;
  nome: string;
}

const initialFormats = ['PDF', 'Vídeo', 'Apresentação', 'Documento', 'Link'];

export function MetadataManagement() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [formats, setFormats] = useState(initialFormats);
  const [newSubject, setNewSubject] = useState('');
  const [newFormat, setNewFormat] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setIsLoading(true);
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
          setSubjects(data.map((tag: Tag) => tag.nome));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubject = async () => {
    const term = newSubject.trim();
    if (term && !subjects.includes(term)) {
      try {
        const token = localStorage.getItem('accessToken');
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };

        const response = await fetch(`${API_URL}/tags/create`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ nome: term })
        });

        if (response.ok) {
          const data = await response.json();
          setSubjects([...subjects, data.nome]);
          setNewSubject('');
        } else {
          console.error('Erro ao criar tag');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleAddFormat = () => {
    if (newFormat.trim() && !formats.includes(newFormat.trim())) {
      setFormats([...formats, newFormat.trim()]);
      setNewFormat('');
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setSubjects(subjects.filter((s) => s !== subject));
  };

  const handleRemoveFormat = (format: string) => {
    setFormats(formats.filter((f) => f !== format));
  };

  const handleKeyDownSubject = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubject();
    }
  };

  const handleKeyDownFormat = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFormat();
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Matérias (Tags)</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            onKeyDown={handleKeyDownSubject}
            placeholder="Nova matéria..."
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleAddSubject}
            className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-4">
            <span className="animate-spin h-5 w-5 border-2 border-teal-600 border-t-transparent rounded-full"></span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {subjects.length === 0 ? (
              <span className="text-gray-500 text-sm italic">Nenhuma tag cadastrada.</span>
            ) : (
              subjects.map((subject) => (
                <div
                  key={subject}
                  className="group flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="text-sm text-gray-700">{subject}</span>
                  <button
                    onClick={() => handleRemoveSubject(subject)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Formatos</h2>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newFormat}
            onChange={(e) => setNewFormat(e.target.value)}
            onKeyDown={handleKeyDownFormat}
            placeholder="Novo formato..."
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            onClick={handleAddFormat}
            className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formats.map((format) => (
            <div
              key={format}
              className="group flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <span className="text-sm text-gray-700">{format}</span>
              <button
                onClick={() => handleRemoveFormat(format)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}