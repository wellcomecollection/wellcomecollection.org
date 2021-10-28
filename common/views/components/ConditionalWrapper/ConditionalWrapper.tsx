import { FC } from 'react';

type Props = {
  condition: boolean;
  wrapper: any;
  children: any;
};

const ConditionalWrapper: FC<Props> = ({
  condition,
  wrapper,
  children,
}: Props) => (condition ? wrapper(children) : children);

export default ConditionalWrapper;
