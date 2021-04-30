import { FunctionComponent } from 'react';
import { font } from '../../../utils/classnames';
import Space from '../styled/Space';
import { links } from '../Header/Header';

const FooterNav: FunctionComponent = () => {
  return (
    <div className="footer-nav">
      <nav className="footer-nav__nav">
        <ul className={`plain-list footer-nav__list no-margin no-padding`}>
          {links.map((link, i) => (
            <li key={link.title} className="footer-nav__item">
              <Space
                v={{
                  size: 's',
                  properties: ['padding-top', 'padding-bottom'],
                }}
                as="a"
                id={`footer-nav-${i}`}
                href={link.href}
                className={`footer-nav__link ${font('wb', 5)}`}
              >
                {link.title}
              </Space>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default FooterNav;
