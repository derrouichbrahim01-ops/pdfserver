import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EmbedWrapper } from './components/EmbedWrapper';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EmbedWrapper />
  </StrictMode>
);