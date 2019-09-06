import { grid, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';
import LabelsList from '../LabelsList/LabelsList';

const FeaturedCardRight = styled.div`
  transform: translateY(-60px);

  ${props => props.theme.media.large`
    margin-left: -30px;
    transform: translate(0);
  `}
`;

const FeaturedCardCopy = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'bg-charcoal font-white': true,
  }),
})`
  height: 100%;
`;

function FeaturedCard() {
  return (
    <div className="featured-card grid flex-end">
      <div
        className={classNames({
          'featured-card__image': true,
          [grid({ s: 12, m: 12, l: 7, xl: 7 })]: true,
        })}
      >
        <img
          className="image block"
          src="http://placehold.it/800x450"
          alt="placeholder"
        />
      </div>
      <div
        className={classNames({
          'featured-card__copy flex': true,
          [grid({ s: 11, m: 10, l: 5, xl: 5 })]: true,
        })}
      >
        <FeaturedCardRight>
          <LabelsList labels={[{ url: null, text: 'Gallery tour' }]} />
          <FeaturedCardCopy>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Perferendis aspernatur itaque quia unde consectetur distinctio
              similique debitis.
            </p>
          </FeaturedCardCopy>
        </FeaturedCardRight>
      </div>
    </div>
  );
}

export default FeaturedCard;
