import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import { dasherize } from '@weco/common/utils/grammar';
import * as prismic from '@prismicio/client';
import { font } from '@weco/common/utils/classnames';

const Wrapper = styled(Space).attrs({
  $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
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
    <Wrapper>
      <h2 id={dasherize(title)} className={font('wb', 3)}>
        {title}
      </h2>
      <div className="spaced-text body-text">
        <PrismicHtmlBlock html={text} />
      </div>
    </Wrapper>
  );
};

export default InfoBlock;
