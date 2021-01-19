import { FunctionComponent } from 'react';
import { HTMLString } from '../../../services/prismic/types';
import { Person } from '../../../model/people';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';

type Props = {
  title: string | null;
  discussion: {
    contributor: Person | null;
    text: HTMLString | null;
  }[];
};

const Discussion: FunctionComponent<Props> = ({ title, discussion }: Props) => {
  const textWithContributorNameAdded = discussion.map(section => {
    const contributor = `${section?.contributor?.name}:`;
    return (
      section.text &&
      section.text.map((text, i) => {
        if (i === 0 && section.contributor) {
          return {
            type: text.type,
            text: `${contributor} ${text.text}`,
            spans: [
              {
                start: 0,
                end: contributor.length,
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
      {textWithContributorNameAdded.map((section, i) => (
        <PrismicHtmlBlock key={i} html={section} />
      ))}
    </>
  );
};
export default Discussion;
