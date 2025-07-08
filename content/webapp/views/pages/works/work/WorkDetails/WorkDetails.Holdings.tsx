import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import ExpandableList from '@weco/content/components/ExpandableList';
import { Holding } from '@weco/content/services/wellcome/catalogue/types';
import {
  getLocationLabel,
  getLocationLink,
  getLocationShelfmark,
} from '@weco/content/utils/works';

import WorkDetailsSection from './WorkDetails.Section';
import WorkDetailsText from './WorkDetails.Text';

const WorkDetailsHoldings = ({ holdings }: { holdings: Holding[] }) => {
  return (
    <>
      {holdings.length > 0 ? (
        <WorkDetailsSection headingText="Holdings">
          {holdings.map((holding, i) => {
            const locationLabel =
              holding.location && getLocationLabel(holding.location);
            const locationShelfmark =
              holding.location && getLocationShelfmark(holding.location);
            const locationLink =
              holding.location && getLocationLink(holding.location);

            return (
              <Space
                key={i}
                $v={
                  i + 1 !== holdings.length
                    ? { size: 'l', properties: ['margin-bottom'] }
                    : { size: 'l', properties: [] }
                }
              >
                {holding.enumeration.length > 0 && (
                  <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
                    <ExpandableList
                      listItems={holding.enumeration}
                      initialItems={10}
                    />
                  </Space>
                )}
                <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
                  {locationLink && (
                    <a className={font('intr', 5)} href={locationLink.url}>
                      {locationLink.linkText}
                    </a>
                  )}

                  {locationShelfmark && (
                    <WorkDetailsText
                      title="Location"
                      noSpacing={true}
                      text={`${locationLabel} ${locationShelfmark}`}
                    />
                  )}

                  {holding.note && (
                    <WorkDetailsText
                      title="Note"
                      inlineHeading={true}
                      noSpacing={true}
                      text={holding.note}
                    />
                  )}
                </Space>
              </Space>
            );
          })}
        </WorkDetailsSection>
      ) : null}
    </>
  );
};

export default WorkDetailsHoldings;
