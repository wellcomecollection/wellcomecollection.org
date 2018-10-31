// @flow
import {Children, Fragment, createContext} from 'react';
import Contributors from '../Contributors/Contributors';
import Layout8 from '../Layout8/Layout8';
import SeriesNavigation from '../SeriesNavigation/SeriesNavigation';
import PageHeader from '../PageHeader/PageHeader';
import Outro from '../Outro/Outro';
import {classNames} from '../../../utils/classnames';
import type {Node, Element, ElementProps} from 'react';
import type Body from '../Body/Body';
import SpacingSection from '../SpacingSection/SpacingSection';
import SpacingComponent from '../SpacingComponent/SpacingComponent';

export const PageBackgroundContext = createContext('white');

// TODO: use Element<typeof Component>
type Props = {|
  id: string,
  isCreamy?: boolean,
  Header: Element<typeof PageHeader>,
  Body: Body,
  // This is used for content type specific components e.g. InfoBox
  children?: ?Node,
  contributorProps?: ElementProps<typeof Contributors>,
  Siblings?: Element<typeof SeriesNavigation>[],
  outroProps?: ?ElementProps<typeof Outro>
|}

const BasePage = ({
  id,
  isCreamy = false,
  Header,
  Body,
  children,
  contributorProps,
  Siblings = [],
  outroProps
}: Props) => {
  return (
    <PageBackgroundContext.Provider value={isCreamy ? 'cream' : 'white'}>
      <article data-wio-id={id}>
        <SpacingSection>{Header}</SpacingSection>
        <div className={classNames({
          'bg-cream': isCreamy
        })}>
          <SpacingSection>
            <div className='basic-page'>
              <Fragment>{Body}</Fragment>
            </div>
          </SpacingSection>

          {children &&
            <SpacingSection>
              {Children.map(children, (child, i) => (
                <Fragment>
                  {child &&
                    <SpacingComponent>
                      <Layout8>
                        {child}
                      </Layout8>
                    </SpacingComponent>
                  }
                </Fragment>
              ))}
            </SpacingSection>
          }

          {contributorProps && contributorProps.contributors.length > 0 &&
            <SpacingSection>
              <Layout8>
                <Contributors {...contributorProps} />
              </Layout8>
            </SpacingSection>
          }

          {Siblings.length > 0 &&
            <SpacingSection>
              {Children.map(Siblings, (child, i) => (
                <Fragment>
                  {child &&
                    <SpacingComponent>
                      <Layout8>
                        {child}
                      </Layout8>
                    </SpacingComponent>
                  }
                </Fragment>
              ))}
            </SpacingSection>
          }

          {outroProps &&
            <SpacingSection>
              <Layout8>
                <SpacingSection>
                  <Outro {...outroProps} />
                </SpacingSection>
              </Layout8>
            </SpacingSection>
          }
        </div>
      </article>
    </PageBackgroundContext.Provider>
  );
};

export default BasePage;
