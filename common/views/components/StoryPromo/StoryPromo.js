// @flow
import { spacing, font, classNames } from '../../../utils/classnames';
import { getPositionInSeries } from '../../../model/articles';
import { UiImage } from '../Images/Images';
import LabelsList from '../LabelsList/LabelsList';
import PartNumberIndicator from '../PartNumberIndicator/PartNumberIndicator';
import type { Article } from '../../../model/articles';

type Props = {|
  item: Article,
  position: number,
  hidePromoText?: boolean
|}

const EventPromo = ({
  item,
  position,
  hidePromoText = false
}: Props) => {
  const positionInSeries = getPositionInSeries(item);
  return (
    <a data-component='StoryPromo'
      data-component-state={JSON.stringify({ position: position })}
      data-track-event={JSON.stringify({
        category: 'component',
        action: 'StoryPromo:click',
        label: `id : ${item.id}, position : ${position}`}
      )}
      id={item.id}
      href={item.promo && item.promo.link || `/articles/${item.id}`}
      className={classNames({
        'plain-link': true,
        'promo-link': true,
        'bg-cream': true,
        'rounded-corners': true,
        'overflow-hidden': true,
        'flex': true,
        'flex--column': true
      })}>
      <div className='relative'>
        {/* FIXME: Image type tidy */}
        {/* $FlowFixMe */}
        {item.promoImage && <UiImage {...item.promoImage}
          sizesQueries='(min-width: 1420px) 386px, (min-width: 960px) calc(28.64vw - 15px), (min-width: 600px) calc(50vw - 54px), calc(100vw - 36px)'
          showTasl={false} />}

        {item.labels.length > 0 &&
          <div style={{position: 'absolute', bottom: 0}}>
            <LabelsList labels={item.labels} />
          </div>
        }
      </div>

      <div className={`
        flex flex--column flex-1 flex--h-space-between
        ${spacing({s: 2}, {padding: ['top']})}
        ${spacing({s: 2}, {padding: ['left', 'right']})}
        ${spacing({s: 4}, {padding: ['bottom']})}
      `}>
        <div>
          {positionInSeries && <PartNumberIndicator number={positionInSeries} color={item.color} />}
          <h2 className={`
            promo-link__title
            ${font({s: 'WB5'})}
            ${spacing({s: 0}, {margin: ['top']})}
            ${spacing({s: 1}, {margin: ['bottom']})}
          `}>
            {item.title}
          </h2>
          {!hidePromoText &&
            <div className={classNames({
              'inline-block': true,
              [font({s: 'HNL4'})]: true,
              [spacing({s: 1}, {margin: ['bottom']})]: true
            })}>
              {item.promoText}
            </div>
          }
        </div>

        <div>
          {item.series.length > 0 &&
            <div className={spacing({s: 4}, {margin: ['top']})}>
              {item.series.map((series) => (
                <p key={series.title} className={`${font({s: 'HNM5'})} no-margin`}>
                  <span className={font({s: 'HNL5'})}>Part of</span>{' '}{series.title}
                </p>
              ))}
            </div>
          }
        </div>
      </div>
    </a>
  );
};

export default EventPromo;
