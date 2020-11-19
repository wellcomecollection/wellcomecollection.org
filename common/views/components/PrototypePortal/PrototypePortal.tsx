import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  id: string;
  children: ReactElement;
};

const PrototypePortal: FunctionComponent<Props> = ({
  id,
  children,
}: Props): ReactElement<Props> => {
  const mount = document.getElementById(id);
  const [element] = useState(document.createElement('div'));
  useEffect(() => {
    mount && mount.appendChild(element);
    return () => mount && mount.removeChild(element);
  }, [element, mount]);

  return createPortal(children, element);
};

export default PrototypePortal;
