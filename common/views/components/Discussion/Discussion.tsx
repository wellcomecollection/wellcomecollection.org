import { FunctionComponent } from 'react';
import { HTMLString } from '../../../services/prismic/types';
import { Person } from '../../../model/people';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';

type Props = {
  title: string | null;
  discussion: {
    speaker: Person | null;
    text: HTMLString | null;
  }[];
};

const Discussion: FunctionComponent<Props> = ({ title, discussion }: Props) => {
  const textWithSpeakerNameAdded = discussion.map(section => {
    const speaker = `${section?.speaker?.name}:`;
    return (
      section.text &&
      section.text.map((text, i) => {
        if (i === 0 && section.speaker) {
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
      })
    );
  });

  return (
    <>
      {title && <h2 className="h2">{title}</h2>}
      {textWithSpeakerNameAdded.map((section, i) => (
        <PrismicHtmlBlock key={i} html={section} />
      ))}
    </>
  );
};
export default Discussion;
