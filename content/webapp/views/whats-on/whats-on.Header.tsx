import NextLink from 'next/link';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { clock } from '@weco/common/icons';
import {
  ExceptionalOpeningHoursDay,
  OpeningHoursDay,
} from '@weco/common/model/opening-hours';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import { SectionPageHeader } from '@weco/common/views/components/PageHeader';
import { Container } from '@weco/common/views/components/styled/Container';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import Tabs from '@weco/common/views/components/Tabs';
import { FeaturedText as FeaturedTextType } from '@weco/content/types/text';

import { tabItems } from '.';

const OpeningTimesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const OpeningTimes = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

type HeaderProps = {
  activeId: string;
  todaysOpeningHours: ExceptionalOpeningHoursDay | OpeningHoursDay | undefined;
  featuredText?: FeaturedTextType;
};

const Header: FunctionComponent<HeaderProps> = ({
  activeId,
  todaysOpeningHours,
}) => {
  return (
    <Space $v={{ size: 'l', properties: ['padding-top'] }}>
      <Container>
        <Grid>
          <GridCell
            $sizeMap={{
              s: [12],
              m: [12],
              l: [12],
              xl: [12],
            }}
          >
            <OpeningTimesWrapper>
              <SectionPageHeader $sectionLevelPage={true}>
                What’s on
              </SectionPageHeader>
              <OpeningTimes>
                {todaysOpeningHours && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Space
                      as="span"
                      $h={{ size: 'm', properties: ['margin-right'] }}
                      className={font('intb', 5)}
                    >
                      Galleries
                      {todaysOpeningHours.isClosed ? ' closed ' : ' open '}
                      today
                    </Space>
                    {!todaysOpeningHours.isClosed && (
                      <>
                        <Space
                          style={{ display: 'flex' }}
                          as="span"
                          $h={{ size: 's', properties: ['margin-right'] }}
                        >
                          <Icon icon={clock} />
                        </Space>
                        <Space
                          as="span"
                          $h={{ size: 'm', properties: ['margin-right'] }}
                          className={font('intr', 5)}
                        >
                          <>
                            <time>{todaysOpeningHours.opens}</time>
                            {' – '}
                            <time>{todaysOpeningHours.closes}</time>
                          </>
                        </Space>
                      </>
                    )}
                  </div>
                )}
                <NextLink
                  href={`/visit-us/${prismicPageIds.openingTimes}`}
                  className={font('intb', 5)}
                >
                  Full opening times
                </NextLink>
              </OpeningTimes>
            </OpeningTimesWrapper>
          </GridCell>
        </Grid>
        <Grid>
          <GridCell
            $sizeMap={{
              s: [12],
              m: [10],
              l: [7],
              xl: [7],
            }}
          >
            <Space
              $v={{ size: 's', properties: ['margin-top', 'margin-bottom'] }}
            >
              <Tabs
                tabBehaviour="navigate"
                label="date filter"
                currentSection={activeId}
                items={tabItems}
              />
            </Space>
          </GridCell>
        </Grid>
      </Container>
    </Space>
  );
};

export default Header;
