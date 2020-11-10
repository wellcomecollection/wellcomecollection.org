import { useEffect } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  id: string;
  children: JSX.Element;
};

const PrototypePortal = ({ id, children }: Props): JSX.Element => {
  const mount = document.getElementById(id);
  const el = document.createElement('div');

  useEffect(() => {
    mount && mount.appendChild(el);
    return () => mount && mount.removeChild(el);
  }, [el, mount]);

  return createPortal(children, el);
};

export default PrototypePortal;
