import { FunctionComponent } from 'react';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import LabelsList from '@weco/common/views/components/LabelsList/LabelsList';
import Space from '@weco/common/views/components/styled/Space';
import { classNames, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import { LabelField } from '@weco/common/model/label-field';
import * as prismicT from '@prismicio/types';

const HeadingLink = styled.a.attrs({
  className: classNames({
    [font('intb', 4)]: true,
  }),
})`
  cursor: pointer;
  text-decoration: underline;
  color: ${props => props.theme.color('green')};
`;

const TextContainer = styled.div`
  *:last-child {
    margin-bottom: ${props => props.theme.spacingUnit}px;
  }
`;

export type Props = {
  items: {
    title?: string;
    link?: string;
    text?: prismicT.RichTextField;
    label?: LabelField;
  }[];
};

const TitledTextList: FunctionComponent<Props> = ({ items }: Props) => {
  return (
    <ul className="plain-list no-padding">
      {items.map((item, i) => {
        return (
          <Space
            v={{ size: 'l', properties: ['margin-bottom'] }}
            as="li"
            key={i}
          >
            <h3 className="no-margin">
              <HeadingLink href={item.link}>{item.title}</HeadingLink>
            </h3>
            {item.text && (
              <TextContainer>
                <PrismicHtmlBlock key={i} html={item.text} />
              </TextContainer>
            )}
            {item?.label?.title && (
              <LabelsList
                labels={[{ text: item.label.title }]}
                defaultLabelColor="cream"
              />
            )}
          </Space>
        );
      })}
    </ul>
  );
};
export default TitledTextList;
