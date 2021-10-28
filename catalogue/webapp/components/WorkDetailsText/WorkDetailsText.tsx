import WorkDetailsProperty from '../WorkDetailsProperty/WorkDetailsProperty';
import { FC } from 'react';

type Props = {
  title?: string;
  inlineHeading?: boolean;
  noSpacing?: boolean;
  text: string[];
};

const WorkDetailsText: FC<Props> = ({
  title,
  inlineHeading = false,
  noSpacing = false,
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
          return <div key={i} dangerouslySetInnerHTML={{ __html: para }} />;
        })}
      </div>
    </WorkDetailsProperty>
  );
};

export default WorkDetailsText;
