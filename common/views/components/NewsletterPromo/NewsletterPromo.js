// @flow
import Button from '../Buttons/Button/Button';
import { grid, spacing, font, classNames } from '../../../utils/classnames';
import styled from 'styled-components';

const RepeatingLs = styled.div`
  position: relative;
  height: 100%;
  background: repeating-linear-gradient(
    -45deg,
    hotpink,
    hotpink 10px,
    ${props => props.theme.colors.brown} 10px,
    ${props => props.theme.colors.brown} 50px
  );

  &:before {
    position: absolute;
    content: '';
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: repeating-linear-gradient(
      45deg,
      ${props => props.theme.colors.brown},
      ${props => props.theme.colors.brown} 20px,
      transparent 10px,
      transparent 60px
    );
  }
`;

const NewsletterPromo = () => (
  <div className="row">
    <div className="container">
      <div
        className={classNames({
          [spacing(
            { s: 4 },
            { padding: ['top', 'right', 'bottom', 'left'] }
          )]: true,
        })}
      >
        <div
          className={classNames({
            'grid bg-brown': true,
          })}
        >
          <div
            className={classNames({
              [grid({ s: 12, m: 6, l: 6, xl: 6 })]: true,
              [spacing({ s: 1 }, { padding: ['top', 'left', 'right'] })]: true,
              [spacing({ s: 2 }, { padding: ['bottom'] })]: true,
            })}
          >
            <p
              className={classNames({
                [font({ s: 'HNL4' })]: true,
                [spacing({ s: 1 }, { margin: ['bottom'] })]: true,
                'font-white': true,
              })}
            >
              Be the first to know about our upcoming exhibitions, events and
              other activities, with extra options for youth, schools and access
              events.
            </p>
            <h2
              className={classNames({
                'h2 font-white': true,
              })}
            >
              Stay connected with email updates from Wellcome Collection
            </h2>
          </div>
          <div
            className={classNames({
              [grid({ s: 12, m: 6, l: 4, shiftL: 2, xl: 4, shiftXl: 2 })]: true,
              [spacing(
                { s: 2 },
                { padding: ['top', 'right', 'bottom', 'left'] }
              )]: true,
            })}
          >
            <RepeatingLs>
              <Button
                type="secondary"
                extraClasses="btn--primary"
                url="/newsletter"
                text="Sign up"
              />
            </RepeatingLs>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NewsletterPromo;
