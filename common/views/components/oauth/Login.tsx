import { FunctionComponent } from 'react';

type Props = {
  text: string;
};

const Login: FunctionComponent<Props> = ({ text }: Props) => {
  return <button type="button">{text}</button>;
};

export default Login;
