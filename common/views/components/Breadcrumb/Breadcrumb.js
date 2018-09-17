// @flow
import {font, classNames, spacing} from '../../../utils/classnames';

export type Breadcrumbs = {|
  text: string,
  url?: string,
  prefix?: string
|}[]

type Props = {|
  items: Breadcrumbs
|}

const Breadcrumb = ({ items }: Props) => (
  <div className={classNames({
    'plain-text': true,
    'flex': true,
    [spacing({s: 3, m: 4}, {margin: ['top', 'bottom']})]: true
  })}>
    {items.map(({text, url, prefix}, i) => {
      const BoldOrSpanTag = prefix ? 'b' : 'span';
      const LinkOrSpanTag = url ? 'a' : 'span';
      return (
        <BoldOrSpanTag
          key={text}
          className={classNames({
            [font({s: 'HNL4'})]: true,
            'border-left-width-1 border-color-black': i !== 0,
            [spacing({s: 2}, {padding: ['right']})]: true,
            [spacing({s: 2}, {padding: ['left']})]: i !== 0
          })}
          style={{lineHeight: 1}}>
          {prefix}{' '}
          <LinkOrSpanTag className={classNames({
            [font({s: 'HNM4'})]: Boolean(prefix)
          })} href={url} style={{lineHeight: 1}}>{text}</LinkOrSpanTag>
        </BoldOrSpanTag>
      );
    })}
  </div>
);
export default Breadcrumb;
