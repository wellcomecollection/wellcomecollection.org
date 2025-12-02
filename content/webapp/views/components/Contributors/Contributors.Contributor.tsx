import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { getCrop } from '@weco/common/model/image';
import { font } from '@weco/common/utils/classnames';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import { Contributor as ContributorType } from '@weco/content/types/contributors';
import LinkLabels from '@weco/content/views/components/LinkLabels';

const ContributorImageWrapper = styled(Space).attrs({
  $h: { size: 'm', properties: ['margin-right'] },
})`
  min-width: 78px;
`;

const ContributorInfoWrapper = styled(Space)`
  color: ${props => props.theme.color('neutral.600')};
`;

const ContributorNameWrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const PeopleImage: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <div
    style={{
      width: 72,
      height: 72,
      borderRadius: 6,
      transform: 'rotateZ(-6deg)',
      overflow: 'hidden',
    }}
  >
    <div style={{ transform: 'rotateZ(6deg) scale(1.2)' }}>{children}</div>
  </div>
);

const OrganisationImage = styled.div`
  width: 72px;
`;

const Name = styled.h3.attrs({ className: font('intb', 0) })`
  margin: 0;
`;

const Pronouns = styled(ContributorInfoWrapper).attrs({
  className: font('intr', -1),
  $h: { size: 's', properties: ['margin-left'] },
})``;

const Role = styled(ContributorInfoWrapper).attrs({
  className: font('intb', -1),
})``;

const Description = styled(Space).attrs({
  className: `${font('intr', -1)} spaced-text`,
  $v: { size: 's', properties: ['margin-top'] },
})``;

const Contributor: FunctionComponent<ContributorType> = ({
  contributor,
  role,
  description,
}) => {
  const descriptionToRender = description || contributor.description;

  // Contributor images should always be square.
  //
  // We prefer the explicit square crop if it's available, but we can't rely on it --
  // it's not defined on all contributors.  If there's no explicit crop, we fall back
  // to the default image (which is often square for contributors anyway).
  const contributorImage =
    getCrop(contributor.image, 'square') || contributor.image;

  return (
    <Grid>
      <GridCell
        style={{ display: 'flex' }}
        $sizeMap={{
          s: [12],
          m: [12],
          l: [12],
          xl: [12],
        }}
      >
        <ContributorImageWrapper>
          {contributor.type === 'people' && (
            <PeopleImage>
              {/*
                  Contributor images should always be in black-and-white. Most
                  of them are uploaded this way in Prismic, but we can
                  additionally add a filter here to catch any that are missed.
                */}
              <PrismicImage
                image={contributorImage}
                maxWidth={72}
                quality="low"
                desaturate={true}
              />
            </PeopleImage>
          )}
          {contributor.type === 'organisations' && (
            <OrganisationImage>
              {/*
                For now don't desaturate organisation images, brands can be picky
                about that sort of thing.
              */}
              <PrismicImage
                image={contributorImage}
                maxWidth={72}
                quality="low"
                desaturate={false}
              />
            </OrganisationImage>
          )}
        </ContributorImageWrapper>
        <div>
          <ContributorNameWrapper>
            <Name>{contributor.name}</Name>
            {contributor.type === 'people' && contributor.pronouns && (
              <Pronouns>({contributor.pronouns})</Pronouns>
            )}
          </ContributorNameWrapper>

          {role && role.title && <Role>{role.title}</Role>}

          {contributor.sameAs.length > 0 && (
            <LinkLabels
              items={contributor.sameAs.map(({ link, title }) => ({
                url: link,
                text: title,
              }))}
            />
          )}

          {descriptionToRender && (
            <Description>
              <PrismicHtmlBlock html={descriptionToRender} />
            </Description>
          )}
        </div>
      </GridCell>
    </Grid>
  );
};

export default Contributor;
