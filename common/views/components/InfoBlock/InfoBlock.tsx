import Space from '@weco/common/views/components/styled/Space';
import { classNames } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { HTMLString } from '../../../services/prismic/types';
import ButtonOutlinedLink from '@weco/common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';

type Props = {
  heading: string;
  text: HTMLString;
  linkText: string | null;
  link: any | null; // TODO: use PrismicLink type from #5636 and parseUrl
};

const InfoBlock = ({ heading, text, linkText, link }) => {
  return (
    <Space
      h={{ size: 'l', properties: ['padding-left', 'padding-right'] }}
      className={classNames({
        'border-color-yellow': true,
      })}
      style={{ borderLeftWidth: '16px', borderLeftStyle: 'solid' }}
    >
      <h2 className="h2">{heading}</h2>
      <div className="spaced-text body-text">
        <PrismicHtmlBlock html={text} />
      </div>
      {link && (
        <Space v={{ size: 'l', properties: ['margin-top'] }}>
          <ButtonOutlinedLink link={link.url} text={linkText} />
        </Space>
      )}
    </Space>
  );
};

export default InfoBlock;
