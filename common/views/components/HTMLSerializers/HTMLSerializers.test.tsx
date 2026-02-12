/* eslint-disable @typescript-eslint/no-explicit-any */
import * as prismic from '@prismicio/client';
import { render } from '@testing-library/react';
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

        const { container } = render(<>{result}</>);
        const dropCapElement =
          container.querySelector<HTMLElement>('.drop-cap');

        expect(dropCapElement).toBeInTheDocument();
        expect(dropCapElement).toHaveTextContent('H');
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

        const { container } = render(<>{result}</>);
        const dropCapElement =
          container.querySelector<HTMLElement>('.drop-cap');

        expect(dropCapElement).toBeInTheDocument();
        expect(dropCapElement).toHaveTextContent('T');
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

        const { container } = render(<>{result}</>);
        const dropCapElement =
          container.querySelector<HTMLElement>('.drop-cap');

        expect(dropCapElement).not.toBeInTheDocument();
      });

      it('should handle undefined children', () => {
        const children = [undefined] as any;

        const result = dropCapSerializer(
          paragraphType,
          mockElement,
          mockContent,
          children,
          mockKey
        );

        const { container } = render(<>{result}</>);
        const dropCapElement =
          container.querySelector<HTMLElement>('.drop-cap');

        expect(dropCapElement).not.toBeInTheDocument();
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

        const { container } = render(<>{result}</>);
        const dropCapElement =
          container.querySelector<HTMLElement>('.drop-cap');

        expect(dropCapElement).not.toBeInTheDocument();
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

        const { container } = render(<>{result}</>);
        const dropCapElement =
          container.querySelector<HTMLElement>('.drop-cap');

        expect(dropCapElement).not.toBeInTheDocument();
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

        const { container } = render(<>{result}</>);
        const dropCapElement =
          container.querySelector<HTMLElement>('.drop-cap');

        expect(dropCapElement).not.toBeInTheDocument();
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

        const { container } = render(<>{result}</>);
        const dropCapElement =
          container.querySelector<HTMLElement>('.drop-cap');

        expect(dropCapElement).toBeInTheDocument();
        expect(dropCapElement).toHaveTextContent('F');
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

        const { container } = render(<>{result}</>);
        const dropCapElement =
          container.querySelector<HTMLElement>('.drop-cap');

        expect(dropCapElement).toBeInTheDocument();
        expect(dropCapElement).toHaveTextContent('H');
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

        const { container } = render(<>{result}</>);
        const paragraph = container.querySelector<HTMLElement>('p');

        expect(paragraph).toBeInTheDocument();
        expect(paragraph).toHaveTextContent('Hello world');
        expect(
          container.querySelector<HTMLElement>('.drop-cap')
        ).toHaveTextContent('H');
      });
    });
  });
});
