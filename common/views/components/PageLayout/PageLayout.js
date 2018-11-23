// @flow
import {Fragment} from 'react';
import Head from 'next/head';

type Props = {|
  title: string,
  children: Node
|}

const PageLayout = ({
  title,
  children
}: Props) => {
  const fullTitle = title !== ''
    ? `${title} | Wellcome Collection`
    : 'Wellcome Collection | The free museum and library for the incurably curious';

  return (
    <Fragment>
      <Head>
        <title>{fullTitle}</title>
      </Head>
      {children}
    </Fragment>
  );
};
export default PageLayout;
