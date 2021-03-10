import { FunctionComponent, useState } from 'react';
import WorkLink from '../WorkLink/WorkLink';
import Icon from '../Icon/Icon';
import styled from 'styled-components';
import Space from '../styled/Space';
import TextInput from '../TextInput/TextInput';
import { classNames, font } from '@weco/common/utils/classnames';
import LinkLabels from '../LinkLabels/LinkLabels';
import {
  getProductionDates,
  getDigitalLocationOfType,
} from '@weco/common/utils/works';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import useIIIFManifestData from '@weco/common/hooks/useIIIFManifestData';

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
`;

const AccordionItem = ({ title, children }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Item>
      <AccordionInner onClick={() => setIsActive(!isActive)}>
        <button className={'plain-button no-margin no-padding'}>
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
  workId: string;
  title: string;
  work: any;
};

const ViewerSidebarPrototype: FunctionComponent<Props> = ({
  workId,
  title,
  work,
}: Props) => {
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

  return (
    <>
      <Inner
        className={classNames({
          [font('hnm', 5)]: true,
        })}
      >
        <h1>{title}</h1>

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

        <WorkLink id={workId} source="viewer_back_link">
          <Space v={{ size: 'm', properties: ['margin-top'] }}>
            <a
              className={classNames({
                'flex flex--v-center': true,
              })}
            >
              Back to full information
            </a>
          </Space>
        </WorkLink>
      </Inner>
      <div>
        <AccordionItem title={'License and credit'}>
          <div className={font('hnl', 6)}>
            <span>{license && [license.label]}</span>
            {license.humanReadableText.length > 0 && (
              <span>{license.humanReadableText}</span>
            )}
            `Credit: ${work.title.replace(/\.$/g, '')}.$ $
            {credit
              ? `Credit: <a href="https:wellcomecollection.org/works/${work.id}">${credit}</a>. `
              : ` `}
            $
            {license.url
              ? `<a href="${license.url}">${license.label}</a>`
              : license.label}
            `
          </div>
        </AccordionItem>
        <AccordionItem title={'Contents'}>
          <ul className={font('hnm', 6)}>
            <li>
              <a href="#">Cover</a>
            </li>
            <li>
              <a href="#">Title page</a>
            </li>
            <li>
              <a href="#">Table of contents</a>
            </li>
            <li>
              <a href="#">Date 1484</a>
            </li>
            <li>
              <a href="#">Medical receipts</a>
            </li>
            <li>
              <a href="#">Astrological and astronomical notes</a>
            </li>
            <li>
              <a href="#">Cover</a>
            </li>
          </ul>
        </AccordionItem>
        <AccordionItem title={'Search within this item'}>
          <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
            <TextInput
              id={'newsletter-input'}
              type={'text'}
              name={'test'}
              label={'enter search term'}
              value={inputValue}
              setValue={setInputValue}
            />
          </Space>
        </AccordionItem>
      </div>
    </>
  );
};

export default ViewerSidebarPrototype;
