// @flow
import {Fragment} from 'react';
import {asText} from '../../../services/prismic/parsers';
import type {HTMLString} from '../../../services/prismic/types';

type Props = {|
  title: string,
  level: ?number,
  locationInformation: ?HTMLString
|}
const EventPlace = ({
  title,
  level,
  locationInformation
}: Props) => (
  <Fragment>
    <h2 className='h2'>Where we{`'`}ll be</h2>
    <p>
      Well be in the {title}
      {level ? ` on level ${level}` : ''},
      {asText(locationInformation)}
    </p>
  </Fragment>
);

export default EventPlace;
