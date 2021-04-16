import {
  FunctionComponent,
  useState,
  useContext,
  RefObject,
  ReactNode,
} from 'react';
import NextLink from 'next/link';
import WorkLink from '@weco/common/views/components/WorkLink/WorkLink';
import { FixedSizeList } from 'react-window';
import Icon from '../Icon/Icon';
import styled from 'styled-components';
import Space from '../styled/Space';

import { classNames, font } from '@weco/common/utils/classnames';
import LinkLabels from '../LinkLabels/LinkLabels';
import {
  getProductionDates,
  getDigitalLocationOfType,
} from '@weco/common/utils/works';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import useIIIFManifestData from '@weco/common/hooks/useIIIFManifestData';
import ViewerStructuresPrototype from '../ViewerStructuresPrototype/ViewerStructuresPrototype';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { DigitalLocation } from '@weco/common/model/catalogue';
import MultipleManifestListPrototype from '../MultipleManifestListPrototype/MultipleManifestListPrototype';
import IIIFSearchWithin from '../IIIFSearchWithin/IIIFSearchWithin';
import { getSearchService } from '../../../utils/iiif';

const Inner = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})`
  h1 {
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 10;
    overflow: hidden;
  }
`;

const AccordionInner = styled(Space).attrs({
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    [font('hnm', 5)]: true,
  }),
})`
  button {
    width: 100%;
    font-family: inherit;
    color: inherit;
    font-size: inherit;

    &:active,
    &:focus {
      outline: 0;
    }

    span {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  p {
    margin-bottom: 0.5em;
  }

  ul {
    list-style: none;
    margin: 0 0 1em;
    padding: 0;
  }

  li {
    padding: 0;
    margin: 0;
  }
`;

const Item = styled(Space).attrs({})`
  border-bottom: 1px solid ${props => props.theme.color('pewter')};

  &:first-child {
    border-top: 1px solid ${props => props.theme.color('pewter')};
  }
`;

const AccordionItem = ({
  title,
  children,
  testId,
}: {
  title: string;
  children: ReactNode;
  testId?: string;
}) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <Item data-test-id={testId}>
      <AccordionInner onClick={() => setIsActive(!isActive)}>
        <button
          className={classNames({
            'plain-button no-margin no-padding': true,
          })}
        >
          <span>
            <h2
              className={classNames({
                [font('hnm', 5)]: true,
                'no-margin': true,
              })}
            >
              {title}
            </h2>
            <Icon
              name={'chevron'}
              extraClasses={isActive ? 'icon--white' : 'icon--270 icon--white'}
            />
          </span>
        </button>
      </AccordionInner>
      <AccordionInner
        className={classNames({
          'is-hidden': !isActive,
        })}
      >
        {children}
      </AccordionInner>
    </Item>
  );
};
type Props = {
  mainViewerRef: RefObject<FixedSizeList>;
};

const ViewerSidebarPrototype: FunctionComponent<Props> = ({
  mainViewerRef,
}: Props) => {
  const {
    work,
    manifest,
    parentManifest,
    currentManifestLabel,
    setIsMobileSidebarActive,
  } = useContext(ItemViewerContext);
  const productionDates = getProductionDates(work);
  // Determine digital location
  const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');
  const iiifPresentationLocation = getDigitalLocationOfType(
    work,
    'iiif-presentation'
  );
  const digitalLocation: DigitalLocation | undefined =
    iiifPresentationLocation || iiifImageLocation;

  const license =
    digitalLocation &&
    digitalLocation.license &&
    getAugmentedLicenseInfo(digitalLocation.license);
  const { iiifCredit } = useIIIFManifestData(work);
  const searchService = manifest && getSearchService(manifest);
  const credit = (digitalLocation && digitalLocation.credit) || iiifCredit;

  return (
    <>
      <Inner
        className={classNames({
          [font('hnm', 5)]: true,
        })}
      >
        <button
          className={classNames({
            'plain-button no-marin no-padding font-white viewer-mobile': true,
            [font('hnm', 4)]: true,
          })}
          onClick={() => setIsMobileSidebarActive(false)}
        >
          <span className="visually-hidden">close item information</span>
          <Icon name={'cross'} extraClasses="icon--white" />
        </button>
        {currentManifestLabel && (
          <span
            data-test-id="current-manifest"
            className={classNames({
              [font('hnl', 5)]: true,
            })}
          >
            {currentManifestLabel}
          </span>
        )}
        <h1>{work.title}</h1>

        {work.contributors.length > 0 && (
          <Space
            h={{ size: 'm', properties: ['margin-right'] }}
            data-test-id="work-contributors"
          >
            <LinkLabels
              items={[
                {
                  text: work.contributors[0].agent.label,
                },
              ]}
            />
          </Space>
        )}

        {productionDates.length > 0 && (
          <div data-test-id="work-dates">
            <LinkLabels
              heading={'Date'}
              items={[
                {
                  text: productionDates[0],
                  url: null,
                },
              ]}
            />
          </div>
        )}

        <Space v={{ size: 'm', properties: ['margin-top'] }}>
          <WorkLink id={work.id} source="viewer_back_link">
            <a
              className={classNames({
                [font('hnl', 5)]: true,
                'flex flex--v-center': true,
              })}
            >
              Catalogue details
              <Space
                h={{ size: 's', properties: ['margin-left'] }}
                className="flex flex--v-center"
              >
                <Icon
                  name={`arrow`}
                  extraClasses={`icon--match-text icon--white`}
                />
              </Space>
            </a>
          </WorkLink>
        </Space>
      </Inner>
      <Inner>
        <AccordionItem
          title={'License and credit'}
          testId={'license-and-credit'}
        >
          <div className={font('hnl', 6)}>
            {license && license.label && (
              <p>
                <strong>License:</strong>{' '}
                {license.url ? (
                  <NextLink href={license.url}>
                    <a>{license.label}</a>
                  </NextLink>
                ) : (
                  <span>{license.label}</span>
                )}
              </p>
            )}
            <p>
              <strong>Credit:</strong> {work.title.replace(/\.$/g, '')}.
            </p>
            {credit && (
              <p>
                <WorkLink id={work.id} source={'viewer_credit'}>
                  <a>{credit}</a>
                </WorkLink>
                .
              </p>
            )}
          </div>
        </AccordionItem>
        {manifest && manifest.structures && manifest.structures.length > 0 && (
          <AccordionItem title={'Contents'}>
            <ViewerStructuresPrototype mainViewerRef={mainViewerRef} />
          </AccordionItem>
        )}
        {parentManifest && parentManifest.manifests && (
          <AccordionItem title={'Volumes'}>
            <MultipleManifestListPrototype />
          </AccordionItem>
        )}
      </Inner>

      {searchService && (
        <Inner>
          <IIIFSearchWithin mainViewerRef={mainViewerRef} />
        </Inner>
      )}
    </>
  );
};

export default ViewerSidebarPrototype;
