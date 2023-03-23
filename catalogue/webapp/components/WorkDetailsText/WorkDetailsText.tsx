import WorkDetailsProperty, {
  Props as BaseProps,
} from '../WorkDetailsProperty/WorkDetailsProperty';
import { FunctionComponent, ReactElement } from 'react';
import { isString } from '@weco/common/utils/array';
import styled from 'styled-components';

const LimitWidth = styled.div.attrs({
  className: 'spaced-text',
})`
  max-width: 45em;
`;

type TextProps = BaseProps & {
  text: string | string[];
};

// We don't strictly need the `allowDangerousRawHtml` here, but it's to
// remind downstream callers that we'll be rendering unescaped HTML from
// the catalogue API, which might be dangerous.
//
// cf https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml
type HtmlProps = BaseProps & {
  html: string | string[];
  allowDangerousRawHtml: true;
};

type ReactProps = BaseProps & {
  contents: ReactElement;
};

type Props = TextProps | HtmlProps | ReactProps;

const WorkDetailsText: FunctionComponent<Props> = props => {
  return (
    <WorkDetailsProperty {...props}>
      <LimitWidth>
        {'contents' in props && props.contents}
        {'text' in props &&
          (isString(props.text) ? (
            <div key="0">{props.text}</div>
          ) : (
            props.text.map((para, i) => <div key={i}>{para}</div>)
          ))}
        {'html' in props &&
          (isString(props.html) ? (
            <div key="0" dangerouslySetInnerHTML={{ __html: props.html }} />
          ) : (
            props.html.map((para, i) => (
              <div key={i} dangerouslySetInnerHTML={{ __html: para }} />
            ))
          ))}
      </LimitWidth>
    </WorkDetailsProperty>
  );
};

export default WorkDetailsText;
