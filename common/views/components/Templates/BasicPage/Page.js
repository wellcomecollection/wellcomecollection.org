// @flow
import {Fragment} from 'react';
import BasicPage from './BasicPage';
import HTMLDate from '../../HTMLDate/HTMLDate';
import type {Page} from '../../../../model/pages';
import TexturedBackground from './TexturedBackground';

type Props = {|
  page: Page
|}

const backgroundTexture = 'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg';
const InstallationPage = ({ page }: Props) => {
  const DateInfo = page.datePublished && <HTMLDate date={page.datePublished} />;
  // TODO: Pass in the URL of the textured image, if it exists
  // TODO: Support video
  const Background = page.body.length > 1 && page.body[0].type === 'picture'
    ? TexturedBackground({ backgroundTexture }) : null;

  return (
    <BasicPage
      Background={Background}
      DateInfo={DateInfo}
      Description={null}
      TagBar={null}
      InfoBar={null}
      title={page.title}
      mainImageProps={null}
      body={page.body}>
      <Fragment>
      </Fragment>
    </BasicPage>
  );
};

export default InstallationPage;
