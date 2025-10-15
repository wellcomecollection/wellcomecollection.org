import {
  Dispatch,
  FunctionComponent,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import Typed from 'typed.js';

import { search } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Button, { ButtonTypes } from '@weco/common/views/components/Buttons';
import TextInput from '@weco/common/views/components/TextInput';
import { themeValues } from '@weco/common/views/themes/config';
import { visuallyHiddenStyles } from '@weco/common/views/themes/utility-classes';

const Container = styled.div`
  display: flex;
  align-items: flex-end;
`;

const Typewriter = styled.div.attrs({
  className: font('intr', 3),
  'aria-hidden': 'true',
})`
  position: absolute;
  pointer-events: none;
  bottom: 18px;
  left: 20px;
  z-index: 1;
  color: ${props => props.theme.color('neutral.600')};
  width: calc(100% - 32px);
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;

  ${props => props.theme.media('medium')`
    bottom: 22px;
  `}

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const SearchInputWrapper = styled.div`
  flex: 1 1 auto;

  position: relative;
  font-size: 20px;

  input {
    border: none;
    height: 58px;

    ${props => props.theme.media('medium')`
      height: 68px;
    `}
  }

  .search-query {
    height: ${props => 10 * props.theme.spacingUnit}px;
  }

  &:has(input:not(:placeholder-shown)),
  &:focus-within {
    ${Typewriter} {
      display: none;
    }
  }
`;

const SearchButtonWrapper = styled.div`
  button {
    height: 63px;

    ${props => props.theme.media('medium')`
      height: 73px;
    `}

    span:not(:first-child) {
      ${props =>
        props.theme.mediaBetween(
          'small',
          'medium'
        )(`
        ${visuallyHiddenStyles};
      `)}
    }

    span .icon {
      ${props =>
        props.theme.mediaBetween(
          'small',
          'medium'
        )(`
        width: 34px;
        height: 34px;
        `)}
    }

    &:focus {
      position: relative;
      z-index: 1;
    }

    &:focus-visible {
      border-color: transparent;
    }
  }
`;

export type Props = {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
  form: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  location: ValidLocations;
};

export type ValidLocations = 'header' | 'search' | 'page';

const SearchBar: FunctionComponent<Props> = ({
  inputValue,
  setInputValue,
  placeholder,
  form,
  inputRef,
  location,
}) => {
  const defaultInputRef = useRef<HTMLInputElement>(null);
  const typewriterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const wasOutOfViewport = useRef(false);

  const shuffledStrings = useRef<string[]>([]);

  if (shuffledStrings.current.length === 0) {
    const strings = [
      'Florence Nightingale letters',
      'Cookery and medical recipe book',
      'Medical officer of health 1938',
      'Magic',
      'David Beales archives',
      'Chinese medicine',
      'India',
      'Manuscripts',
      'Oil paintings',
      'Vaccines',
      'Easter',
    ];

    const shuffled = [...strings];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    shuffledStrings.current = shuffled;
  }

  // Track visibility of SearchBar in the viewport
  useEffect(() => {
    if (!containerRef.current) return;

    let reentryTimeout: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            // Element has left the viewport
            wasOutOfViewport.current = true;
            clearTimeout(reentryTimeout);
          } else if (wasOutOfViewport.current && entry.isIntersecting) {
            // Element has re-entered the viewport after being out
            // Wait 1 second before triggering the animation
            reentryTimeout = setTimeout(() => {
              wasOutOfViewport.current = false;
              setAnimationTrigger(prev => prev + 1);
            }, 1000);
          }
        });
      },
      { threshold: 1.0 }
    );

    observer.observe(containerRef.current);

    return () => {
      clearTimeout(reentryTimeout);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typewriterRef.current) {
      // Get the next string from the shuffled array
      // This ensures no repeats and random order per page load
      const selectedString =
        shuffledStrings.current[
          animationTrigger % shuffledStrings.current.length
        ];

      const element = typewriterRef.current;
      const isFirstAnimation = animationTrigger === 0;

      // Reset opacity before starting animation
      element.style.opacity = '1';
      element.style.transition = '';

      let typed: Typed;
      let initTimeout: NodeJS.Timeout;

      const initTyped = () => {
        typed = new Typed(element, {
          strings: [selectedString],
          startDelay: 1000,
          typeSpeed: 50,
          shuffle: false,
          loop: false,
          showCursor: false,
        });
      };

      if (isFirstAnimation) {
        // First animation: start immediately with its own startDelay
        initTyped();
      } else {
        // Subsequent animations: wait 1 second before initialising Typed
        initTimeout = setTimeout(initTyped, 1000);
      }

      return () => {
        clearTimeout(initTimeout);
        if (typed) {
          typed.destroy();
        }
      };
    }
  }, [animationTrigger]);

  return (
    <Container className="is-hidden-print" ref={containerRef}>
      <SearchInputWrapper>
        <Typewriter ref={typewriterRef} />
        <TextInput
          id={`${location}-searchbar`}
          label={placeholder}
          name="query"
          type="search"
          value={inputValue}
          setValue={setInputValue}
          ref={inputRef || defaultInputRef}
          form={form}
          hasClearButton
          isNewSearchBar={true}
          placeholder=" " // This empty placeholder is required for the :placeholder-shown CSS selector to work
        />
      </SearchInputWrapper>
      <SearchButtonWrapper>
        <Button
          variant="ButtonSolid"
          text="Search"
          type={ButtonTypes.submit}
          form={form}
          colors={themeValues.buttonColors.greenGreenWhite}
          icon={search}
          isNewSearchBar={true}
        />
      </SearchButtonWrapper>
    </Container>
  );
};

export default SearchBar;
