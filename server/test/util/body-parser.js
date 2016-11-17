import test from 'ava';
import exploreApiResp from '../mocks/explore-api.json';
import {
    getFragment,
    explodeIntoBodyParts,
    removeEmptyTextNodes
} from '../../util/body-parser';


test.beforeEach(t => {
    const fragment = getFragment(exploreApiResp.articleBody);
    t.context.fragment = fragment;
});

test('removeEmptyTextNodes', t => {
    const parsedBody = explodeIntoBodyParts(t.context.fragment);
    t.true(Array.isArray(parsedBody));
});

test('explodeIntoBodyParts', t => {
    const uncleanNodes = t.context.fragment.childNodes;
    const cleanNodes = removeEmptyTextNodes(t.context.fragment.childNodes);

    t.is(uncleanNodes.length, 18);
    t.is(cleanNodes.length, 9);
});
