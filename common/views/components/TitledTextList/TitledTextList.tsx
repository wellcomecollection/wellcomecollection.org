import { FunctionComponent } from 'react';
import { HTMLString } from '../../../services/prismic/types';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import LabelsList from '../LabelsList/LabelsList';
import Space from '../styled/Space';
import { classNames, font } from '../../../../common/utils/classnames';
import styled from 'styled-components';
import { LabelField } from '../../../model/label-field';

const HeadingLink = styled.a.attrs({
  className: classNames({
    [font('hnb', 4)]: true,
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
    text?: HTMLString;
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
