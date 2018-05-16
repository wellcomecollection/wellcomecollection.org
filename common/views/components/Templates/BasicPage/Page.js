// @flow
import BasicPage from './BasicPage';
import HTMLDate from '../../HTMLDate/HTMLDate';
import type {Page} from '../../../../model/pages';

type Props = {|
  page: Page
|}

const InstallationPage = ({ page }: Props) => {
  const DateInfo = page.datePublished && <HTMLDate date={page.datePublished} />;
  // TODO: Pass in the URL of the textured image, if it exists
  // TODO: Support video
  const mainImageProps = page.body.length > 1 && page.body[0].type === 'picture'
    ? page.body[0].value : null;
  const body = mainImageProps ? page.body.slice(1, page.body.length)  : page.body;

  return (
    <BasicPage
      DateInfo={DateInfo}
      Background={null}
      TagBar={null}
      InfoBar={null}
      Description={null}
      title={page.title}
      mainImageProps={mainImageProps}
      body={body}>
    </BasicPage>
  );
};

export default InstallationPage;
