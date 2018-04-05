// @flow

import {font} from '../../../utils/classnames';

type Props = {
  body: HTMLElement
}

const Standfirst = ({body}: Props) => (
  <div className={`standfirst ${font({s: 'HNL3', m: 'HNL2'})}`} dangerouslySetInnerHTML={{__html: body}} />
);

export default Standfirst;
