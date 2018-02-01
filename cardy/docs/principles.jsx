// @flow

import BodyBlock from './BodyBlock';
import Icon from '../../common/views/components/Icon/Icon';
import {spacing} from '../../common/utils/classnames';
import PageDescription from '../../common/views/components/PageDescription/PageDescription';

type Props = {|
  pageSections: Array<{|name: string, url: string, content?: string|}>,
  supportedBrowsers: Array<{|type: string, supportLevel: string|}>
|}

const DocsPrinciples = ({pageSections, supportedBrowsers}: Props) => (
  <div>
    <PageDescription
        title='Principles'
        lead={true}
        meta={{value: `This document outlines core concepts that will inform the development of the Wellcome Collection website.`}} />
    <BodyBlock>
      <h2>Index</h2>
      <a name='index'></a>
      <ul>
        {pageSections.map(pageSection => (
          <li key={pageSection.url}><a href={`#${pageSection.url}`}>{pageSection.name}</a></li>
        ))}
      </ul>

      {pageSections.map(pageSection => (
        <div key={pageSection.url} className={spacing({s: 8}, {margin: ['top']})}>
          <h2>{pageSection.name}</h2>
          <a name={pageSection.url}></a>

          {pageSection.url === 'support'
            ? <div>
                <p><strong>We will manually test the site on the following browsers<sup>*</sup></strong></p>
                <table>
                  <thead>
                    <tr>
                      <td>Browser</td>
                      <td>Support Level</td>
                    </tr>
                  </thead>
                  <tbody>
                    {supportedBrowsers.map(browser => (
                      <tr key={browser.type}>
                        <td>{browser.type}</td>
                        <td>{browser.supportLevel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p>Support is divided into 2 categories, <strong>Basic</strong> and <strong>Full</strong>:</p>

                <dl>
                  <dt><p><strong>Basic</strong></p></dt>
                  <dd><p>All content is accessible, but more advanced user interactions will be missing and there may be minor display issues</p></dd>
                  <dt><p><strong>Full</strong></p></dt>
                  <dd><p>All content is accessible and the site is visually and functionally complete</p></dd>
                </dl>

                <p>The most popular browsers are added to the list, until they make up approximately 95% of traffic. The browser versions of evergreen browsers, i.e. those that automatically update themselves silently without prompting the user, are combined and the latest stable version and the version immediately before that will be tested.</p>
                <p>Opera Mini (in Extreme mode) is also included, as this provides an easy way to test the core experience. In extreme mode, Opera Mini ignores some CSS, doesn&apos;t load web fonts, has a low level of Javascript support and an arbitrary Javascript execution timeout.</p>
              </div>
            : <div dangerouslySetInnerHTML={{__html: pageSection.content}} />
          }
          <sup><Icon name='arrow' extraClasses='icon--270' /></sup><a href='#index'>Back to top</a>
        </div>
      ))}
    </BodyBlock>
  </div>
);

export default DocsPrinciples;
