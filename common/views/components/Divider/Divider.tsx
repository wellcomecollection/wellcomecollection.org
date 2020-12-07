import { FunctionComponent, ReactElement } from 'react';

type Props = {
  extraClasses?: string;
};

const Divider: FunctionComponent<Props> = ({
  extraClasses,
}: Props): ReactElement => <hr className={`divider ${extraClasses || ''}`} />;

export default Divider;
