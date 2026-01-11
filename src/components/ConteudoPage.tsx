import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import ConteudoRecurso from './ConteudoRecurso/ConteudoRecurso';
import './ConteudoPage.css';

type RouteParams = {
  id: string;
};

const ConteudoPage: React.FC = () => {
  const { id } = useParams<RouteParams>();

  return (
    <div className="app-container">
      <Sidebar />
      {id ? (
        <ConteudoRecurso conteudoId={id} />
      ) : (
        <div className="error-message">ID do conteúdo não encontrado.</div>
      )}
    </div>
  );
};

export default ConteudoPage;