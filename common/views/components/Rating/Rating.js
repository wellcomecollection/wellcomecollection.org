// @flow
import { useState } from 'react';
import styled from 'styled-components';
import { font, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

const RatingContainer = styled.div.attrs(props => ({
  className: font('hnl', 5),
}))`
  color: ${props => props.theme.colors.purple};
`;
const RatingButton = styled.button.attrs(props => ({
  className: classNames({
    'plain-button': true,
    [font('hnl', 3)]: true,
  }),
}))`
  width: 1em;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')}
  &::before {
    transition: color 400ms;
    color: ${props =>
      props.active ? props.theme.colors.yellow : props.theme.colors.pumice};
    content: '★';
  }
`;

type Props = {|
  ratings: {
    value: number,
    text: string,
  }[],
|};

const Rating = ({ ratings }: Props) => {
  const [rated, setRated] = useState(false);
  const [ratingText, setRatingText] = useState();
  const [hoveredValue, setHoveredValue] = useState(0);

  function enter(value) {
    const rating = ratings.find(rating => rating.value === value);
    if (!rated) {
      setHoveredValue(value);
      setRatingText(rating ? rating.text : '');
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
      {/* <button>Rate this</button> */}
      <div>
        {ratings.map(rating => (
          <Space
            key={rating.value}
            as="span"
            h={{ size: 'm', properties: ['margin-left'] }}
          >
            <RatingButton
              disabled={rated}
              active={rating.value <= hoveredValue ? true : null}
              onFocus={() => enter(rating.value)}
              onMouseEnter={() => enter(rating.value)}
              onBlur={() => leave()}
              onMouseLeave={() => leave()}
              onClick={() => {
                setRated(true);
                enter(rating.value);
              }}
            >
              {rating.text}
            </RatingButton>
          </Space>
        ))}
        <Space as="span" h={{ size: 's', properties: ['margin-left'] }}>
          {ratingText}
        </Space>
      </div>
    </RatingContainer>
  );
};

export default Rating;
// TODO
// better function names
// rate this functionality
// plug in
// write better story for cardigan
