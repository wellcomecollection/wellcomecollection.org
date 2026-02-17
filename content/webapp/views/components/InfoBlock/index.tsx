import * as prismic from '@prismicio/client';
import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { dasherize } from '@weco/common/utils/grammar';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';

const Wrapper = styled(Space).attrs({
  $h: { size: 'md', properties: ['padding-left', 'padding-right'] },
})`
  border-left: 16px solid ${props => props.theme.color('yellow')};
`;

export type Props = {
  title: string;
  text: prismic.RichTextField;
};

const InfoBlock: FunctionComponent<Props> = ({
  title,
  text,
}: Props): ReactElement<Props> => {
  return (
    <Wrapper data-component="info-block">
      <h2 id={dasherize(title)} className={font('brand-bold', 1)}>
        {title}
      </h2>
      <div className="spaced-text body-text">
        <PrismicHtmlBlock html={text} />
      </div>
    </Wrapper>
  );
};

export default InfoBlock;
