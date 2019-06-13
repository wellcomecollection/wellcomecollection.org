// @flow
import Tags from '@weco/common/views/components/Tags/Tags';
import { worksUrl } from '@weco/common/services/catalogue/urls';
import { spacing, font } from '@weco/common/utils/classnames';

const Explororama = () => (
  <div className={`row ${spacing({ s: 3, m: 5 }, { padding: ['top'] })}`}>
    <div className="container">
      <div className="grid">
        <div className="grid__cell">
          <h3 className={font({ s: 'WB6', m: 'WB4' })}>Exploromaticus?</h3>
          <p
            className={`${spacing({ s: 2 }, { margin: ['bottom'] })} ${font({
              s: 'HNL4',
              m: 'HNL3',
            })}`}
          >
            Discover our collections through these topics.
          </p>
          <div className={spacing({ s: 4 }, { margin: ['bottom'] })}>
            <Tags
              tags={[
                {
                  textParts: ['Quacks'],
                  linkAttributes: worksUrl({
                    query: 'quack+OR+quacks',
                    page: 1,
                    fromComponent: 'Exploromatic',
                  }),
                },
                {
                  textParts: ['James Gillray'],
                  linkAttributes: worksUrl({
                    query: 'james+gillray',
                    page: 1,
                    fromComponent: 'Exploromatic',
                  }),
                },
                {
                  textParts: ['Botany'],
                  linkAttributes: worksUrl({
                    query: 'botany',
                    page: 1,
                    fromComponent: 'Exploromatic',
                  }),
                },
                {
                  textParts: ['Optics'],
                  linkAttributes: worksUrl({
                    query: 'optics',
                    page: 1,
                    fromComponent: 'Exploromatic',
                  }),
                },
                {
                  textParts: ['Sun'],
                  linkAttributes: worksUrl({
                    query: 'sun',
                    page: 1,
                    fromComponent: 'Exploromatic',
                  }),
                },
                {
                  textParts: ['Health'],
                  linkAttributes: worksUrl({
                    query: 'health',
                    page: 1,
                    fromComponent: 'Exploromatic',
                  }),
                },
                {
                  textParts: ['Paintings'],
                  linkAttributes: worksUrl({
                    query: 'paintings',
                    page: 1,
                    fromComponent: 'Exploromatic',
                  }),
                },
                {
                  textParts: ['Science'],
                  linkAttributes: worksUrl({
                    query: 'science',
                    page: 1,
                    fromComponent: 'Exploromatic',
                  }),
                },
              ]}
            />
          </div>
          <hr
            className={`divider divider--dashed ${spacing(
              { s: 6 },
              { margin: ['bottom'] }
            )}`}
          />
        </div>
      </div>
    </div>
  </div>
);
export default Explororama;
