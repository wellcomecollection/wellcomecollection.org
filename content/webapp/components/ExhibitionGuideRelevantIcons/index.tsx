import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import Icon from '@weco/common/views/components/Icon/Icon';
import {
  audioDescribed,
  britishSignLanguage,
  speechToText,
} from '@weco/common/icons';
import Space from '@weco/common/views/components/styled/Space';
import { ExhibitionGuideType } from '@weco/content/types/exhibition-guides';

const RelevantGuideIcons = ({ types }: { types: ExhibitionGuideType[] }) => {
  // The captions icon will be on every Guide moving forward
  // We're ordering icons alphabetically
  const sortedTypes = [
    ...new Set([...types, 'captions-and-transcripts'].sort()),
  ];

  return (
    <>
      {sortedTypes.map((type, i) => {
        const getIcon = () => {
          switch (type) {
            case 'bsl':
              return britishSignLanguage;
            case 'audio-without-descriptions':
              return audioDescribed;
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
                $h={{ size: 's', properties: ['margin-left'] }}
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
    </>
  );
};

export default RelevantGuideIcons;
