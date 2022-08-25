import WorkDetailsProperty from '../WorkDetailsProperty/WorkDetailsProperty';
import { FunctionComponent } from 'react';

type Props = {
  title?: string;
  inlineHeading?: boolean;
  noSpacing?: boolean;
  allowRawHtml: boolean;
  text: string[];
};

const WorkDetailsText: FunctionComponent<Props> = ({
  title,
  inlineHeading = false,
  noSpacing = false,
  allowRawHtml,
  text,
}: Props) => {
  return (
    <WorkDetailsProperty
      title={title}
      inlineHeading={inlineHeading}
      noSpacing={noSpacing}
    >
      <div className="spaced-text">
        {text.map((para, i) => {
          return allowRawHtml ? (
            <div key={i} dangerouslySetInnerHTML={{ __html: para }} />
          ) : (
            <div key={i}>{para}</div>
          );
        })}
      </div>
    </WorkDetailsProperty>
  );
};

export default WorkDetailsText;
