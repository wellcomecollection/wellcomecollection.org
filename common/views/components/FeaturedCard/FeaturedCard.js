// @flow
import type {Element} from 'react';
import DateRange from '../DateRange/DateRange';
import LabelsList from '../LabelsList/LabelsList';
import {default as ImageType} from '../Image/Image';

type Props = {|
  url: string,
  title: string,
  promoType: string,
  description: ?string,
  urlOverride: ?string,
  extraClasses?: string,
  DateInfo: ?Element<typeof DateRange>,
  Tags: ?Element<typeof LabelsList>,
  Image: ?Element<typeof ImageType>
|}

const CompactCard = ({
  url,
  title,
  promoType,
  description,
  urlOverride,
  extraClasses,
  DateInfo,
  Tags,
  Image
}: Props) => (
  <div>TODO: Make this component</div>
);

export default CompactCard;
