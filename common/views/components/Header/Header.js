import {font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import WellcomeCollectionBlack from '../../../icons/wellcome_collection_black';

type Props = {|
  siteSection: string,
  links: Array<any>
|}

const Header = ({ links = [], siteSection }: Props) => (
  <div className='header grid js-header-burger js-focus-trap bg-white'>
    <span className='visually-hidden js-trap-reverse-end'>reset focus</span>
    <div className='header__upper grid__cell'>
      <div className='header__inner container'>
        <div className='header__burger'>
          <a href='#footer-nav-1'
            id='header-burger-trigger'
            className='header__burger-trigger js-header-burger-trigger js-trap-start'
            aria-label='menu'>
            <span />
            <span />
            <span />
          </a>
        </div>
        <a href='https://wellcomecollection.org' className='header__brand'>
          <WellcomeCollectionBlack />
        </a>
        <nav id='header-nav'
          className='header__nav js-header-burger-drawer'
          aria-labelledby='header-burger-trigger'>
          <ul className={`plain-list header__list ${font({s: 'WB7'})} ${spacing({s: 0}, {margin: ['top', 'left', 'bottom', 'right'], padding: ['top', 'left', 'bottom', 'right']})}`}>
            {links.map((link, i) => (
              <li className={`header__item ${link.isCurrent ? ' header__item--is-current' : ''}`} key={i}>
                <a className='header__link js-header-nav-link'
                  href={link.href}
                  {... link.siteSection === siteSection ? {'aria-current': true} : {}}
                >{link.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div id='header-search' className='header__search'>
          <form className='header__form'
            action='https://wellcomecollection.org/search'
            method='post'>
            <div className='header__input-wrap js-show-hide-drawer'>
              <label className='header__label' htmlFor='header-input'>Search</label>
              <input id='header-input' className={`header__input ${font({s: 'HNL3', m: 'HNL2'})} js-header-input`} placeholder='Search' name='search' />
              {/* This is here as we're sending people back to V1, and drupal requires it */}
              {/* TODO: remove once we build our own search interface  */}
              <input type='hidden' name='form_id' value='col_search_form' />
            </div>
            <button className={`header__button ${font({s: 'WB7'})} js-show-hide-trigger  js-trap-reverse-start`}>
              <span className='header__button-inner'>
                <Icon name='search' extraClasses='header__search-button' />
                <span className='header__button-text'>Search</span>
              </span>
            </button>
            <span role='button' aria-controls='header-input' className='header__close-search js-header-close-search'>
              <Icon name='cross' title='Close search box' />
            </span>
          </form>
        </div>

        <span className='visually-hidden js-trap-end'>reset focus</span>
      </div>
    </div>
  </div>
);

export default Header;
