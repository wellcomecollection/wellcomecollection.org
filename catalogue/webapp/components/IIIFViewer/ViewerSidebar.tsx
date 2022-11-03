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
import Icon from '@weco/common/views/components/Icon/Icon';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { classNames, font } from '@weco/common/utils/classnames';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import {
  getProductionDates,
  getDigitalLocationOfType,
} from '../../utils/works';
import { getCatalogueLicenseData } from '@weco/common/utils/licenses';
import ViewerStructures from './ViewerStructures';
import ItemViewerContext from '../ItemViewerContext/ItemViewerContext';
import { DigitalLocation } from '@weco/common/model/catalogue';
import MultipleManifestList from './MultipleManifestList';
import IIIFSearchWithin from '../IIIFSearchWithin/IIIFSearchWithin';
import WorkTitle from '../WorkTitle/WorkTitle';
import { toHtmlId } from '@weco/common/utils/string';
import { arrow, chevron } from '@weco/common/icons';

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
  className: font('intb', 5),
})`
  button {
    width: 100%;
    font-family: inherit;
    color: inherit;
    font-size: inherit;

    &:active,
    &:focus {
      outline: 0;
      box-shadow: ${props => props.theme.focusBoxShadow};
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
`;

const Item = styled.div`
  border-bottom: 1px solid ${props => props.theme.color('neutral.600')};

  &:first-child {
    border-top: 1px solid ${props => props.theme.color('neutral.600')};
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
          className="plain-button no-margin no-padding"
          aria-expanded={isActive ? 'true' : 'false'}
          aria-controls={toHtmlId(title)}
        >
          <span>
            <h2 className={`${font('intb', 5)} no-margin`}>{title}</h2>
            <Icon
              icon={chevron}
              iconColor="white"
              rotate={isActive ? undefined : 270}
            />
          </span>
        </button>
      </AccordionInner>
      <AccordionInner
        id={toHtmlId(title)}
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

const ViewerSidebar: FunctionComponent<Props> = ({ mainViewerRef }: Props) => {
  const { work, transformedManifest, parentManifest, currentManifestLabel } =
    useContext(ItemViewerContext);
  const { iiifCredit, structures, searchService } = transformedManifest;
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
    digitalLocation?.license &&
    getCatalogueLicenseData(digitalLocation.license);

  const credit = (digitalLocation && digitalLocation.credit) || iiifCredit;

  return (
    <>
      <Inner className={font('intb', 5)}>
        {currentManifestLabel && (
          <span data-test-id="current-manifest" className={font('intr', 5)}>
            {currentManifestLabel}
          </span>
        )}
        <h1>
          <WorkTitle title={work.title} />
        </h1>

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
              heading="Date"
              items={[
                {
                  text: productionDates[0],
                  url: null,
                },
              ]}
            />
          </div>
        )}

        {work.referenceNumber && (
          <div data-test-id="reference-number">
            <LinkLabels
              heading="Reference"
              items={[
                {
                  text: work.referenceNumber,
                  url: null,
                },
              ]}
            />
          </div>
        )}

        <Space v={{ size: 'm', properties: ['margin-top'] }}>
          <WorkLink id={work.id} source="viewer_back_link">
            <a className={`${font('intr', 5)} flex flex--v-center`}>
              Catalogue details
              <Space
                h={{ size: 's', properties: ['margin-left'] }}
                className="flex flex--v-center"
              >
                <Icon icon={arrow} matchText={true} iconColor="white" />
              </Space>
            </a>
          </WorkLink>
        </Space>
      </Inner>
      <Inner>
        <AccordionItem title="Licence and credit" testId="license-and-credit">
          <div className={font('intr', 6)}>
            {license && license.label && (
              <p>
                <strong>Licence:</strong>{' '}
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
                <WorkLink id={work.id} source="viewer_credit">
                  <a>{credit}</a>
                </WorkLink>
                .
              </p>
            )}
          </div>
        </AccordionItem>

        {structures.length > 0 && (
          <AccordionItem title="Contents">
            <ViewerStructures mainViewerRef={mainViewerRef} />
          </AccordionItem>
        )}
        {parentManifest &&
          parentManifest.behavior?.[0] === 'multi-part' &&
          parentManifest.items && (
            <AccordionItem title="Volumes">
              <MultipleManifestList />
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

export default ViewerSidebar;
