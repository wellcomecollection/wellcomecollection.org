import { FunctionComponent } from 'react';
import Icon from '../../../../common/views/components/Icon/Icon';
import * as icons from '../../../../common/icons';

export const Icons: FunctionComponent = () => (
  <div>
    {Object.keys(icons).map(key => (
      <div key={key} className="styleguide__icon">
        <Icon name={key} />
        <p className="styleguide__icon__id">{key}</p>
      </div>
    ))}
  </div>
);
