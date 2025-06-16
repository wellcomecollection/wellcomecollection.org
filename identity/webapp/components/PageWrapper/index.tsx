import Head from 'next/head';
import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import useIsFontsLoaded from '@weco/common/hooks/useIsFontsLoaded';
import { usePrismicData } from '@weco/common/server-data/Context';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';
import Footer from '@weco/common/views/components/Footer';
import Header from '@weco/common/views/components/Header';
import { Favicons } from '@weco/common/views/components/PageLayout';
import { GlobalStyle } from '@weco/common/views/themes/default';

const Main = styled.div`
  ${props =>
    props.theme.media('medium')(`
      background: ${props.theme.color('warmNeutral.300')};
      min-height: calc(100vh - ${props.theme.navHeight}px);
  `)}
`;

type Props = {
  title: string;
};

const PageWrapper: FunctionComponent<PropsWithChildren<Props>> = ({
  title,
  children,
}) => {
  const { isEnhanced } = useAppContext();
  const { collectionVenues } = usePrismicData();
  const venues = transformCollectionVenues(collectionVenues);
  const fullTitle = `${title} | Wellcome Collection`;
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <Favicons />
      </Head>
      <GlobalStyle isFontsLoaded={useIsFontsLoaded()} />
      <Header siteSection="collections" />
      <Main>{children}</Main>
      {isEnhanced && <Footer venues={venues} />}
    </>
  );
};

export default PageWrapper;
