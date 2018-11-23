// @flow
import moment from 'moment';
import {museumLd, objToJsonLd} from '../../../utils/json-ld';
import {wellcomeCollection} from '../../../model/organization';
import {parseOpeningHoursFromCollectionVenues} from '../../../services/prismic/opening-times';
import JsonLd from '../JsonLd/JsonLd';

type Props = {|
  prismicCollectionVenues: any
|}

const galleryOpeningTimes = function(galleryHours: ?OpeningHours) {
  if (galleryHours) {
    return {
      openingHoursSpecification: galleryHours && galleryHours.regular.map(
        openingHoursDay =>  {
          const specObject = objToJsonLd(openingHoursDay, 'OpeningHoursSpecification', false);
          delete specObject.note;
          return specObject;
        }
      ),
      specialOpeningHoursSpecification: galleryHours.exceptional && galleryHours.exceptional.map(
        openingHoursDate => {
          const specObject = {
            opens: openingHoursDate.opens,
            closes: openingHoursDate.closes,
            validFrom: moment(openingHoursDate.overrideDate).format('YYYY-MM-DD'),
            validThrough: moment(openingHoursDate.overrideDate).format('YYYY-MM-DD')
          };
          return objToJsonLd(specObject, 'OpeningHoursSpecification', false);
        }
      )
    };
  }
};

const WellcomeCollectionJsonLd = ({prismicCollectionVenues}: Props) => {
  const openingHours = parseOpeningHoursFromCollectionVenues(prismicCollectionVenues);
  const galleryVenue =
        openingHours.groupedVenues.galleriesLibrary &&
        openingHours.groupedVenues.galleriesLibrary.hours.find(v => v.name === 'Galleries');
  const galleryVenueHours = galleryVenue && galleryVenue.openingHours;
  return (
    <JsonLd
      data={museumLd({
        ...wellcomeCollection,
        ...galleryOpeningTimes(galleryVenueHours)
      })} />
  );
};
export default WellcomeCollectionJsonLd;
