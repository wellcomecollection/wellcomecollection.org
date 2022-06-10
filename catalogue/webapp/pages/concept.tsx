import { GetServerSideProps, NextPage } from 'next';
import {
  Concept as ConceptType,
  Work as WorkType,
} from '@weco/common/model/catalogue';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { appError, AppErrorProps } from '@weco/common/views/pages/_app';
import { getServerData } from '@weco/common/server-data';
import { isString } from '@weco/common/utils/array';
import { getConcept } from 'services/catalogue/concepts';
import CataloguePageLayout from 'components/CataloguePageLayout/CataloguePageLayout';
import { getWorks } from '../services/catalogue/works';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { Fragment } from 'react';
import { classNames } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import WorkDetailsSection from 'components/WorkDetailsSection/WorkDetailsSection';
import WorkDetailsTags from 'components/WorkDetailsTags/WorkDetailsTags';

type Props = {
  conceptResponse: ConceptType;
  works: WorkType[];
};

export const ConceptPage: NextPage<Props> = ({ conceptResponse, works }) => {
  const conceptsJson = JSON.stringify(conceptResponse);
  const workJson = JSON.stringify(works);

  const ContentTypeInfo = (
    <Fragment>
      <Space
        v={{
          size: 's',
          properties: ['margin-top'],
        }}
        className={classNames({
          'first-para-no-margin': true,
        })}
      >
        <p>tumor or cancer of the nose</p>
        <p>
          <a href="https://www.wikidata.org/wiki/Q71785199">
            Read more on Wikidata
          </a>{' '}
          &#8599;
        </p>
        <WorkDetailsSection headingText="Related" omitDivider={true}>
          <WorkDetailsTags
            tags={[
              {
                textParts: ['skull neoplasm'],
                linkAttributes: {
                  href: {
                    pathname: '/concepts/1234',
                  },
                  as: {
                    pathname: '/concepts/1234',
                  },
                },
              },
              {
                textParts: ['nose disease'],
                linkAttributes: {
                  href: {
                    pathname: '/concepts/1234',
                  },
                  as: {
                    pathname: '/concepts/1234',
                  },
                },
              },
              {
                textParts: ['disease'],
                linkAttributes: {
                  href: {
                    pathname: '/concepts/1234',
                  },
                  as: {
                    pathname: '/concepts/1234',
                  },
                },
              },
            ]}
          />
        </WorkDetailsSection>
      </Space>
    </Fragment>
  );

  return (
    <CataloguePageLayout
      title={conceptResponse.label}
      description={'<TBC>'}
      url={{ pathname: `/concepts/${conceptResponse.id}`, query: {} }}
      openGraphType={'website'}
      siteSection={'collections'}
      jsonLd={{ '@type': 'WebPage' }}
      hideNewsletterPromo={true}
    >
      <PageHeader
        title={conceptResponse.label}
        breadcrumbs={{ items: [] }}
        ContentTypeInfo={ContentTypeInfo}
        isContentTypeInfoBeforeMedia={true}
        backgroundTexture={
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAvGVYSWZNTQAqAAAACAAGARIAAwAAAAEAAQAAARoABQAAAAEAAABWARsABQAAAAEAAABeATEAAgAAABgAAABmATIAAgAAABQAAAB+h2kABAAAAAEAAACSAAAAAAAAAEgAAAABAAAASAAAAAFGbHlpbmcgTWVhdCBBY29ybiA3LjAuMwAyMDIyOjA2OjEwIDE2OjA5OjAzAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAABoAMABAAAAAEAAAABAAAAABMMV9UAAAAJcEhZcwAACxMAAAsTAQCanBgAAAMbaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjE0NDA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjI1NjA8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkZseWluZyBNZWF0IEFjb3JuIDcuMC4zPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDIyLTA2LTEwVDE2OjA5OjAzPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6Q29tcHJlc3Npb24+NTwvdGlmZjpDb21wcmVzc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CviO51IAAAANSURBVAgdY1h5e9d/AAetAz52p4V1AAAAAElFTkSuQmCC'
        }
      />
      <div className="container">
        <h1>Concepts API response:</h1>
        <p>{conceptsJson}</p>
        <h1>Associated works:</h1>
        <p>{workJson}</p>
      </div>
    </CataloguePageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id } = context.query;

    // Note: These pages don't need to be behind a toggle, but I'm putting them here
    // as a way to test the concepts toggle.
    //
    // We will want a toggle in place for linking to concepts from works pages.
    if (!serverData.toggles.conceptsPages) {
      return { notFound: true };
    }

    if (!isString(id)) {
      return { notFound: true };
    }

    const conceptPromise = getConcept({
      id,
      toggles: serverData.toggles,
    });

    const worksPromise = getWorks({
      params: { subjects: [id] },
      toggles: serverData.toggles,
    });

    const [conceptResponse, worksResponse] = await Promise.all([
      conceptPromise,
      worksPromise,
    ]);

    if (conceptResponse.type === 'Error') {
      if (conceptResponse.httpStatus === 404) {
        return { notFound: true };
      }
      return appError(
        context,
        conceptResponse.httpStatus,
        conceptResponse.description
      );
    }

    const works = worksResponse.type === 'Error' ? [] : worksResponse.results;

    return {
      props: removeUndefinedProps({
        conceptResponse,
        works,
        serverData,
      }),
    };
  };

export default ConceptPage;
