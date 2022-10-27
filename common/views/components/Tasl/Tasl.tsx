import { FunctionComponent, ReactElement, useContext, useState } from 'react';
import { font, classNames } from '../../../utils/classnames';
import { getPrismicLicenseData } from '../../../utils/licenses';
import { trackEvent } from '../../../utils/ga';
import { AppContext } from '../../components/AppContext/AppContext';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';
import styled from 'styled-components';
import { cross, information } from '@weco/common/icons';

type StyledTaslProps = {
  positionAtTop: boolean;
  isEnhanced: boolean;
};

const StyledTasl = styled.div.attrs({
  className: `${font('lr', 6)} plain-text tasl`, // Need the tasl class as it's used with ImageGallery styled components
})<StyledTaslProps>`
  text-align: right;
  top: ${props => (props.positionAtTop ? 0 : 'auto')};
  bottom: ${props => (props.positionAtTop ? 'auto' : 0)};
  left: 0;
  right: 0;
  z-index: 2;
  position: ${props => (props.isEnhanced ? 'absolute' : 'static')};
`;

type TaslButtonProps = {
  positionAtTop: boolean;
};

const TaslButton = styled.button.attrs({
  className: 'plain-button',
})<TaslButtonProps>`
  position: absolute;
  right: 0;
  top: ${props => (props.positionAtTop ? '2px' : 'auto')};
  bottom: ${props => (props.positionAtTop ? 'auto' : '2px')};
`;

type TaslIconProps = {
  isEnhanced: boolean;
};
const TaslIcon = styled.span<TaslIconProps>`
  align-items: center;
  justify-content: center;
  background: rgba(29, 29, 29, 0.61);
  color: ${props => props.theme.color('white')};
  width: ${props => `${props.theme.iconDimension}px`};
  height: ${props => `${props.theme.iconDimension}px`};
  border-radius: 50%;
  display: ${props => (props.isEnhanced ? 'flex' : 'inline')};
`;

const InfoContainer = styled(Space).attrs({
  v: {
    size: 's',
    properties: ['padding-top', 'padding-bottom'],
  },
  h: { size: 's', properties: ['padding-left'] },
})`
  color: ${props => props.theme.color('white')};
  background-color: ${props => props.theme.color('black')};
  padding-right: 36px;
`;

export type MarkUpProps = {
  title?: string;
  author?: string;
  sourceName?: string;
  sourceLink?: string;
  license?: string;
  copyrightHolder?: string;
  copyrightLink?: string;
};

function getMarkup({
  title,
  author,
  sourceName,
  sourceLink,
  license,
  copyrightHolder,
  copyrightLink,
}: MarkUpProps) {
  return (
    <>
      {getTitleHtml(title, author, sourceLink)}
      {getSourceHtml(sourceName, sourceLink)}
      {getCopyrightHtml(copyrightHolder, copyrightLink)}
      {getLicenseHtml(license)}
    </>
  );
}

function getTitleHtml(
  title?: string,
  author?: string,
  sourceLink?: string
): ReactElement | undefined {
  if (!title) return;

  const byAuthor = author ? `, ${author}` : '';

  if (sourceLink) {
    return (
      <>
        <a href={sourceLink} property="dc:title" rel="cc:attributionURL">
          {title}
          {byAuthor}
        </a>
        .{' '}
      </>
    );
  } else {
    return (
      <>
        <span property="dc:title">
          {title}
          {byAuthor}.
        </span>{' '}
      </>
    );
  }
}

function getSourceHtml(
  sourceName?: string,
  sourceLink?: string
): ReactElement | undefined {
  if (!sourceName) return;

  if (sourceLink) {
    return (
      <>
        Source:{' '}
        <a href={sourceLink} rel="cc:attributionURL">
          {sourceName}
        </a>
        .{' '}
      </>
    );
  } else {
    return <>Source: {sourceName}. </>;
  }
}

function getCopyrightHtml(
  copyrightHolder?: string,
  copyrightLink?: string
): ReactElement | undefined {
  if (!copyrightHolder) return;

  if (copyrightLink) {
    return (
      <>
        &copy; <a href={copyrightLink}>{copyrightHolder}</a>.{' '}
      </>
    );
  } else {
    return <>&copy; {copyrightHolder}. </>;
  }
}

function getLicenseHtml(license?: string): ReactElement | undefined {
  const licenseData = license && getPrismicLicenseData(license);

  if (!licenseData) return;

  return (
    <>
      <a rel="license" href={licenseData.url}>
        {licenseData.label}
      </a>
      .
    </>
  );
}

export type Props = MarkUpProps & {
  positionTop?: boolean;
};

const Tasl: FunctionComponent<Props> = ({
  positionTop = false,
  title,
  author,
  sourceName,
  sourceLink,
  license,
  copyrightHolder,
  copyrightLink,
}: Props) => {
  const { isEnhanced } = useContext(AppContext);
  const [isActive, setIsActive] = useState(false);
  function toggleWithAnalytics(event) {
    event.preventDefault();
    trackEvent({
      category: 'Tasl',
      action: isActive ? 'closed' : 'opened',
      label: title || 'no title',
    });

    setIsActive(!isActive);
  }

  return [title, sourceName, copyrightHolder].some(_ => _) ? (
    <StyledTasl positionAtTop={positionTop} isEnhanced={isEnhanced}>
      <TaslButton
        onClick={toggleWithAnalytics}
        positionAtTop={positionTop}
        aria-expanded={isActive}
        aria-controls={title || sourceName || copyrightHolder || ''}
      >
        <TaslIcon isEnhanced={isEnhanced}>
          <Icon icon={isActive ? cross : information} iconColor="white" />
          <span className="visually-hidden">
            {isActive
              ? `hide credit information for image '${title}'`
              : `show credit information for image '${title}'`}
          </span>
        </TaslIcon>
      </TaslButton>
      <InfoContainer
        id={title || sourceName || copyrightHolder || ''}
        className={classNames({
          'is-hidden': isEnhanced && !isActive,
        })}
      >
        {getMarkup({
          title,
          author,
          sourceName,
          sourceLink,
          license,
          copyrightHolder,
          copyrightLink,
        })}
      </InfoContainer>
    </StyledTasl>
  ) : null;
};

export default Tasl;
