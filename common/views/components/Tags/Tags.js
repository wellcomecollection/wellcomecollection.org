// @flow
import type {NextLinkType} from '../../../model/next-link-type';
import NextLink from 'next/link';
import ReactGA from 'react-ga';
import { spacing, font } from '../../../utils/classnames';

export type TagProps = {|
  text: string,
  link?: NextLinkType
|}

export type Props = {|
  tags: TagProps[]
|}

const Tags = ({ tags }: Props) => {
  return (
    <div className='tags'>
      <ul className='tags__list plain-list no-margin no-padding flex flex--wrap'>
        {tags.map(({ text, link }) => (
          <Tag key={text} text={text} link={link} />
        ))}
      </ul>
    </div>
  );
};

const Tag = ({text, link}: TagProps) => {
  function trackTagClick() {
    ReactGA.event({
      category: 'component',
      action: 'Tag:click',
      label: `text:${text}`
    });
  }

  const className =
    `plain-link flex font-white bg-black rounded-diagonal
    ${link ? 'bg-hover-green transition-bg' : ''}
    ${spacing({s: 1}, {padding: ['top', 'bottom']})}
    ${spacing({s: 2}, {padding: ['left', 'right']})}`;

  return (
    <li
      onClick={trackTagClick}
      className={`tags__tag ${font({s: 'HNL5', m: 'WB7'})} ${spacing({s: 2}, {margin: ['right', 'bottom']})}`}>
      {link &&
        <NextLink href={link.href} as={link.as}>
          <a className={className}>{text}</a>
        </NextLink>
      }
      {!link && <div className={className}>{text}</div>}
    </li>
  );
};

export default Tags;
