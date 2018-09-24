// @flow
import {Fragment} from 'react';
import Contributors from '../Contributors/Contributors';
import {spacing} from '../../../utils/classnames';
import type {Node, ElementProps} from 'react';
import type BaseHeader from '../BaseHeader/BaseHeader';
import type Body from '../Body/Body';
import Layout8 from '../Layout8/Layout8';

// TODO: use Element<typeof Component>
type Props = {|
  id: string,
  Header: BaseHeader,
  Body: Body,
  contributorProps?: ElementProps<typeof Contributors>,
  children?: ?Node
|}

const BasePage = ({
  id,
  Header,
  Body,
  contributorProps,
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
          {contributorProps && contributorProps.contributors.length > 0 &&
            <div className={`${spacing({s: 4}, {margin: ['bottom']})}`}>
              <Contributors {...contributorProps} />
            </div>
          }
        </Layout8>
      }
    </article>
  );
};

export default BasePage;
