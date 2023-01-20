import { FunctionComponent, ReactElement, ReactNode } from 'react';

type Props = {
  condition: boolean;
  wrapper: (children: ReactNode) => ReactElement | false;
  children: ReactNode;
};

const ConditionalWrapper: FunctionComponent<Props> = ({
  condition,
  wrapper,
  children,
}) => (condition ? wrapper(children) || null : <>{children}</>);

export default ConditionalWrapper;
