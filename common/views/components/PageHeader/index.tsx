import { ComponentProps, FunctionComponent, ReactElement } from 'react';

import HeaderBackground from '@weco/common/views/components/HeaderBackground';
import LabelsList from '@weco/common/views/components/LabelsList';
import { Picture } from '@weco/common/views/components/Picture';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import VideoEmbed from '@weco/common/views/components/VideoEmbed';

import LandingPageHeader, {
  Props as LandingPageHeaderProps,
} from './PageHeader.Landing';
import BasicPageHeader, {
  Props as BasicPageHeaderProps,
} from './PagerHeader.Basic';

export type FeaturedMedia =
  | ReactElement<typeof PrismicImage>
  | ReactElement<typeof VideoEmbed>
  | ReactElement<typeof Picture>;

export type BackgroundType = ReactElement<typeof HeaderBackground>;

export const pageGridLayout: SizeMap = {
  s: [12],
  m: [12],
  l: [10],
  xl: [10],
};

function addFreeLabel(labelListProps) {
  const freeLabel = {
    text: 'Free',
    labelColor: 'black',
    textColor: 'white',
  };
  const labels = [freeLabel, ...(labelListProps?.labels ?? [])];
  return { ...(labelListProps ?? {}), labels };
}

type Props = {
  isFree?: boolean;
  labels?: ComponentProps<typeof LabelsList>;
} & (
  | (BasicPageHeaderProps & {
      sectionLevelPage: undefined | false;
    })
  | (LandingPageHeaderProps & {
      sectionLevelPage: true;
    })
);

const PageHeader: FunctionComponent<Props> = ({
  sectionLevelPage,
  isFree = false,
  labels,
  ...rest
}) => {
  const amendedLabels = isFree ? addFreeLabel(labels) : labels;

  if (sectionLevelPage)
    return (
      <LandingPageHeader
        data-component="section-page-header"
        amendedLabels={amendedLabels}
        {...rest}
      />
    );

  return (
    <BasicPageHeader
      data-component="basic-page-header"
      amendedLabels={amendedLabels}
      {...rest}
    />
  );
};

export default PageHeader;
