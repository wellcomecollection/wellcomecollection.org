import { FunctionComponent, useState, useContext } from 'react';
import WorkLink from '@weco/common/views/components/WorkLink/WorkLink';
import Icon from '@weco/common/views/components/Icon/Icon';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import TextInput from '@weco/common/views/components/TextInput/TextInput';
import { classNames, font } from '@weco/common/utils/classnames';
import LinkLabels from '@weco/common/views/components/LinkLabels/LinkLabels';
import {
  getProductionDates,
  getDigitalLocationOfType,
} from '@weco/common/utils/works';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import useIIIFManifestData from '@weco/common/hooks/useIIIFManifestData';
import ViewerStructuresPrototype from '@weco/common/views/components/ViewerStructuresPrototype/ViewerStructuresPrototype';
import ItemViewerContext from '@weco/common/views/components/ItemViewerContext/ItemViewerContext';
import { DigitalLocation } from '@weco/common/model/catalogue';
import MultipleManifestListPrototype from '../MultipleManifestListPrototype/MultipleManifestListPrototype';
import IIIFSearchWithin from '../IIIFSearchWithin/IIIFSearchWithin';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';

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
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
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

const Item = styled.div`
  border-bottom: 1px solid ${props => props.theme.color('charcoal')};

  &:first-child {
    border-top: 1px solid ${props => props.theme.color('charcoal')};
  }
`;

const AccordionItem = ({ title, children }) => {
  const [isActive, setIsActive] = useState(false);
  return (
    <Item>
      <AccordionInner
        onClick={() => setIsActive(!isActive)}
        className={classNames({
          'bg-charcoal': isActive,
        })}
      >
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
  mainViewerRef: any;
};

const ViewerSidebarPrototype: FunctionComponent<Props> = ({
  mainViewerRef,
}: Props) => {
  const {
    work,
    manifest,
    parentManifest,
    currentManifestLabel,
    isMobile,
    setIsMobileSidebarActive,
  } = useContext(ItemViewerContext);
  const productionDates = getProductionDates(work);
  const [inputValue, setInputValue] = useState('');
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
  const credit = (digitalLocation && digitalLocation.credit) || iiifCredit;
  const { itemViewerPrototypeWithSearch } = useContext(TogglesContext);
  return (
    <>
      <Inner
        className={classNames({
          [font('hnm', 5)]: true,
        })}
      >
        {isMobile && (
          <button
            className={classNames({
              'plain-button no-marin no-padding font-white': true,
              [font('hnm', 4)]: true,
            })}
            onClick={() => setIsMobileSidebarActive(false)}
          >
            <span className="visually-hidden">close item information</span>
            <Icon name={'cross'} extraClasses="icon--white" />
          </button>
        )}
        {currentManifestLabel && (
          <span
            className={classNames({
              [font('hnl', 5)]: true,
            })}
          >
            {currentManifestLabel}
          </span>
        )}
        <h1>{work.title}</h1>

        {work.contributors.length > 0 && (
          <Space h={{ size: 'm', properties: ['margin-right'] }}>
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
          <LinkLabels
            heading={'Date'}
            items={[
              {
                text: productionDates[0],
                url: null,
              },
            ]}
          />
        )}

        <Space v={{ size: 'm', properties: ['margin-top'] }}>
          <WorkLink id={work.id} source="viewer_back_link">
            <a
              className={classNames({
                'flex flex--v-center font-yellow': true,
              })}
            >
              Back to full information
            </a>
          </WorkLink>
        </Space>
      </Inner>
      <div>
        <AccordionItem title={'License and credit'}>
          <div className={font('hnl', 6)}>
            {license && license.label && (
              <p>
                <strong>License:</strong>{' '}
                {license.url ? (
                  <a href="{license.url}">{license.label}</a>
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
                <a href="https:wellcomecollection.org/works/{work.id}">
                  {credit}
                </a>
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
        {/* // TODO only if search service available */}
        <AccordionItem title={'Search within this item'}>
          <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
            {itemViewerPrototypeWithSearch ? (
              <IIIFSearchWithin mainViewerRef={mainViewerRef} />
            ) : (
              <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
                <TextInput
                  id={'test'}
                  type={'text'}
                  name={'test'}
                  label={'enter search term'}
                  value={inputValue}
                  setValue={setInputValue}
                />
              </Space>
            )}
          </Space>
        </AccordionItem>
      </div>
    </>
  );
};

export default ViewerSidebarPrototype;
