import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { clock, information } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import theme from '@weco/common/views/themes/default';
import InfoBox, {
  InfoIconWrapper,
} from '@weco/content/views/components/InfoBox';
import MoreLink from '@weco/content/views/components/MoreLink';

const ClosedMessage = () => (
  <Space
    $v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}
    style={{ maxWidth: theme.sizes.large }}
  >
    <InfoBox
      title="Exhibitions are closed today"
      headingClasses={font('wb', 2)}
      items={[]}
    >
      <InfoIconWrapper>
        <Icon icon={information} />
      </InfoIconWrapper>
      <p className={font('intr', 5)}>
        Our exhibitions are closed today, but our{' '}
        <a href={`/visit-us/${prismicPageIds.cafe}`}>café</a> and{' '}
        <a href={`/visit-us/${prismicPageIds.shop}`}>shop</a> are open for your
        visit.
      </p>

      <InfoIconWrapper>
        <Icon icon={clock} />
      </InfoIconWrapper>
      <p className={font('intr', 5)} style={{ marginBottom: 0 }}>
        Galleries open Tuesday–Sunday,{' '}
        <a href={`/visit-us/${prismicPageIds.openingTimes}`}>
          see full opening times
        </a>
        .
      </p>
    </InfoBox>
    <Space $v={{ size: 'l', properties: ['margin-top'] }}>
      <MoreLink url="/exhibitions" name="View all exhibitions" />
    </Space>
    <Space $v={{ size: 'm', properties: ['margin-top'] }}>
      <MoreLink url="/events" name="View all events" />
    </Space>
  </Space>
);

export default ClosedMessage;
