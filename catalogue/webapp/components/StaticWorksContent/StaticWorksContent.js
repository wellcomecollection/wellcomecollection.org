// @flow
import { Fragment } from 'react';
import { font, grid } from '@weco/common/utils/classnames';
import { createPrismicParagraph } from '@weco/common/utils/prismic';
import { searchQueryParams } from '@weco/common/services/catalogue/search-params';
import Tags from '@weco/common/views/components/Tags/Tags';
import { CaptionedImage } from '@weco/common/views/components/Images/Images';
import { worksUrl } from '@weco/common/services/catalogue/urls';
import Space from '@weco/common/views/components/styled/Space';

const StaticWorksContent = () => {
  const params = searchQueryParams();
  return (
    <Fragment>
      <Space v={{ size: 'l', properties: ['padding-top'] }} className={`row`}>
        <div className="container">
          <div className="grid">
            <div className="grid__cell">
              <h3 className="h2">Feeling curious?</h3>
              <Space
                as="p"
                v={{ size: 'm', properties: ['margin-bottom'] }}
                className={font('hnl', 4)}
              >
                Discover our collections through these topics.
              </Space>
              <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                <Tags
                  tags={[
                    {
                      textParts: ['Quacks'],
                      linkAttributes: worksUrl({
                        ...params,
                        query: 'quack+OR+quacks',
                        page: 1,
                      }),
                    },
                    {
                      textParts: ['James Gillray'],
                      linkAttributes: worksUrl({
                        ...params,
                        query: 'james+gillray',
                        page: 1,
                      }),
                    },
                    {
                      textParts: ['Botany'],
                      linkAttributes: worksUrl({
                        ...params,
                        query: 'botany',
                        page: 1,
                      }),
                    },
                    {
                      textParts: ['Optics'],
                      linkAttributes: worksUrl({
                        ...params,
                        query: 'optics',
                        page: 1,
                      }),
                    },
                    {
                      textParts: ['Sun'],
                      linkAttributes: worksUrl({
                        ...params,
                        query: 'sun',
                        page: 1,
                      }),
                    },
                    {
                      textParts: ['Health'],
                      linkAttributes: worksUrl({
                        ...params,
                        query: 'health',
                        page: 1,
                      }),
                    },
                    {
                      textParts: ['Paintings'],
                      linkAttributes: worksUrl({
                        ...params,
                        query: 'paintings',
                        page: 1,
                      }),
                    },
                    {
                      textParts: ['Science'],
                      linkAttributes: worksUrl({
                        ...params,
                        query: 'science',
                        page: 1,
                      }),
                    },
                  ]}
                />
              </Space>
              <Space
                v={{ size: 'l', properties: ['margin-bottom'] }}
                as="hr"
                className={`divider divider--dashed`}
              />
            </div>
          </div>
        </div>
      </Space>
      <Space
        v={{
          size: 'xl',
          properties: ['padding-bottom'],
        }}
        className={`row bg-cream row--has-wobbly-background`}
      >
        <div className="container">
          <div className="row__wobbly-background" />
          <div className="grid grid--dividers">
            <div className={grid({ s: 12, m: 10, l: 7, xl: 7 })}>
              <Space
                as="h2"
                v={{ size: 'l', properties: ['margin-bottom'] }}
                className={`h2`}
              >
                About the historical images
              </Space>
              <div className="body-text">
                <div className={`standfirst ${font('hnl', 3)}`}>
                  <p>
                    These artworks and photographs are from the library at
                    Wellcome Collection and have been collected over several
                    decades.{' '}
                  </p>
                </div>

                <p>
                  Most of the works were acquired between 1890 and 1936 by Sir
                  Henry Wellcome and his agents across the globe. The images
                  reflect Wellcome’s collecting interests and were intended to
                  form a documentary resource that reflects the cultural and
                  historical contexts of health and medicine.
                </p>

                <p>
                  You may find some of these representations of people and
                  cultures offensive or distressing. On occasion individuals are
                  depicted as research subjects, and the collection includes
                  images of nakedness, medical conditions and surgical
                  interventions.
                </p>

                <p>
                  Wellcome had a personal interest in medical and ethnographic
                  objects and the objects, artworks and photographs he collected
                  were initially presented in the Wellcome Historical Medical
                  Museum. Over the subsequent decades the library and its
                  collections developed to become Wellcome Collection as it now
                  is: a free museum and library exploring health, life and our
                  place in the world.
                </p>

                <p>
                  Many of the images on this site were digitised during the
                  1990s, and first made available online in 2002. Recent
                  developments to the site have made these images more easily
                  discoverable, but have also made the sensitive nature of some
                  content more visible, and revealed the poor quality of some of
                  the early digitisation.
                </p>

                <p>
                  As we make more images from our collections available over the
                  coming months, we will identify and consider these issues in a
                  systematic and consistent manner. We want to include a range
                  of voices from inside and outside Wellcome Collection to help
                  us with this. If you would like to get involved or have
                  information about an image which might help us to understand
                  it better, please email{' '}
                  <a href="mailto:collections@wellcome.ac.uk">
                    collections@wellcome.ac.uk
                  </a>
                  .
                </p>
              </div>
            </div>
            <Space
              v={{
                size: 's',
                properties: ['margin-bottom'],
              }}
              className={grid({ s: 12, m: 8, l: 5, xl: 5 })}
            >
              <CaptionedImage
                caption={createPrismicParagraph(
                  'Sir Henry Solomon Wellcome (1853—1936). Pharmacist, entrepreneur, philanthropist and collector.'
                )}
                sizesQueries="600px"
                image={{
                  contentUrl:
                    'https://iiif.wellcomecollection.org/image/V0027772.jpg/full/full/0/default.jpg',
                  width: 1600,
                  height: 2182,
                  alt: 'Portrait of Henry Wellcome',
                  tasl: {
                    title:
                      'Sir Henry Solomon Wellcome. Photograph by Lafayette Ltd',
                    sourceName: 'Wellcome Collection',
                    sourceLink: 'https://wellcomecollection.org/works/a2d9ywt8',
                    author: null,
                    license: 'CC-BY',
                    copyrightHolder: 'Wellcome Collection',
                    copyrightLink: 'https://wellcomecollection.org',
                  },
                  crops: {},
                }}
              />
            </Space>
          </div>
        </div>
      </Space>
    </Fragment>
  );
};

export default StaticWorksContent;
