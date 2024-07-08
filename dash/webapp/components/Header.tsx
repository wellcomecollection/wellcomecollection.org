import Link from 'next/link';
import styled from 'styled-components';

const Wrapper = styled.div`
  background: #ffce3c;
  margin-top: 30px;
  margin-bottom: 30px;
  position: relative;
  height: 60px;
  display: flex;
`;

const Title = styled.h2`
  margin: 0;
  padding: 0;
  margin-left: 18px;
  margin-right: 18px;
  color: #323232;
  font-weight: normal;
  line-height: 2.5em;
  min-width: 150px;
`;

const StyledLink = styled(Link)`
  color: #323232;
  text-decoration: none;
  font-weight: bold;
`;

const Header = ({ title }: { title: string }) => {
  return (
    <Wrapper>
      <h1 style={{ margin: 0, padding: 0 }}>
        <a href="/">
          <img
            src="https://i.wellcomecollection.org/assets/icons/android-chrome-512x512.png"
            width={90}
            height={90}
            alt="Wellcome Collection logo"
            title="Wellcome Collection"
            style={{
              marginTop: '-15px',
              marginLeft: '18px',
            }}
          />
        </a>
      </h1>

      <div style={{ display: 'flex' }}>
        <Title>{title}</Title>

        <ul
          style={{
            display: 'flex',
            listStyle: 'none',
            margin: 0,
            padding: 0,
            alignItems: 'center',
          }}
        >
          <li style={{ marginRight: '18px' }}>
            <StyledLink href="/pa11y">Pa11y</StyledLink>
          </li>
          <li style={{ marginRight: '18px' }}>
            <StyledLink href="/toggles">Toggles</StyledLink>
          </li>
        </ul>
      </div>
    </Wrapper>
  );
};

export default Header;
