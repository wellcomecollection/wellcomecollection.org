// @flow

// Generic component to test using JSX with nunjucks
import cssGridClasses from '../../../filters/css-grid-classes';

type Props = {|
  toWhat: string
|}

const JsxTestComponent = ({toWhat}: Props) => {
  return (
    <div className='css-grid__container'>
      <div className='css-grid'>
        <div className={cssGridClasses({s: 12, m: 12, l: 12, xl: 12})}>
          Hello {toWhat}
        </div>
      </div>
    </div>
  );
};

export default JsxTestComponent;
