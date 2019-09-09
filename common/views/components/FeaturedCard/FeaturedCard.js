// @flow

import { type UiImageProps, UiImage } from '../../components/Images/Images';
import { type Label } from '../../../../common/model/labels';
import { type Link } from '../../../../common/model/link';
import NextLink from 'next/link';
import { grid, classNames, font } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';
import LabelsList from '../LabelsList/LabelsList';

import { trackEvent } from '../../../utils/ga';

type Props = {|
  id: string,
  image: ?UiImageProps,
  labels: ?(Label[]),
  title: string,
  text: ?string,
  link: Link,
  background: string,
  color: string,
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

const FeaturedCardCopy = styled(Space).attrs(props => ({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'flex-1': true,
  }),
}))`
  ${props => props.theme.media.large`
    margin-right: -${props => props.theme.gutter.large}px;
  `}
`;

const FeaturedCard = ({
  id,
  image,
  labels,
  title,
  text,
  link,
  color,
  background,
}: Props) => {
  return (
    <div className="container">
      <FeaturedCardWrap>
        <NextLink href={link.url}>
          <a
            onClick={() => {
              trackEvent({
                category: 'FeaturedCard',
                action: 'follow link',
                label: `${id}`,
              });
            }}
            className="grid flex-end promo-link plain-link"
          >
            <FeaturedCardLeft>
              {image && <UiImage {...image} />}
            </FeaturedCardLeft>
            <div
              className={classNames({
                flex: true,
                [grid({ s: 12, m: 11, l: 5, xl: 5 })]: true,
              })}
            >
              <FeaturedCardRight>
                {labels && labels.length > 0 && <LabelsList labels={labels} />}
                <FeaturedCardCopy
                  className={classNames({
                    [`bg-${background} font-${color}`]: true,
                  })}
                >
                  <Space
                    v={{
                      size: 's',
                      properties: ['margin-bottom'],
                    }}
                    as="h2"
                    className={classNames({
                      'promo-link__title': true,
                      [font('wb', 2)]: true,
                    })}
                  >
                    {title}
                  </Space>
                  {text && (
                    <p
                      className={classNames({
                        'inline-block no-margin': true,
                        [font('hnl', 5)]: true,
                      })}
                    >
                      {text}
                    </p>
                  )}
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
                [`bg-${background}`]: true,
                'is-hidden-s is-hidden-m': true,
                [grid({ s: 12, m: 11, l: 5, xl: 5 })]: true,
              })}
            ></div>
          </a>
        </NextLink>
      </FeaturedCardWrap>
    </div>
  );
};

export default FeaturedCard;
