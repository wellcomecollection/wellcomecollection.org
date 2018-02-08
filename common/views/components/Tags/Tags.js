import { spacing, font } from '../../../utils/classnames';

type Props = {|
  tags: Array<{|text: string, url?: string|}>
|}

function buildTag(tag) {
  const HTMLTag = tag.url ? 'a' : 'div';

  return (
    <HTMLTag
      href={tag.url}
      className={`plain-link flex font-white bg-black ${tag.url ? 'bg-hover-green transition-bg' : ''} ${spacing({s: 1}, {padding: ['top', 'bottom']})} ${spacing({s: 2}, {padding: ['left', 'right']})} rounded-diagonal`}>
      {tag.text}
    </HTMLTag>
  );
}
const Tags = ({ tags }: Props) => (
  <div className="tags">
    <ul className="tags__list plain-list no-margin no-padding flex flex--wrap">
      {tags.map(tag => (
        <li key={tag.name} className={`tags__tag ${font({s: 'HNL5', m: 'WB7'})} ${spacing({s: 2}, {margin: ['right', 'bottom']})}`}
          data-track-event={`{"category": "component", "action": "tag:click", "label": "text:${tag.prefix}${tag.prefix ? ' ' : ''}${tag.text}, url:${tag.url}"}`}>
          {buildTag(tag)}
        </li>
      ))}
    </ul>
  </div>
);

export default Tags;
