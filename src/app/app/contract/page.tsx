'use client';

import React, { useState, useEffect } from 'react';

const ViewContract = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="/Contrato_de_Comodato_Botijao_Gas.pdf"
        width="100%"
        height="100%"
        title="Contrato de Comodato"
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default ViewContract;
