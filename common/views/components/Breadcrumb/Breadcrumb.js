// @flow
import type {Link} from '../../../model/link';
import {font, classNames, spacing} from '../../../utils/classnames';

type Props = {|
  items: {|
    ...Link,
    prefix?: string
  |}[]
|}

const Breadcrumb = ({ items }: Props) => (
  <div className='plain-text flex'>
    {items.map(({text, url, prefix}, i) => {
      const HtmlTag = prefix ? 'b' : 'span';
      return (
        <HtmlTag
          key={text}
          className={classNames({
            [font({s: 'HNL4'})]: true,
            'border-left-width-1 border-color-black': i !== 0,
            [spacing({s: 2}, {padding: ['right']})]: true,
            [spacing({s: 2}, {padding: ['left']})]: i !== 0
          })}
          style={{lineHeight: 1}}>
          {prefix}{' '}
          <a className={classNames({
            [font({s: 'HNM4'})]: Boolean(prefix)
          })} href={url} style={{lineHeight: 1}}>{text}</a>
        </HtmlTag>
      );
    })}
  </div>
);
export default Breadcrumb;
