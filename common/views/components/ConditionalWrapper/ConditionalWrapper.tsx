import { FunctionComponent } from 'react';

type Props = {
  condition: boolean;
  wrapper: any;
  children: any;
};

const ConditionalWrapper: FunctionComponent<Props> = ({
  condition,
  wrapper,
  children,
}: Props) => (condition ? wrapper(children) : children);

export default ConditionalWrapper;
