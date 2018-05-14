// @flow
import {Fragment} from 'react';
import BasicPage from './BasicPage';
import HTMLDate from '../../HTMLDate/HTMLDate';
import type {Page} from '../../../../model/pages';

type Props = {|
  page: Page
|}

const InstallationPage = ({ page }: Props) => {
  const DateInfo = page.datePublished && <HTMLDate date={page.datePublished} />;
  console.info(page.datePublished);

  return (
    <BasicPage
      Background={null}
      DateInfo={DateInfo}
      Description={null}
      InfoBar={null}
      title={page.title}
      mainImageProps={page.promo && page.promo.image}
      body={page.body}>
      <Fragment>
      </Fragment>
    </BasicPage>
  );
};

export default InstallationPage;
