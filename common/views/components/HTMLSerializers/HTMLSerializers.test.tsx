/* eslint-disable @typescript-eslint/no-explicit-any */
import * as prismic from '@prismicio/client';
import { createElement } from 'react';

import { dropCapSerializer } from './index';

describe('HTMLSerializers', () => {
  describe('dropCapSerializer', () => {
    const mockKey = 'test-key';
    const mockElement = {
      type: prismic.RichTextNodeType.paragraph,
      text: '',
    } as prismic.RTAnyNode;
    const mockContent = '';
    const paragraphType = prismic.RichTextNodeType.paragraph;

    describe('getFirstStringChild behavior', () => {
      it('should handle a direct string child', () => {
        const children = ['Hello world'] as any;
        const result = dropCapSerializer(
          paragraphType,
          mockElement,
          mockContent,
          children,
          mockKey
        );

        expect(result).toBeDefined();
        // result.props.children[0] is an array [cappedFirstLetter, restOfString]
        // result.props.children[0][0] is the span with drop-cap class
        expect(result.props.children[0][0].props.children).toBe('H');
      });

      it('should handle a React element with string children', () => {
        const elementWithString = createElement('span', {}, 'Test content');
        const children = [elementWithString];

        const result = dropCapSerializer(
          paragraphType,
          mockElement,
          mockContent,
          children,
          mockKey
        );

        expect(result).toBeDefined();
        expect(result.props.children[0][0].props.children).toBe('T');
      });

      it('should return a regular paragraph when first child is not a string or element with string children', () => {
        const elementWithoutString = createElement('span', {}, null);
        const children = [elementWithoutString];

        const result = dropCapSerializer(
          paragraphType,
          mockElement,
          mockContent,
          children,
          mockKey
        );

        expect(result).toBeDefined();
        // Should return regular paragraph without drop cap
        expect(result.props.className).toBeUndefined();
      });

      it('should handle undefined children', () => {
        const children = [undefined];

        const result = dropCapSerializer(
          paragraphType,
          mockElement,
          mockContent,
          children,
          mockKey
        );

        expect(result).toBeDefined();
        // Should return regular paragraph without drop cap
        expect(result.props.className).toBeUndefined();
      });

      it('should handle nested React elements', () => {
        const nestedElement = createElement(
          'strong',
          {},
          createElement('span', {}, 'Nested text')
        );
        const children = [nestedElement];

        const result = dropCapSerializer(
          paragraphType,
          mockElement,
          mockContent,
          children,
          mockKey
        );

        expect(result).toBeDefined();
        // First direct child of the strong element is the span, not a string
        // So should return regular paragraph
        expect(result.props.className).toBeUndefined();
      });

      it('should handle empty string', () => {
        const children = [''] as any;

        const result = dropCapSerializer(
          paragraphType,
          mockElement,
          mockContent,
          children,
          mockKey
        );

        expect(result).toBeDefined();
        // Empty string means no first character, should return regular paragraph
        expect(result.props.className).toBeUndefined();
      });

      it('should handle numeric children', () => {
        const children = [42] as any;

        const result = dropCapSerializer(
          paragraphType,
          mockElement,
          mockContent,
          children,
          mockKey
        );

        expect(result).toBeDefined();
        // Number is not a string, should return regular paragraph
        expect(result.props.className).toBeUndefined();
      });

      it('should handle element with multiple string children', () => {
        const elementWithMultipleStrings = createElement(
          'span',
          {},
          'First',
          'Second'
        );
        const children = [elementWithMultipleStrings];

        const result = dropCapSerializer(
          paragraphType,
          mockElement,
          mockContent,
          children,
          mockKey
        );

        expect(result).toBeDefined();
        // Should use first string child ('First')
        expect(result.props.children[0][0].props.children).toBe('F');
      });
    });

    describe('drop cap styling', () => {
      it('should apply drop cap to first letter', () => {
        const children = ['Hello world'] as any;

        const result = dropCapSerializer(
          paragraphType,
          mockElement,
          mockContent,
          children,
          mockKey
        );

        expect(result.props.children[0][0].props.className).toBe('drop-cap');
        expect(result.props.children[0][0].props.children).toBe('H');
      });

      it('should preserve remaining text after drop cap', () => {
        const children = ['Hello world'] as any;

        const result = dropCapSerializer(
          paragraphType,
          mockElement,
          mockContent,
          children,
          mockKey
        );

        // The first child is an array [cappedFirstLetter, restOfString]
        expect(result.props.children[0]).toHaveLength(2);
        // The rest of the string after the first letter
        expect(result.props.children[0][1]).toBe('ello world');
      });
    });
  });
});
