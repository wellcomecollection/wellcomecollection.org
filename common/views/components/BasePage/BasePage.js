// @flow
import {Fragment} from 'react';
import {spacing, grid} from '../../../utils/classnames';
import type {Node} from 'react';
import type BaseHeader from '../BaseHeader/BaseHeader';
import type Body from '../Body/Body';

type Props = {|
  id: string,
  Header: BaseHeader,
  Body: Body,
  children?: ?Node
|}

export const BasePageColumn = ({children}: {| children: Node |}) => (
  <div className={`row ${spacing({s: 8}, {padding: ['bottom']})}`}>
    <div className='container'>
      <div className='grid'>
        <div className={`${grid({s: 12, m: 10, shiftM: 1, l: 8, shiftL: 2, xl: 8, shiftXL: 2})}`}>
          {children}
        </div>
      </div>
    </div>
  </div>
);

const BasePage = ({
  id,
  Header,
  Body,
  children
}: Props) => {
  return (
    <article data-wio-id={id}>
      <Fragment>{Header}</Fragment>
      <BasePageColumn>
        <div className='basic-page'>
          {Body}
        </div>
      </BasePageColumn>

      {children &&
        <BasePageColumn>
          {children}
        </BasePageColumn>
      }
    </article>
  );
};

export default BasePage;
