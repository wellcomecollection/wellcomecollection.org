import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { organisation, user } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { DataGtmProps, dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { toWorkLink } from '@weco/content/views/components/WorkLink';

const Wrapper = styled(NextLink)`
  text-decoration: none;
  display: block;
  height: 100%;
`;

const Root = styled(Space).attrs({
  className: font('sans', -2),
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'sm', properties: ['padding-left', 'padding-right'] },
})`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background: ${props => props.theme.color('warmNeutral.300')};
  border-radius: ${props => props.theme.borderRadiusUnit}px;
`;

const Label = styled(Space).attrs({
  $v: { size: 'xs', properties: ['margin-bottom'] },
})`
  color: ${props => props.theme.color('neutral.600')};
`;

const Title = styled(Space).attrs({
  as: 'h2',
  $v: { size: 'xs', properties: ['margin-bottom'] },
  className: font('brand', 0),
})`
  ${Root}:hover & {
    text-decoration: underline;
  }
`;

const Description = styled.p`
  ${props => props.theme.clampLines(6)};
  margin-bottom: 0;
`;

const ContributorRow = styled(Space).attrs({
  $v: { size: 'xs', properties: ['margin-bottom'] },
})`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled(Space).attrs({
  $h: { size: 'xs', properties: ['margin-right'] },
})`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.8em;
  height: 1.8em;
  background: ${props => props.theme.color('black')};
`;

const Extent = styled(Space).attrs({
  $v: { size: 'xs', properties: ['margin-top'] },
})`
  ${props => props.theme.clampLines(3)};
`;

type Props = {
  id: string;
  title: string;
  label?: string;
  description?: string;
  contributor?: string;
  isOrganisation: boolean;
  date?: string;
  extent?: string;
  dataGtmProps: DataGtmProps;
};

const ArchiveCard: FunctionComponent<Props> = ({
  id,
  title,
  label,
  description,
  contributor,
  isOrganisation,
  date,
  extent,
  dataGtmProps,
}) => {
  return (
    <Wrapper
      data-component="archive-card"
      {...toWorkLink({ id })}
      {...dataGtmPropsToAttributes(dataGtmProps)}
    >
      <Root>
        <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
          {label && <Label>{label}</Label>}
          <Title>{title}</Title>
          {description && <Description>{description}</Description>}
        </Space>

        {(contributor || date || extent) && (
          <div>
            {contributor && (
              <ContributorRow>
                <IconWrapper>
                  <Icon
                    title={isOrganisation ? 'organisation' : 'person'}
                    iconColor="white"
                    icon={isOrganisation ? organisation : user}
                    matchText
                  />
                </IconWrapper>
                <span>{contributor}</span>
              </ContributorRow>
            )}
            {date && <span>Date: {date}</span>}
            {extent && <Extent>Contains: {extent}</Extent>}
          </div>
        )}
      </Root>
    </Wrapper>
  );
};

export default ArchiveCard;
