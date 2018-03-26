// @flow
import {withToggler} from '../../hocs/withToggler';
import {font, spacing} from '../../../utils/classnames';
import WellcomeCollectionBlack from '../../../icons/wellcome_collection_black';

type Props = {|
  siteSection: string,
  isActive: boolean,
  toggle: () => void,
  links: Array<{|
    href: string,
    title: string,
    siteSection: string
  |}>,
|}

const Header = withToggler(({ links, siteSection, toggle, isActive }: Props) => (
  <div className={`header grid js-header-burger js-focus-trap bg-white ${isActive ? 'header--is-burger-open' : ''}`}>
    <span className='visually-hidden js-trap-reverse-end'>reset focus</span>
    <div className='header__upper grid__cell'>
      <div className='header__inner container'>
        <div className='header__burger'>
          <a href='#footer-nav-1'
            id='header-burger-trigger'
            className='header__burger-trigger js-header-burger-trigger js-trap-start'
            aria-label='menu'
            onClick={(event) => { event.preventDefault(); toggle(); }}>
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
              <li className={`header__item ${link.siteSection === siteSection ? ' header__item--is-current' : ''}`} key={i}>
                <a className='header__link js-header-nav-link'
                  href={link.href}
                  {... link.siteSection === siteSection ? {'aria-current': true} : {}}
                >{link.title}</a>
              </li>
            ))}
          </ul>
        </nav>
        {/* we leave this here until we know exactly what we want to do with search */}
        <div id="header-search" className="header__search"></div>
        <span className='visually-hidden js-trap-end'>reset focus</span>
      </div>
    </div>
  </div>
));

export default Header;
