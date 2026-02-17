import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { organisation, user } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { toWorkLink } from '@weco/content/views/components/WorkLink';

const Root = styled(Space).attrs({
  className: font('sans', -2),
  $v: { size: 'sm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'sm', properties: ['padding-left', 'padding-right'] },
})`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

const Description = styled(Space).attrs({
  as: 'p',
  $v: { size: 'xl', properties: ['margin-bottom'] },
})`
  ${props => props.theme.clampLines(6)};
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

const Date = styled(Space).attrs({
  $v: { size: 'xs', properties: ['margin-bottom'] },
})``;

const Extent = styled.span`
  ${props => props.theme.clampLines(3)};
`;

type Props = {
  id: string;
  label: string;
  title: string;
  description: string;
  contributor: string;
  isOrganisation: boolean;
  date: string;
  extent: string;
};

const ArchiveCard: FunctionComponent<Props> = ({
  id,
  label,
  title,
  description,
  contributor,
  isOrganisation,
  date,
  extent,
}) => {
  return (
    <NextLink
      data-component="archive-card"
      {...toWorkLink({ id })}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <Root>
        <div>
          <Label>{label}</Label>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </div>

        <div>
          <ContributorRow>
            <IconWrapper>
              <Icon
                iconColor="white"
                icon={isOrganisation ? organisation : user}
                matchText
              />
            </IconWrapper>
            <span>{contributor}</span>
          </ContributorRow>
          <Date>Date: {date}</Date>
          <Extent>Contains: {extent}</Extent>
        </div>
      </Root>
    </NextLink>
  );
};

export default ArchiveCard;
