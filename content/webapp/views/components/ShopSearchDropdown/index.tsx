import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { ShopSearchSuggestion } from '@weco/content/types/shop';

const DropdownContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  background: ${props => props.theme.color('white')};
  border: 1px solid ${props => props.theme.color('neutral.400')};
  border-top: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const SuggestionLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacingUnit * 2}px;
  padding: ${props => props.theme.spacingUnit * 2}px;
  text-decoration: none;
  color: ${props => props.theme.color('black')};
  border-bottom: 1px solid ${props => props.theme.color('neutral.300')};

  &:last-child {
    border-bottom: none;
  }

  &:hover,
  &:focus {
    background: ${props => props.theme.color('warmNeutral.300')};
  }
`;

const Thumbnail = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;
  background: ${props => props.theme.color('neutral.200')};
`;

const ThumbnailPlaceholder = styled.div`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: ${props => props.theme.color('neutral.200')};
`;

const SuggestionTitle = styled.span.attrs({
  className: font('sans', -1),
})`
  flex: 1;
`;

const SuggestionPrice = styled.span.attrs({
  className: font('sans-bold', -1),
})`
  flex-shrink: 0;
`;

const ViewAllLink = styled.a`
  display: block;
  padding: ${props => props.theme.spacingUnit * 2}px;
  text-align: center;
  text-decoration: none;
  color: ${props => props.theme.color('accent.green')};
  font-weight: bold;

  &:hover,
  &:focus {
    background: ${props => props.theme.color('warmNeutral.300')};
    text-decoration: underline;
  }
`;

function formatPrice(amount: string, currencyCode: string): string {
  const num = parseFloat(amount);
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currencyCode,
  }).format(num);
}

type Props = {
  query: string;
  isVisible: boolean;
  onClose: () => void;
};

const ShopSearchDropdown: FunctionComponent<Props> = ({
  query,
  isVisible,
  onClose,
}) => {
  const [suggestions, setSuggestions] = useState<ShopSearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();
    if (!trimmed || !isVisible) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/shop/search?query=${encodeURIComponent(trimmed)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.results);
        }
      } catch {
        // Silently fail -- the user can still submit the full search
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, isVisible]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isVisible || (!isLoading && suggestions.length === 0)) {
    return null;
  }

  return (
    <DropdownContainer ref={containerRef} data-component="shop-search-dropdown">
      {suggestions.map(suggestion => (
        <SuggestionLink
          key={suggestion.id}
          href={`/shop/${suggestion.handle}`}
          onClick={onClose}
        >
          {suggestion.featuredImage ? (
            <Thumbnail
              src={suggestion.featuredImage.url}
              alt=""
              width={48}
              height={48}
              loading="lazy"
            />
          ) : (
            <ThumbnailPlaceholder />
          )}
          <SuggestionTitle>{suggestion.title}</SuggestionTitle>
          <SuggestionPrice>
            {formatPrice(
              suggestion.price.amount,
              suggestion.price.currencyCode
            )}
          </SuggestionPrice>
        </SuggestionLink>
      ))}
      {query.trim() && (
        <ViewAllLink href={`/shop?query=${encodeURIComponent(query.trim())}`}>
          View all results for &ldquo;{query.trim()}&rdquo;
        </ViewAllLink>
      )}
    </DropdownContainer>
  );
};

export default ShopSearchDropdown;
