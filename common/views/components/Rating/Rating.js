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
  margin-left: 0;
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
  color: ${props => props.theme.colors.purple};
`;

type Props = {|
  clickHandler: number => void,
|};

const Rating = ({ clickHandler }: Props) => {
  const [rated, setRated] = useState(false);
  const [ratingText, setRatingText] = useState();
  const [hoveredValue, setHoveredValue] = useState(0);
  const initialText = 'Tap on a star to rate';

  const ratings = [
    { value: 1, text: 'Not relevant to my search' },
    { value: 2, text: 'A bit relevant' },
    { value: 3, text: 'Relevant' },
    { value: 4, text: 'Highly relevant' },
  ];

  function enter(value) {
    const rating = ratings.find(rating => rating.value === value);
    if (!rated) {
      setHoveredValue(value);
      setRatingText(rating ? rating.text : initialText);
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
      <RatingButtons>
        {ratings.map((rating, i) => (
          <RatingButton
            key={rating.value}
            index={i}
            disabled={rated}
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
            <span>{rating.text}</span>
          </RatingButton>
        ))}
        <RatingText default={!ratingText}>
          <Space as="span" h={{ size: 's', properties: ['margin-left'] }}>
            {ratingText || initialText}
          </Space>
        </RatingText>
      </RatingButtons>
    </RatingContainer>
  );
};

export default Rating;
