import styled from 'styled-components';

import {
  audioDescribedSquare,
  bslSquare,
  speechToText,
} from '@weco/common/icons';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { ExhibitionGuideType } from '@weco/content/types/exhibition-guides';

// Gets rid of unwanted vertical spacing
const IconsWrapper = styled.div`
  line-height: 1;
  font-size: 0;
`;

const RelevantGuideIcons = ({ types }: { types: ExhibitionGuideType[] }) => {
  // The captions icon will be on every Guide moving forward
  // We're ordering icons alphabetically
  const sortedTypes = [
    ...new Set([...types, 'captions-and-transcripts'].sort()),
  ];

  return (
    <IconsWrapper data-component="relevant-guide-icons">
      {sortedTypes.map((type, i) => {
        const getIcon = () => {
          switch (type) {
            case 'bsl':
              return bslSquare;
            case 'audio-without-descriptions':
              return audioDescribedSquare;
            case 'captions-and-transcripts':
              return speechToText;
          }
        };

        const icon = getIcon();

        return icon ? (
          <ConditionalWrapper
            key={type}
            condition={i > 0}
            wrapper={children => (
              <Space
                $h={{ size: 'xs', properties: ['margin-left'] }}
                style={{ display: 'inline' }}
              >
                {children}
              </Space>
            )}
          >
            <Icon icon={icon} sizeOverride="height: 32px; width: 32px;" />
          </ConditionalWrapper>
        ) : undefined;
      })}
    </IconsWrapper>
  );
};

export default RelevantGuideIcons;
