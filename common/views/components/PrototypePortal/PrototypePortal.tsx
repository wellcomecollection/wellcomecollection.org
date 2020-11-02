import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const PrototypePortal = ({ id, children }) => {
  if (typeof window !== 'undefined') {
    const mount = document.getElementById(id);
    const el = document.createElement('div');

    useEffect(() => {
      mount && mount.appendChild(el);
      return () => mount && mount.removeChild(el);
    }, [el, mount]);

    return createPortal(children, el);
  } else {
    return null;
  }
};

export default PrototypePortal;
