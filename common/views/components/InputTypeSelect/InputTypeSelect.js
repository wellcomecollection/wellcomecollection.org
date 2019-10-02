// @flow
import { forwardRef, type ComponentType } from 'react';
// import styled from 'styled-components';
import Space, { type SpaceComponentProps } from '../styled/Space';
// import { classNames } from '../../../utils/classnames';

// const StyledInput: ComponentType<SpaceComponentProps> = styled(Space).attrs({
//   className: classNames({}),
// })``;

type Props = {
  label: string,
  // We can also pass inputProps here
};

// $FlowFixMe (forwardRef)
const InputTypeSelect = forwardRef((
  { label, ...inputProps }: Props,
  ref // eslint-disable-line
) => (
  <label>
    <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
      {label}
    </Space>
    <select name="sort">
      <option value="">Relevance</option>
      <option value="production.dates.from">Date</option>
    </select>
  </label>
));
export default InputTypeSelect;

// TODO make generic - pass in option values and text
