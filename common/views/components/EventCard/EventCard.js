// @flow
import type {Element} from 'react';
import Labels from '../Labels/Labels';
import {default as ImageType} from '../Image/Image';
import ContentCard from '../ContentCard/ContentCard';

type Props = {|
  url: string,
  title: string,
  promoType: string,
  description: ?string,
  urlOverride: ?string,
  Tags: ?Element<typeof Labels>,
  Image: ?Element<typeof ImageType>
|}

const BaseSearchResult = ({
  url,
  title,
  promoType,
  description,
  urlOverride,
  Tags,
  Image
}: Props) => {
  return <ContentCard
    url={url}
    title={title}
    promoType={'EventPromo'}
    description={description}
    urlOverride={urlOverride}
    Tags={Tags}
    Image={Image}
  />;
};

export default BaseSearchResult;
