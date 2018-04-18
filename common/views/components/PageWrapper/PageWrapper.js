import {Component} from 'react';
import {getCollectionOpeningTimes} from '@weco/common/services/prismic/opening-times';
import type {PlacesOpeningHours} from '@weco/common/model/opening-hours';

type Props = {
  openingTimes: {
    placesOpeningHours: PlacesOpeningHours,
    upcomingExceptionalOpeningPeriods: Date[][]
  }
}
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
      const {...props} = this.props;
      return (
        <Comp {...props} />
      );
    }
  };
};

export default PageWrapper;
