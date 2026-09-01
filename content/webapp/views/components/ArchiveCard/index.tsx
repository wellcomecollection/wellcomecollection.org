import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import { DataGtmProps, dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Divider from '@weco/common/views/components/Divider';
import Space from '@weco/common/views/components/styled/Space';
import { toWorkLink } from '@weco/content/views/components/WorkLink';
import WorkTitle from '@weco/content/views/components/WorkTitle';

const Wrapper = styled(NextLink)`
  text-decoration: none;
  display: block;
  height: 100%;
`;

const Root = styled(Space).attrs({
  className: typography('body', 'sm', 'regular'),
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
  className: typography('heading', 'md', 'regular', 'brand'),
})`
  ${Root}:hover & {
    text-decoration: underline;
  }
`;

const Description = styled.div`
  ${props => props.theme.clampLines(6)};
  margin-bottom: 0;
`;

const ContributorRow = styled(Space).attrs({
  $v: { size: 'xs', properties: ['margin-bottom'] },
})`
  display: block;
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
  date?: string;
  extent?: string;
  dataGtmProps?: DataGtmProps;
};

// TODO: once the catalogue API exposes a dedicated "short description"
// field, prefer that over deriving one from the first sentence here.
function stripTagsAndGetFirstSentence(description: string): string {
  const plainText = description.replace(/<[^>]*>/g, '');
  const [firstSentence] = plainText.match(/[^.!?]*[.!?]/) || [plainText];
  return firstSentence.trim();
}

const ArchiveCard: FunctionComponent<Props> = ({
  id,
  title,
  label,
  description,
  contributor,
  date,
  extent,
  dataGtmProps,
}) => {
  const hasMetadata = contributor || date || extent;

  return (
    <Wrapper
      data-component="archive-card"
      {...toWorkLink({ id })}
      {...dataGtmPropsToAttributes(dataGtmProps)}
    >
      <Root>
        <Space $v={{ size: 'md', properties: ['margin-bottom'] }}>
          {label && <Label>{label}</Label>}
          <Title>
            <WorkTitle title={title} />
          </Title>
          {description && (
            <Description>
              {stripTagsAndGetFirstSentence(description)}
            </Description>
          )}
        </Space>

        {hasMetadata && (
          <div>
            <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
              <Divider lineColor="warmNeutral.400" />
            </Space>
            {contributor && <ContributorRow>{contributor}</ContributorRow>}
            {date && <span>Date: {date}</span>}
            {extent && <Extent>Contains: {extent}</Extent>}
          </div>
        )}
      </Root>
    </Wrapper>
  );
};

export default ArchiveCard;
