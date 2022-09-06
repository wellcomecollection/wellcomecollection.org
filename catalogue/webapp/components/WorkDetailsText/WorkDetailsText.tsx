import WorkDetailsProperty from '../WorkDetailsProperty/WorkDetailsProperty';
import { FunctionComponent, ReactElement } from 'react';

type BaseProps = {
  title?: string;
  inlineHeading?: boolean;
  noSpacing?: boolean;
};

type TextProps = BaseProps & {
  text: string[];
};

type HtmlProps = BaseProps & {
  html: string[];
};

type ReactProps = BaseProps & {
  contents: ReactElement;
};

type Props = TextProps | HtmlProps | ReactProps;

const WorkDetailsText: FunctionComponent<Props> = props => {
  const { title, inlineHeading, noSpacing } = props;

  return (
    <WorkDetailsProperty
      title={title}
      inlineHeading={inlineHeading}
      noSpacing={noSpacing}
    >
      <div className="spaced-text">
        {'contents' in props && props.contents}
        {'text' in props &&
          props.text.map((para, i) => <div key={i}>{para}</div>)}
        {'html' in props &&
          props.html.map((para, i) => (
            <div key={i} dangerouslySetInnerHTML={{ __html: para }} />
          ))}
      </div>
    </WorkDetailsProperty>
  );
};

export default WorkDetailsText;
