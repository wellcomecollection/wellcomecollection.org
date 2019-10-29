// @flow
import { useState } from 'react';
import styled from 'styled-components';
import { font, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

const RatingContainer = styled(Space).attrs(props => ({
  className: font('hnl', 3),
  h: { size: 'm', properties: ['margin-bottom'] },
}))`
  overflow: hidden;
  margin-left: -0.3em;
`;

const RateThisButton = styled.button.attrs(props => ({
  className: classNames({
    'plain-button': true,
    'flex-inline flex--v-center': true,
    [font('hnl', 5)]: true,
  }),
}))`
  padding: 0;
  outline: none;
  cursor: pointer;
  .rate-this-text {
    text-decoration: underline;
  }
  :focus .rate-this-text,
  :hover .rate-this-text {
    text-decoration: none;
  }
`;

const RatingButtons = styled.span.attrs(props => ({
  className: 'flex-inline flex--v-center',
}))`
  overflow: hidden;
`;

const RatingButton = styled.button.attrs(props => ({
  className: classNames({
    'plain-button': true,
    'flex-inline flex--v-center': true,
    [font('hnl', 3)]: true,
  }),
}))`
  outline: none;
  width: 1.6em;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  transition: margin-left 400ms;
  margin-left: ${props => (props.show ? 0 : '-1.6em')};
  transition-delay: ${props => props.index * 100}ms;
`;

const Star = styled.span.attrs(props => ({
  className: classNames({
    'plain-button': true,
    [font('hnl', 3)]: true,
  }),
}))`
  padding: 0 0.3em;
  &::before {
    transition: color 400ms;
    color: ${props => props.theme.colors[props.color]};
    content: '★';
  }
`;

const RatingText = styled.span.attrs(props => ({
  className: font('hnl', 5),
}))`
  transition: opacity 400ms 400ms;
  opacity: ${props => (props.show ? 1 : 0)};
  color: ${props =>
    props.default ? props.theme.colors.pewter : props.theme.colors.purple};
`;

type Props = {|
  ratings: {
    value: number,
    text: string,
  }[],
  clickHandler: number => void,
|};

const Rating = ({ ratings, clickHandler }: Props) => {
  const [showRating, setShowRating] = useState(false);
  const [rated, setRated] = useState(false);
  const [ratingText, setRatingText] = useState();
  const [hoveredValue, setHoveredValue] = useState(0);
  const defaultText = 'Tap on a start to rate';

  function enter(value) {
    const rating = ratings.find(rating => rating.value === value);
    if (!rated) {
      setHoveredValue(value);
      setRatingText(rating ? rating.text : defaultText);
    }
  }
  function leave() {
    if (!rated) {
      setHoveredValue(0);
      setRatingText(null);
    }
  }
  return (
    <RatingContainer>
      {!showRating && (
        <RateThisButton onClick={() => setShowRating(!showRating)}>
          <Star aria-hidden="true" color="purple" />
          <span className="rate-this-text">Relevant?</span>
        </RateThisButton>
      )}
      <RatingButtons show={showRating}>
        {ratings.map((rating, i) => (
          <RatingButton
            show={showRating}
            key={rating.value}
            index={i}
            disabled={rated || !showRating}
            onFocus={() => enter(rating.value)}
            onMouseEnter={() => enter(rating.value)}
            onBlur={() => leave()}
            onMouseLeave={() => leave()}
            onClick={() => {
              clickHandler(rating.value);
              setRated(true);
              enter(rating.value);
            }}
          >
            <Star
              aria-hidden="true"
              color={rating.value <= hoveredValue ? 'yellow' : 'pumice'}
            />
            <span>{rating.text || 'Tap a start to rate'}</span>
          </RatingButton>
        ))}
        <RatingText default={!ratingText} show={showRating}>
          <Space as="span" h={{ size: 's', properties: ['margin-left'] }}>
            {ratingText || defaultText}
          </Space>
        </RatingText>
      </RatingButtons>
    </RatingContainer>
  );
};

export default Rating;
