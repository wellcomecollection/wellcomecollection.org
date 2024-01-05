import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Button from '@weco/common/views/components/Buttons';
import { dasherize } from '@weco/common/utils/grammar';
import * as prismic from '@prismicio/client';
import { themeValues } from '@weco/common/views/themes/config';
import { font } from '@weco/common/utils/classnames';

const Wrapper = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
})`
  border-left: 16px solid ${props => props.theme.color('yellow')};
`;

export type Props = {
  title: string;
  text: prismic.RichTextField;
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
      <h2 id={dasherize(title)} className={font('wb', 3)}>
        {title}
      </h2>
      <div className="spaced-text body-text">
        <PrismicHtmlBlock html={text} />
      </div>
      {link && linkText && (
        <Space $v={{ size: 'l', properties: ['margin-top'] }}>
          <Button
            variant="ButtonSolidLink"
            colors={themeValues.buttonColors.greenTransparentGreen}
            link={link}
            text={linkText}
          />
        </Space>
      )}
    </Wrapper>
  );
};

export default InfoBlock;
