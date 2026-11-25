import styled from 'styled-components';

import MoreLink from '@weco/content/views/components/MoreLink';

const StarPlusStar = styled.div`
  * + * {
    margin-top: 1.55em;
  }
`;

const MiscTemplate = () => (
  <>
    <div>
      <h2>More link</h2>
      <MoreLink name="Full event details" url="#" />
      <div className="spaced-text">
        <div></div>
        <div></div>
      </div>
    </div>
    <StarPlusStar className="spaced-text">
      <div>
        <h3>Usage</h3>
        <p>Used to indicate a link to more content of a similar theme/type.</p>
      </div>
      <div>
        <h2>Body text link</h2>
        <div className="body-text">
          <p style={{ marginBottom: 0 }}>
            There has even been a (failed){' '}
            <a href="https://www.nytimes.com/2015/10/15/us/court-rules-hot-yoga-isnt-entitled-to-copyright.html">
              attempt to copyright a yoga system
            </a>
            .
          </p>
        </div>
        <h3>Usage</h3>
        <p>
          Used in the main body copy. These are animated links which form part
          of the experience language. Uses border-bottom property for underline.
        </p>
      </div>
      <div>
        <h2>Plain text link</h2>
        <div>
          <p className="font-hnr4-s" style={{ marginBottom: 0 }}>
            Here is <a href="#">a link</a> in a block of non body text.
          </p>
        </div>
        <h3>Usage</h3>
        <p>
          Links that appear in blocks of copy that are not body text, should
          follow the same behaviour as the Secondary link (note, font
          family/size is inherited for plain text links). Examples where this
          happens are author descriptions and image captions.
        </p>
      </div>
    </StarPlusStar>
  </>
);
export const misc = MiscTemplate.bind({});

export default {
  title: 'Global/Typography',
};
