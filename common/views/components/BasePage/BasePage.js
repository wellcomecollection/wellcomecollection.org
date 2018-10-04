// @flow
import {Children, Fragment, createContext} from 'react';
import Contributors from '../Contributors/Contributors';
import Layout8 from '../Layout8/Layout8';
import SeriesNavigation from '../SeriesNavigation/SeriesNavigation';
import {spacing, classNames} from '../../../utils/classnames';
import type {Node, Element, ElementProps} from 'react';
import type BaseHeader from '../BaseHeader/BaseHeader';
import type Body from '../Body/Body';

export const PageBackgroundContext = createContext('white');

// TODO: use Element<typeof Component>
type Props = {|
  id: string,
  isCreamy?: boolean,
  Header: BaseHeader,
  Body: Body,
  // This is used for content type specific components e.g. InfoBox
  children?: ?Node,
  contributorProps?: ElementProps<typeof Contributors>,
  Siblings?: Element<typeof SeriesNavigation>[]
|}

const BasePage = ({
  id,
  isCreamy = false,
  Header,
  Body,
  children,
  contributorProps,
  Siblings = []
}: Props) => {
  return (
    <PageBackgroundContext.Provider value={isCreamy ? 'cream' : 'white'}>
      <article data-wio-id={id}>
        <Fragment>{Header}</Fragment>
        <div className={classNames({
          'bg-cream': isCreamy,
          [spacing({s: 6}, {padding: ['bottom']})]: true
        })}>
          <div className='basic-page'>
            <Fragment>{Body}</Fragment>
          </div>

          {children &&
            <Layout8>
              {children}
            </Layout8>
          }

          {contributorProps && contributorProps.contributors.length > 0 &&
            <Layout8>
              <div className={`${spacing({s: 6}, {margin: ['top']})}`}>
                <Contributors {...contributorProps} />
              </div>
            </Layout8>
          }

          {Siblings.length > 0 &&
            <Layout8>
              {Children.map(Siblings, (child, i) => (
                <div className={`${spacing({s: 6}, {margin: ['top']})}`}>
                  {Siblings}
                </div>
              ))}
            </Layout8>
          }
        </div>
      </article>
    </PageBackgroundContext.Provider>
  );
};

export default BasePage;
