import { FC } from 'react';

type Props = {
  text: string;
};

const Login: FC<Props> = ({ text }: Props) => {
  return <button type="button">{text}</button>;
};

export default Login;
