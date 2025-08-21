import React from 'react';
import App from '../App';

export const EmbedWrapper: React.FC = () => {
  return (
    <div className="iframe-embed">
      <style>{`
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        .iframe-embed {
          width: 100%;
          min-height: 100vh;
          background: #f9fafb;
        }
        /* Ensure responsive behavior in iframe */
        @media (max-width: 768px) {
          .iframe-embed {
            padding: 0;
          }
        }
      `}</style>
      <App />
    </div>
  );
};