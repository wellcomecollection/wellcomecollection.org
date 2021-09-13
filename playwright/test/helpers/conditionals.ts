import { isMobile } from '../actions/common';

export const describeMobileOnly = isMobile() ? describe : describe.skip;
export const describeDesktopOnly = isMobile() ? describe.skip : describe;
export const testMobileOnly = isMobile() ? test : test.skip;
export const testDesktopOnly = isMobile() ? test.skip : test;
