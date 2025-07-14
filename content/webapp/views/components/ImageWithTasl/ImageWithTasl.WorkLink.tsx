import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const WorkLinkContainer = styled(Space).attrs({
  $v: { size: 'm', properties: ['margin-top'] },
})`
  display: inline-flex;
  align-items: center;
`;

export const WorkLink = styled.a`
  margin-left: 0.25rem;
  text-decoration-style: dotted;
  text-underline-offset: 26%;
  text-decoration-thickness: 8%;
`;

export const WorkIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export const hasLinkedWork = (taslSourceLink?: string) => {
  return Boolean(
    taslSourceLink &&
      taslSourceLink.indexOf('wellcomecollection.org/works/') > -1
  );
};

const WorkLinkComponent = ({ taslSourceLink }: { taslSourceLink?: string }) => {
  if (!taslSourceLink) return null;

  return (
    <div style={{ display: 'block' }} data-id="work-link-component">
      <WorkLinkContainer className={font('intm', 5)}>
        <WorkIcon
          src="https://i.wellcomecollection.org/assets/icons/favicon-32x32.png"
          alt=""
        />
        <WorkLink href={taslSourceLink}>View in catalogue</WorkLink>
      </WorkLinkContainer>
    </div>
  );
};

export default WorkLinkComponent;
