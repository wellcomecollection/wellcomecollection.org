import * as prismic from '@prismicio/client';

import {
  audioDescribedSquare,
  bslLiveInterpretationSquare,
  IconSvg,
  inductionLoop,
  speechToText,
} from '@weco/common/icons';
import { isPast } from '@weco/common/utils/dates';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { Interpretation } from '@weco/content/types/events';

export const showTicketSalesStart = (dateTime?: Date) => {
  return dateTime && !isPast(dateTime);
};

export const getDescription = ({
  interpretationType,
  extraInformation,
  isPrimary,
}: Interpretation): prismic.RichTextField => {
  const baseDescription: prismic.RichTextField | undefined = isPrimary
    ? interpretationType.primaryDescription
    : interpretationType.description;

  const extraDescription: prismic.RichTextField | undefined =
    extraInformation || [];

  return [...(baseDescription || []), ...extraDescription].filter(
    isNotUndefined
  ) as [prismic.RTNode, ...prismic.RTNode[]];
};

export const eventInterpretationIcons: Record<string, IconSvg> = {
  britishSignLanguageOnline: bslLiveInterpretationSquare,
  britishSignLanguage: bslLiveInterpretationSquare,
  speechToText,
  inductionLoop,
  audioDescribedSquare,
};
