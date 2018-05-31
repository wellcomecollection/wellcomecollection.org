// @flow
import {Fragment} from 'react';
import {font, spacing} from '../../../utils/classnames';
import type {Book} from '../../../model/books';

type Props = {|
  title: string,
  content: string,
  source: ?Book,
  audio: ?string
|}
const Excerpt = ({
  title,
  content,
  source,
  audio
}: Props) => (
  <Fragment>
    <h2 className='h2'>{title}</h2>
    <div className='bg-white'>
      {/*
        TODO: This should definitely not be in here, but has to be because
        of the way the article body is currently built
      */}
      <div className='body-part__extend-to-right'>
        <div className={`${spacing({s: 3}, {padding: ['top', 'bottom'], margin: ['bottom']})}`}>
          <pre className={`${spacing({s: 3}, {padding: ['left', 'right']})} ${font({s: 'LR3'})} pre  border-color-smoke border-left-width-5`}>{content}</pre>
        </div>
      </div>
    </div>
    {audio && <audio controls src={audio} style={{ width: '100%' }}></audio>}
    {source &&
      <p>
        <a href={`/books/${source.id}`} className={`${font({s: 'HNL5'})}`}>
          {source.title}
        </a>
      </p>
    }
  </Fragment>
);

export default Excerpt;
