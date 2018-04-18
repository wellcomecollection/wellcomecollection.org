import {Component} from 'react';
import {getCollectionOpeningTimes} from '@weco/common/services/prismic/opening-times';
import DefaultPageLayout from '@weco/common/views/components/DefaultPageLayout/DefaultPageLayout';

const PageWrapper = Comp => {
  return class Global extends Component<Props> {
    static async getInitialProps(args) {
      const openingTimes = await getCollectionOpeningTimes();
      return {
        openingTimes: {
          placesOpeningHours: openingTimes.placesOpeningHours,
          upcomingExceptionalOpeningPeriods: openingTimes.upcomingExceptionalOpeningPeriods
        },
        ...(Comp.getInitialProps ? await Comp.getInitialProps(args) : null)
      };
    }
    render() {
      const {title, description, type, url, imageUrl, siteSection, analyticsCategory, openingTimes, ...props} = this.props;
      return (
        <DefaultPageLayout
          title={title}
          description={description}
          type={type}
          url={url}
          imageUrl={imageUrl}
          siteSection={siteSection}
          analyticsCategory={analyticsCategory}
          openingTimes={openingTimes}>
          <Comp {...props} />
        </DefaultPageLayout>
      );
    }
  };
};

export default PageWrapper;
