import * as prismic from '@prismicio/client';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import LabelsList from '@weco/common/views/components/LabelsList';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import { LabelField } from '@weco/content/model/label-field';

const HeadingLink = styled.a.attrs({
  className: font('intb', 0),
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
  <List data-component="titled-text-list">
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
