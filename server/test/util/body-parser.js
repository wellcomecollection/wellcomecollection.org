import test from 'ava';
import parse from 'parse5';
import exploreApiResp from '../mocks/explore-api.json';

import {
  getFragment,
  explodeIntoBodyParts,
  removeEmptyTextNodes,
  getImageFromWpNode
} from '../../util/body-parser';

const wpImageNode = parse.parseFragment(`
<div data-shortcode="caption" id="attachment_12033" style="width: 810px" class="wp-caption alignnone">
    <img data-attachment-id="12033" data-permalink="http://blog.wellcomecollection.org/2016/12/22/christmas-part-the-second/v0040154-a-family-sit-around-a-table-eating-their-christmas-meal-and/" data-orig-file="https://wellcomecollection.files.wordpress.com/2016/12/865c27bde0241fe5fc47cfb40826.jpg?w=800&amp;h=521" data-orig-size="800,521" data-comments-opened="1" data-image-meta="{&quot;aperture&quot;:&quot;0&quot;,&quot;credit&quot;:&quot;Wellcome Library, London&quot;,&quot;camera&quot;:&quot;&quot;,&quot;caption&quot;:&quot;V0040154 A family sit around a table eating their Christmas meal and\\nCredit: Wellcome Library, London. Wellcome Images\\nimages@wellcome.ac.uk\\nhttp:\\/\\/wellcomeimages.org\\nA family sit around a table eating their Christmas meal and greet the arrival of the plum pudding which is being carried in on a large tray. Reproduction after Cecil Aldin.\\nBy: Cecil AldinPublished:  - \\n\\nCopyrighted work available under Creative Commons Attribution only licence CC BY 4.0 http:\\/\\/creativecommons.org\\/licenses\\/by\\/4.0\\/&quot;,&quot;created_timestamp&quot;:&quot;0&quot;,&quot;copyright&quot;:&quot;Copyrighted work available under Creative Commons Attribution only licence CC BY 4.0 http:\\/\\/creativecommons.org\\/licenses\\/by\\/4.0\\/&quot;,&quot;focal_length&quot;:&quot;0&quot;,&quot;iso&quot;:&quot;0&quot;,&quot;shutter_speed&quot;:&quot;0&quot;,&quot;title&quot;:&quot;V0040154 A family sit around a table eating their Christmas meal and&quot;,&quot;orientation&quot;:&quot;0&quot;}" data-image-title="V0040154 A family sit around a table eating their Christmas meal and" data-image-description="<p>The typical canon-ball shaped plum pudding pictured as the grand finale of the British Christmas feast.</p>\n" data-medium-file="https://wellcomecollection.files.wordpress.com/2016/12/865c27bde0241fe5fc47cfb40826.jpg?w=800&amp;h=521?w=300" data-large-file="https://wellcomecollection.files.wordpress.com/2016/12/865c27bde0241fe5fc47cfb40826.jpg?w=800&amp;h=521?w=800" class="alignnone size-full
[1] wp-image-12033" src="https://wellcomecollection.files.wordpress.com/2016/12/865c27bde0241fe5fc47cfb40826.jpg?w=800&amp;h=521" alt="The typical canon-ball shaped plum pudding pictured as the grand finale of the British Christmas feast." width="800" height="521" srcset="https://wellcomecollection.files.wordpress.com/2016/12/865c27bde0241fe5fc47cfb40826.jpg 800w, https://wellcomecollection.files.wordpress.com/2016/12/865c27bde0241fe5fc47cfb40826.jpg?w=150&amp;h=98 150w, https://wellcomecollection.files.wordpress.com/2016/12/865c27bde0241fe5fc47cfb40826.jpg?w=300&amp;h=195 300w, https://wellcomecollection.files.wordpress.com/2016/12/865c27bde0241fe5fc47cfb40826.jpg?w=768&amp;h=500 768w" sizes="(max-width: 800px) 100vw, 800px">
    <p class="wp-caption-text">The typical canon-ball shaped plum pudding pictured as the grand finale of the British Christmas feast.</p>
</div>
`.trim()).childNodes[0];

test.beforeEach(t => {
  const fragment = getFragment(exploreApiResp.articleBody);
  t.context.fragment = fragment;
});

test('explodeIntoBodyParts', t => {
  const parsedBody = explodeIntoBodyParts(t.context.fragment.childNodes);
  t.true(Array.isArray(parsedBody));
});

test('removeEmptyTextNodes', t => {
  const uncleanNodes = t.context.fragment.childNodes;
  const cleanNodes = removeEmptyTextNodes(t.context.fragment.childNodes);

  t.is(uncleanNodes.length, 18);
  t.is(cleanNodes.length, 9);
});

test('getImageFromWpNode', t => {
  const i = getImageFromWpNode(wpImageNode);
  t.is(i.width, 800);
  t.is(i.height, 521);
  t.is(
    i.caption,
    'The typical canon-ball shaped plum pudding pictured as the grand finale of the British Christmas feast.'
  );
});
