import { FunctionComponent } from 'react';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import { LabelField } from '@weco/content/model/label-field';
import * as prismic from '@prismicio/client';

const HeadingLink = styled.a.attrs({
  className: font('intb', 4),
})`
  text-decoration: underline;
  color: ${props => props.theme.color('accent.green')};
`;

const TextContainer = styled.div`
  *:last-child {
    margin-bottom: ${props => props.theme.spacingUnit}px;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const HeadingLinkWrapper = styled.h3`
  margin: 0;
`;

export type Props = {
  items: {
    title?: string;
    link?: string;
    text?: prismic.RichTextField;
    label?: LabelField;
  }[];
};

const TitledTextList: FunctionComponent<Props> = ({ items }) => (
  <List>
    {items.map((item, i) => (
      <Space $v={{ size: 'l', properties: ['margin-bottom'] }} as="li" key={i}>
        <HeadingLinkWrapper>
          <HeadingLink href={item.link}>{item.title}</HeadingLink>
        </HeadingLinkWrapper>
        {item.text && (
          <TextContainer>
            <PrismicHtmlBlock key={i} html={item.text} />
          </TextContainer>
        )}
        {item.label?.title && (
          <LabelsList
            labels={[{ text: item.label.title }]}
            defaultLabelColor="warmNeutral.300"
          />
        )}
      </Space>
    ))}
  </List>
);
export default TitledTextList;
