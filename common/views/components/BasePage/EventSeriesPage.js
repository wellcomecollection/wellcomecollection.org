// @flow
import BasePage from './BasePage';
import BaseHeader from '../BaseHeader/BaseHeader';
import Body from '../Body/Body';
import WobblyBackground from '../BaseHeader/WobblyBackground';
import {parseDescription} from '../../../services/prismic/parsers';
import {UiImage} from '../Images/Images';
import type {EventSeries} from '../../../model/event-series';
import type {UiEvent} from '../../../model/events';
import type {Tasl} from '../../../model/tasl';

type Props = {|
  events: UiEvent[],
  series: EventSeries,
  showContributorsTitle: boolean
|}

const Page = ({
  events,
  series
}: Props) => {
  const image = series.promo && series.promo.image;
  const tasl: ?Tasl = image && {
    title: image.title,
    author: image.author,
    sourceName: image.source && image.source.name,
    sourceLink: image.source && image.source.link,
    license: image.license,
    copyrightHolder: image.copyright && image.copyright.holder,
    copyrightLink: image.copyright && image.copyright.link
  };
  const FeaturedMedia = image &&
    <UiImage
      tasl={tasl}
      {...image} alt={image.alt} />;
  const Header = (<BaseHeader
    title={series.title}
    Background={<WobblyBackground />}
    TagBar={null}
    DateInfo={null}
    InfoBar={null}
    Description={null}
    FeaturedMedia={FeaturedMedia}
  />);

  const body = series.description ? [{
    type: 'text',
    weight: 'default',
    value: parseDescription(series.description)
  }] : [];

  return (
    <BasePage
      id={series.id}
      Header={Header}
      Body={<Body body={body} />}
    >
    </BasePage>
  );
};

export default Page;
