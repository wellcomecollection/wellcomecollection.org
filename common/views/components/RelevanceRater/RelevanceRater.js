// @flow
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import {
  trackRelevanceRating,
  RelevanceRatingEventNames,
} from '../Tracker/Tracker';

const RelevanceRaterStyle = styled.div.attrs(props => ({
  className: classNames({
    flex: true,
  }),
}))``;

const RelevanceRating = styled.button.attrs(props => {})``;

type Props = {|
  position: number,
  id: string,
  query: string,
  page: number,
  workType: ?(string[]),
|};

function createEvent(rating) {
  return {
    event: RelevanceRatingEventNames.RateResultRelevance,
    data: rating,
  };
}

const RelevanceRater = ({ id, position, query, page, workType }: Props) => {
  return (
    <RelevanceRaterStyle>
      <RelevanceRating
        onClick={() =>
          trackRelevanceRating(
            createEvent({ id, position, rating: 1, query, page, workType })
          )
        }
      >
        1
      </RelevanceRating>
      <RelevanceRating
        onClick={() =>
          trackRelevanceRating(
            createEvent({ id, position, rating: 2, query, page, workType })
          )
        }
      >
        2
      </RelevanceRating>
      <RelevanceRating
        onClick={() =>
          trackRelevanceRating(
            createEvent({ id, position, rating: 3, query, page, workType })
          )
        }
      >
        3
      </RelevanceRating>
      <RelevanceRating
        onClick={() =>
          trackRelevanceRating(
            createEvent({ id, position, rating: 4, query, page, workType })
          )
        }
      >
        4
      </RelevanceRating>
    </RelevanceRaterStyle>
  );
};

export default RelevanceRater;
