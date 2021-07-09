// @flow
import { Fragment } from 'react';
import type { Book } from '../../../model/books';
import { font, classNames } from '../../../utils/classnames';
// $FlowFixMe (tsx)
import Space from '../styled/Space';
import styled from 'styled-components';

const Pre = styled(Space).attrs({
  as: 'pre',
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    [font('lr', 5)]: true,
    pre: true,
  }),
})`
  border-left: 5px solid ${props => props.theme.color('smoke')};
`;

type Props = {|
  title: string,
  content: string,
  source: ?Book,
  audio: ?string,
|};
const Excerpt = ({ title, content, source, audio }: Props) => (
  <Fragment>
    <h2 className="h2">{title}</h2>
    <div className="bg-white">
      <Space
        v={{
          size: 'm',
          properties: ['margin-bottom', 'padding-top', 'padding-bottom'],
        }}
      >
        <Pre>{content}</Pre>
      </Space>
    </div>
    {audio && <audio controls src={audio} style={{ width: '100%' }} />}
    {source && (
      <p>
        <a href={`/books/${source.id}`} className={`${font('hnr', 4)}`}>
          {source.title}
        </a>
      </p>
    )}
  </Fragment>
);

export default Excerpt;
