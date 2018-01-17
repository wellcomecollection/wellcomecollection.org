// Generic component to test using JSX with nunjucks
import React from 'react';
import cssGridClasses from '../../../filters/css-grid-classes';

export default function JsxTestComponent(props) {
  return (
    <div className="css-grid__container">
      <div className="css-grid">
        <div className={cssGridClasses({s: 12, m: 12, l: 12, xl: 12})}>
          Hello {props.toWhat}
        </div>
      </div>
    </div>
  );
}
