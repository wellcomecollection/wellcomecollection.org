// @flow
import {Fragment} from 'react';
import type {Node} from 'react';
import type BaseHeader from '../BaseHeader/BaseHeader';
import type Body from '../Body/Body';
import Layout8 from '../Layout8/Layout8';

type Props = {|
  id: string,
  Header: BaseHeader,
  Body: Body,

  children?: ?Node
|}

const BasePage = ({
  id,
  Header,
  Body,
  children
}: Props) => {
  return (
    <article data-wio-id={id}>
      <Fragment>{Header}</Fragment>
      <div className='basic-page'>
        <Fragment>{Body}</Fragment>
      </div>

      {children &&
        <Layout8>
          {children}
        </Layout8>
      }
    </article>
  );
};

export default BasePage;
