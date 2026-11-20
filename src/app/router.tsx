/**
 * Rotas por hash (D-12): funcionam em qualquer hospedagem estática.
 */
import { createHashRouter, Navigate } from 'react-router';
import { Raiz } from './Raiz';
import { Home } from '../pages/Home';
import { Apresentacao } from '../pages/Apresentacao';
import { Licao } from '../pages/Licao';
import { Transicao } from '../pages/Transicao';
import { Quiz } from '../pages/Quiz';
import { Resultado } from '../pages/Resultado';
import { NaoEncontrada } from '../pages/NaoEncontrada';

export const router = createHashRouter([
  {
    path: '/',
    element: <Raiz />,
    children: [
      { index: true, element: <Home /> },
      { path: 'apresentacao', element: <Apresentacao /> },
      { path: 'trilha', element: <Navigate to="/trilha/1/1" replace /> },
      { path: 'trilha/:conceito', element: <Navigate to="1" replace /> },
      { path: 'trilha/:conceito/:etapa', element: <Licao /> },
      { path: 'transicao', element: <Transicao /> },
      { path: 'quiz', element: <Navigate to="/quiz/1" replace /> },
      { path: 'quiz/:n', element: <Quiz /> },
      { path: 'resultado', element: <Resultado /> },
      { path: '*', element: <NaoEncontrada /> },
    ],
  },
]);
