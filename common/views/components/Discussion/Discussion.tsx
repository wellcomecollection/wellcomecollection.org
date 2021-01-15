import { FunctionComponent } from 'react';
import { HTMLString } from '../../../services/prismic/types';
// import { font } from '../../../utils/classnames';
// import Space from '../styled/Space';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';

type Props = {
  discussion: {
    speaker: string | null;
    text: HTMLString;
  }[];
};
// TODO speaker optional?
const Discussion: FunctionComponent<Props> = ({ discussion }: Props) => {
  const textWithSpeakerAdded = discussion.map(section => {
    const speaker = `${section.speaker}:`;
    return section.text.map((text, i) => {
      if (i === 0) {
        return {
          type: text.type,
          text: `${speaker} ${text.text}`,
          spans: [
            {
              start: 0,
              end: speaker.length,
              type: 'strong',
            },
            ...text.spans,
          ],
        };
      } else {
        return text;
      }
    });
  });

  return (
    <>
      {textWithSpeakerAdded.map((section, i) => (
        <>
          <PrismicHtmlBlock key={i} html={section} />
        </>
      ))}
    </>
  );
};
export default Discussion;
