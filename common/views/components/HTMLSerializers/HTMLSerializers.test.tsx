import * as prismic from '@prismicio/client';
import { render } from '@testing-library/react';
import { createElement, ReactNode } from 'react';

import { dropCapSerializer, withExternalLinkStripping } from './index';

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
        const children = ['Hello world'] as unknown as ReactNode[];
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
        const children = [undefined] as unknown as ReactNode[];

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
        const children = [''] as unknown as ReactNode[];

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
        const children = [42] as unknown as ReactNode[];

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
        const children = ['Hello world'] as unknown as ReactNode[];

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
        const children = ['Hello world'] as unknown as ReactNode[];

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

  describe('withExternalLinkStripping', () => {
    const hyperlinkType = prismic.RichTextNodeType.hyperlink;
    const mockKey = 'link-key';
    const mockContent = '';
    const children = ['Click here'] as unknown as ReactNode[];
    const serializer = withExternalLinkStripping(dropCapSerializer);

    it('strips external links', () => {
      const element = {
        type: hyperlinkType,
        data: { link_type: 'Web', url: 'https://www.bbc.co.uk/news' },
        text: '',
        start: 0,
        end: 10,
      } as unknown as prismic.RTAnyNode;

      const result = serializer(
        hyperlinkType,
        element,
        mockContent,
        children,
        mockKey
      );

      const { container } = render(<>{result}</>);
      expect(container.querySelector('a')).not.toBeInTheDocument();
      expect(container).toHaveTextContent('Click here');
    });

    it('keeps internal links', () => {
      const element = {
        type: hyperlinkType,
        data: {
          link_type: 'Web',
          url: 'https://wellcomecollection.org/stories',
        },
        text: '',
        start: 0,
        end: 10,
      } as unknown as prismic.RTAnyNode;

      const result = serializer(
        hyperlinkType,
        element,
        mockContent,
        children,
        mockKey
      );

      const { container } = render(<>{result}</>);
      const link = container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        'href',
        'https://wellcomecollection.org/stories'
      );
    });

    it('preserves the wrapped serializer for non-hyperlink nodes', () => {
      const result = serializer(
        prismic.RichTextNodeType.paragraph,
        {
          type: prismic.RichTextNodeType.paragraph,
          text: 'Hello world',
          spans: [],
        } as unknown as prismic.RTAnyNode,
        'Hello world',
        ['Hello world'] as unknown as ReactNode[],
        mockKey
      );

      const { container } = render(<>{result}</>);
      expect(container.querySelector('p')).toBeInTheDocument();
      expect(container).toHaveTextContent('Hello world');
    });

    it('strips protocol-relative URLs as external', () => {
      const element = {
        type: hyperlinkType,
        data: { link_type: 'Web', url: '//example.com/page' },
        text: '',
        start: 0,
        end: 10,
      } as unknown as prismic.RTAnyNode;

      const result = serializer(
        hyperlinkType,
        element,
        mockContent,
        children,
        mockKey
      );

      const { container } = render(<>{result}</>);
      expect(container.querySelector('a')).not.toBeInTheDocument();
      expect(container).toHaveTextContent('Click here');
    });
  });
});
