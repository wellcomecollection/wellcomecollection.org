import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import FeaturedWorkLink from '@weco/content/views/components/FeaturedWorkLink';

export const hasLinkedWork = (taslSourceLink?: string) => {
  return Boolean(
    taslSourceLink &&
      taslSourceLink.indexOf('wellcomecollection.org/works/') > -1
  );
};

const WorkLinkComponent = ({ taslSourceLink }: { taslSourceLink?: string }) => {
  if (!taslSourceLink) return null;

  return (
    <Space
      $v={{ size: 'm', properties: ['margin-top'] }}
      className={font('intm', 5)}
      style={{ display: 'block' }}
      data-id="work-link-component"
    >
      <FeaturedWorkLink link={taslSourceLink} text="View in catalogue" />
    </Space>
  );
};

export default WorkLinkComponent;
