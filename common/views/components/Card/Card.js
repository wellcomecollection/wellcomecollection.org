// @flow
import type { Card as CardType } from '@weco/common/model/card';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import { UiImage } from '../Images/Images';
import LabelsList from '../LabelsList/LabelsList';
import Space from '../styled/Space';
import styled from 'styled-components';

type Props = {|
  item: CardType,
|};

export const CardOuter = styled.a.attrs(props => ({
  className:
    'plain-link promo-link rounded-corners overflow-hidden flex-ie-block flex--column',
}))`
  background: ${props => props.theme.colors.cream};

  .bg-cream & {
    background: ${props => props.theme.colors.white};
  }

  .bg-charcoal & {
    background: ${props => props.theme.colors.transparent};
    color: ${props => props.theme.colors.white};
  }
`;

export const CardBody = styled(Space).attrs(props => ({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  className: 'flex flex--column flex-1 flex--h-space-between',
}))`
  ${props =>
    props.theme.makeSpacePropertyValues(
      'm',
      ['padding-left', 'padding-right'],
      false
    )}

  .bg-charcoal & {
    padding-left: 0;
    padding-right: 0;
  }
`;

const Card = ({ item }: Props) => {
  return (
    <CardOuter
      href={item.link}
      onClick={() => {
        trackEvent({
          category: 'Card',
          action: 'follow link',
          label: `${item.title || ''}`,
        });
      }}
    >
      <div className="relative">
        {item.image && item.image.crops && item.image.crops['16:9'] && (
          <UiImage
            {...item.image.crops['16:9']}
            sizesQueries="(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(33.24vw - 43px), calc(100vw - 36px)"
            showTasl={false}
          />
        )}
        {item.format && (
          <div style={{ position: 'absolute', bottom: 0 }}>
            <LabelsList labels={[{ url: null, text: item.format.title }]} />
          </div>
        )}
      </div>

      <CardBody>
        <div>
          {item.title && (
            <Space
              v={{
                size: 's',
                properties: ['margin-bottom'],
              }}
              as="h2"
              className={classNames({
                'promo-link__title': true,
                [font('wb', 3)]: true,
              })}
            >
              {item.title}
            </Space>
          )}

          {item.description && (
            <p className={`${font('hnl', 5)} no-padding no-margin`}>
              {item.description}
            </p>
          )}
        </div>
      </CardBody>
    </CardOuter>
  );
};

export default Card;
