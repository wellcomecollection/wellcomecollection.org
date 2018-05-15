// @flow

import { spacing, font } from '../../../utils/classnames';
import ReactGA from 'react-ga';

export type TagProps = {|
  text: string,
  url?: string
|}

export type Props = {|
  tags: TagProps[]
|}

function buildTag(text: string, url?: string): React.Element<'div' | 'a'> {
  const HTMLTag = url ? 'a' : 'div';

  return (
    <HTMLTag
      href={url}
      className={`plain-link flex font-white bg-black ${url ? 'bg-hover-green transition-bg' : ''} ${spacing({s: 1}, {padding: ['top', 'bottom']})} ${spacing({s: 2}, {padding: ['left', 'right']})} rounded-diagonal`}>
      {text}
    </HTMLTag>
  );
}

const Tags = ({ tags }: Props) => {
  return (
    <div className='tags'>
      <ul className='tags__list plain-list no-margin no-padding flex flex--wrap'>
        {tags.map(({ text, url }) => (
          <Tag key={text} text={text} url={url} />
        ))}
      </ul>
    </div>
  );
};

const Tag = ({text, url}: TagProps) => {
  function trackTagClick() {
    ReactGA.event({
      category: 'component',
      action: 'Tag:click',
      label: `text:${text}${url ? `, url:${url}` : ''}`
    });
  }

  return (
    <li onClick={trackTagClick} className={`tags__tag ${font({s: 'HNL5', m: 'WB7'})} ${spacing({s: 2}, {margin: ['right', 'bottom']})}`}
      data-track-event={JSON.stringify({
        category: 'component',
        action: 'tag:click',
        label: `text:${text}${url ? `, url:${url}` : ''}`
      })}>
      {buildTag(text, url)}
    </li>
  );
};

export default Tags;
