// @flow

import { grid, classNames, font } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';
import LabelsList from '../LabelsList/LabelsList';
import { UiImage } from '../Images/Images';
import type { Article } from '../../../model/articles';
import { trackEvent } from '../../../utils/ga';

type Props = {|
  item: Article,
|};

const FeaturedCardWrap = styled.div`
  margin-left: -${props => props.theme.gutter.small}px;
  margin-right: -${props => props.theme.gutter.small}px;

  ${props => props.theme.media.medium`
    margin-left: 0;
    margin-right: 0;
  `}
`;

const FeaturedCardLeft = styled.div.attrs({
  className: classNames({
    [grid({ s: 12, m: 12, l: 7, xl: 7 })]: true,
  }),
})``;

const FeaturedCardRight = styled.div.attrs({
  className: classNames({
    'flex flex--column': true,
  }),
})`
  padding-left: ${props => props.theme.gutter.small}px;
  margin-top: -60px;
  width: 100%;
  height: 100%;
  min-height: 200px;

  ${props => props.theme.media.medium`
    padding-left: 0;
  `}

  ${props => props.theme.media.large`
    margin-left: -${props => props.theme.gutter.large}px;
    margin-top: 0;
  `}
`;

const FeaturedCardCopy = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'bg-charcoal font-white flex-1': true,
  }),
})`
  ${props => props.theme.media.large`
    margin-right: -${props => props.theme.gutter.large}px;
  `}
`;

const FeaturedCard = ({ item }: Props) => {
  return (
    <FeaturedCardWrap>
      <a
        onClick={() => {
          trackEvent({
            category: 'FeaturedCard',
            action: 'follow link',
            label: `${item.id}`,
          });
        }}
        href={(item.promo && item.promo.link) || `/articles/${item.id}`}
        className="grid flex-end promo-link plain-link"
      >
        <FeaturedCardLeft>
          <UiImage {...item.promoImage} showTasl={false} />
        </FeaturedCardLeft>
        <div
          className={classNames({
            flex: true,
            [grid({ s: 12, m: 11, l: 5, xl: 5 })]: true,
          })}
        >
          <FeaturedCardRight>
            {item.labels.length > 0 && <LabelsList labels={item.labels} />}
            <FeaturedCardCopy>
              <Space
                v={{
                  size: 's',
                  properties: ['margin-bottom'],
                }}
                as="h2"
                className={`
                promo-link__title
                ${font('wb', 2)}
              `}
              >
                {item.title}
              </Space>
              <p
                className={classNames({
                  'inline-block no-margin': true,
                  [font('hnl', 5)]: true,
                })}
              >
                {item.promoText}
              </p>
            </FeaturedCardCopy>
          </FeaturedCardRight>
        </div>
        <div
          className={classNames({
            [grid({ s: 12, m: 12, l: 7, xl: 7 })]: true,
          })}
        ></div>
        <div
          style={{ height: '20px' }}
          className={classNames({
            'bg-charcoal is-hidden-s is-hidden-m': true,
            [grid({ s: 12, m: 11, l: 5, xl: 5 })]: true,
          })}
        ></div>
      </a>
    </FeaturedCardWrap>
  );
};

export default FeaturedCard;
