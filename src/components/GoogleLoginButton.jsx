import React, { useEffect, useRef } from 'react';

const GoogleLoginButton = ({ clientId, onCredential }) => {
  const btnRef = useRef(null);

  useEffect(() => {
    // Carga el script GSI
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      /* global google */
      window.google?.accounts.id.initialize({
        client_id: clientId,
        callback: (resp) => onCredential?.(resp.credential),
      });
      window.google?.accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'rectangular',
        width: 320,
      });
      // (opcional) One Tap:
      // window.google?.accounts.id.prompt();
    };
    document.body.appendChild(script);
    return () => {
      // limpieza sencilla
      if (script && script.parentNode) script.parentNode.removeChild(script);
    };
  }, [clientId, onCredential]);

  return <div ref={btnRef} />;
};

export default GoogleLoginButton;