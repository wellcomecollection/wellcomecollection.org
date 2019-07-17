// @flow
import { Fragment } from 'react';
import type { Book } from '../../../model/books';
import { font, spacing } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';

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
      <VerticalSpace
        size="m"
        properties={['margin-bottom', 'padding-top', 'padding-bottom']}
      >
        <pre
          className={`${spacing(
            { s: 3 },
            { padding: ['left', 'right'] }
          )} ${font({
            s: 'LR3',
          })} pre  border-color-smoke border-left-width-5`}
        >
          {content}
        </pre>
      </VerticalSpace>
    </div>
    {audio && <audio controls src={audio} style={{ width: '100%' }} />}
    {source && (
      <p>
        <a href={`/books/${source.id}`} className={`${font({ s: 'HNL5' })}`}>
          {source.title}
        </a>
      </p>
    )}
  </Fragment>
);

export default Excerpt;
