import Space from '@weco/common/views/components/styled/Space';
import { classNames } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { HTMLString, PrismicLink } from '../../../services/prismic/types';
import ButtonOutlinedLink from '@weco/common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';
import { parseLink } from '@weco/common/services/prismic/parsers';

type Props = {
  heading: string;
  text: HTMLString;
  linkText: string | null;
  link: PrismicLink | null;
};

const InfoBlock = ({ title, text, linkText, link }) => (
  <Space
    h={{ size: 'l', properties: ['padding-left', 'padding-right'] }}
    className={classNames({
      'border-color-yellow': true,
    })}
    style={{ borderLeftWidth: '16px', borderLeftStyle: 'solid' }}
  >
    <h2 className="h2">{title}</h2>
    <div className="spaced-text body-text">
      <PrismicHtmlBlock html={text} />
    </div>
    {link && (
      <Space v={{ size: 'l', properties: ['margin-top'] }}>
        <ButtonOutlinedLink link={parseLink(link)} text={linkText} />
      </Space>
    )}
  </Space>
);

export default InfoBlock;
