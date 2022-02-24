import Space from '@weco/common/views/components/styled/Space';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { HTMLString } from '../../../services/prismic/types';
import ButtonOutlinedLink from '@weco/common/views/components/ButtonOutlinedLink/ButtonOutlinedLink';
import { dasherize } from '@weco/common/utils/grammar';
import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';

const Wrapper = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
})`
  border-left: 16px solid ${props => props.theme.color('yellow')};
`;

type Props = {
  title: string;
  text: HTMLString;
  linkText: string | null;
  link?: string;
};

const InfoBlock: FunctionComponent<Props> = ({
  title,
  text,
  linkText,
  link,
}: Props): ReactElement<Props> => {
  return (
    <Wrapper>
      <h2 id={dasherize(title)} className="h2">
        {title}
      </h2>
      <div className="spaced-text body-text">
        <PrismicHtmlBlock html={text} />
      </div>
      {link && linkText && (
        <Space v={{ size: 'l', properties: ['margin-top'] }}>
          <ButtonOutlinedLink link={link} text={linkText} />
        </Space>
      )}
    </Wrapper>
  );
};

export default InfoBlock;
