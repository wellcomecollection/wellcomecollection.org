// @flow
import {Children, createElement} from 'react';
import ReactMarkdown from 'react-markdown';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import {spacing, grid} from '@weco/common/utils/classnames';
// $FlowFixMe
import PROGRESS_NOTES from './PROGRESS_NOTES.md';
import { webpageLd } from '@weco/common/utils/json-ld';

function flatten(text, child) {
  return typeof child === 'string'
    ? text + child
    : Children.toArray(child.props.children).reduce(flatten, text);
}

// Taken from https://github.com/rexxars/react-markdown/issues/69
function HeadingRenderer(props) {
  var children = Children.toArray(props.children);
  var text = children.reduce(flatten, '');
  var slug = text.toLowerCase().replace(/\W/g, '-');
  return createElement('h' + props.level, {id: slug}, props.children);
}

const title = 'How we\'re improving search';
const description = 'We are working to make a more welcoming space where you' +
                    'can discover more of what Wellcome Collection has to offer.';

const ProgressPage = () => (
  <PageLayout
    title={title}
    description={description}
    url={{pathname: '/works/progress'}}
    openGraphType={'website'}
    jsonLd={webpageLd({url: '/works/progress'})}
    siteSection={'works'}
    imageUrl={null}
    imageAltText={null}
  >
    <div className={`row ${spacing({s: 5}, {padding: ['top']})}`}>
      <div className='container'>
        <div className='grid'>
          <div className={`${grid({s: 12, m: 11, l: 8, xl: 7})}`}>
            <div className='body-text'>
              <ReactMarkdown
                renderers={{heading: HeadingRenderer}}
                source={PROGRESS_NOTES} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageLayout>
);

export default ProgressPage;
