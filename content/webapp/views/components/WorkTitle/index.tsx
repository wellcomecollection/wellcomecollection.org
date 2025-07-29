import { FunctionComponent, ReactElement } from 'react';

type Props = { title: string };

const WorkTitle: FunctionComponent<Props> = ({
  title,
}: Props): ReactElement<Props> => (
  <span dangerouslySetInnerHTML={{ __html: title }} data-component="work-title" />
);

export default WorkTitle;
