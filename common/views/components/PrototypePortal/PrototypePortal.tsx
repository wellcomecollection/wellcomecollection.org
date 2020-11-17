import { FunctionComponent, ReactElement, ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  id: string;
  children: ReactNode;
};

const PrototypePortal: FunctionComponent<Props> = ({
  id,
  children,
}: Props): ReactElement<Props> => {
  const mount = document.getElementById(id);
  const el = document.createElement('div');

  useEffect(() => {
    mount && mount.appendChild(el);
    return () => mount && mount.removeChild(el);
  }, [el, mount]);

  return createPortal(children, el);
};

export default PrototypePortal;
