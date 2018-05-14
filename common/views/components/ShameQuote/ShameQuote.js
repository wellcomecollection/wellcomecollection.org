// @flow
import {Fragment} from 'react';
import {font} from '../../../utils/classnames';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import type {HTMLString} from '../../../services/prismic/types';

type Props = {|
  body: HTMLString,
  footer: ?string,
  citationLink: ?string
|}

const Quote = ({body, footer, citationLink}: Props) => (
  <blockquote
    className={`quote quote--block ${font({s: 'HNL3'})}`}>
    {/*
      TODO (wordpress migration); This is because we don't get structured
      content from WP.
    */}
    {typeof body === 'string'
      ? <div dangerouslySetInnerHTML={{__html: body}} />
      : <PrismicHtmlBlock html={body} />
    }

    {footer &&
      <footer className='quote__footer'>
        <cite className={`quote__cite ${font({s: 'HNL5'})}`}>
          {citationLink
            ? <a href={citationLink}>
              {footer}
            </a> : <Fragment>{footer}</Fragment>
          }
        </cite>
      </footer>
    }
  </blockquote>
);

export default Quote;
