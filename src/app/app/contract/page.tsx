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
    <div className="w-full min-h-screen flex justify-center items-center">
      <object
        data="/Contrato_de_Comodato_Botijao_Gas.pdf"
        type="application/pdf"
        className="w-full h-[80vh] border-none"
      >
        <div className="text-center p-5">
          <p>Clique aqui para baixar o contrato de comodato</p>
          <a
            href="/Contrato_de_Comodato_Botijao_Gas.pdf"
            target="_blank"
            className="inline-block py-3 px-6 text-lg text-white bg-blue-500 rounded-md cursor-pointer transition duration-300 hover:bg-blue-700 mt-5"
          >
            Baixar o PDF
          </a>
        </div>
      </object>
    </div>
  );
};

export default ViewContract;
