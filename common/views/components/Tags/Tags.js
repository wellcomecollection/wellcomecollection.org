// @flow
import NextLink from 'next/link';
import { spacing, font } from '../../../utils/classnames';
import ReactGA from 'react-ga';

export type TagProps = {|
  text: string,
  url?: string
|}

export type Props = {|
  tags: TagProps[]
|}

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

  const className =
    `plain-link flex font-white bg-black rounded-diagonal
    ${url ? 'bg-hover-green transition-bg' : ''}
    ${spacing({s: 1}, {padding: ['top', 'bottom']})}
    ${spacing({s: 2}, {padding: ['left', 'right']})}`;

  return (
    <li onClick={trackTagClick} className={`tags__tag ${font({s: 'HNL5', m: 'WB7'})} ${spacing({s: 2}, {margin: ['right', 'bottom']})}`}
      data-track-event={JSON.stringify({
        category: 'component',
        action: 'tag:click',
        label: `text:${text}${url ? `, url:${url}` : ''}`
      })}>
      {url &&
        <NextLink href={url}>
          <a className={className}>{text}</a>
        </NextLink>
      }
      {!url && <div className={className}>{text}</div>}
    </li>
  );
};

export default Tags;
