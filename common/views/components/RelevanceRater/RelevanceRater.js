// @flow
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
import {
  trackRelevanceRating,
  RelevanceRatingEventNames,
} from '../Tracker/Tracker';
import VerticalSpace from '../styled/VerticalSpace';

const RelevanceRaterStyle = styled.div.attrs(props => ({
  className: classNames({
    flex: true,
    [font('hnl', 4)]: true,
  }),
}))`
  height: 100%;
`;

const RelevanceRating = styled(VerticalSpace).attrs(props => ({
  className: classNames({
    'plain-button': true,
    'padding-left-12 padding-right-12': true,
  }),
}))`
  width: 25%;
  cursor: pointer;
  border: 1px solid ${props => props.theme.colors.smoke};
  border-left-width: ${props => (props.index === 0 ? 1 : 0)};
  border-bottom-width: 0;
`;

type Props = {|
  position: number,
  id: string,
  query: string,
  page: number,
  workType: ?(string[]),
  _queryType: ?string,
|};

function createEvent(rating) {
  return {
    event: RelevanceRatingEventNames.RateResultRelevance,
    data: rating,
  };
}

const RelevanceRater = ({
  id,
  position,
  query,
  page,
  workType,
  _queryType,
}: Props) => {
  return (
    <div>
      <RelevanceRaterStyle>
        <RelevanceRating
          as="button"
          size="s"
          properties={['padding-top', 'padding-bottom']}
          index={0}
          onClick={() =>
            trackRelevanceRating(
              createEvent({
                id,
                position,
                rating: 1,
                query,
                page,
                workType,
                _queryType,
              })
            )
          }
        >
          No apparent relationship to search term
        </RelevanceRating>
        <RelevanceRating
          as="button"
          size="s"
          properties={['padding-top', 'padding-bottom']}
          index={1}
          onClick={() =>
            trackRelevanceRating(
              createEvent({
                id,
                position,
                rating: 2,
                query,
                page,
                workType,
                _queryType,
              })
            )
          }
        >
          Reasonable to be retrieved but should not be this highly ranked
        </RelevanceRating>
        <RelevanceRating
          as="button"
          size="s"
          properties={['padding-top', 'padding-bottom']}
          index={2}
          onClick={() =>
            trackRelevanceRating(
              createEvent({
                id,
                position,
                rating: 3,
                query,
                page,
                workType,
                _queryType,
              })
            )
          }
        >
          Not perfect but reasonable to be highly ranked
        </RelevanceRating>
        <RelevanceRating
          as="button"
          size="s"
          properties={['padding-top', 'padding-bottom']}
          index={3}
          onClick={() =>
            trackRelevanceRating(
              createEvent({
                id,
                position,
                rating: 4,
                query,
                page,
                workType,
                _queryType,
              })
            )
          }
        >
          Completely relevant to be at this rank
        </RelevanceRating>
      </RelevanceRaterStyle>
    </div>
  );
};

export default RelevanceRater;
