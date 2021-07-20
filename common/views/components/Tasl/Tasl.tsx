import { FunctionComponent, useContext, useState } from 'react';
import { font, classNames } from '../../../utils/classnames';
import { getLicenseInfo } from '../../../utils/licenses';
import { trackEvent } from '../../../utils/ga';
import { AppContext } from '../../components/AppContext/AppContext';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';
import styled from 'styled-components';

type StyledTaslProps = {
  positionAtTop: boolean;
  isEnhanced: boolean;
};

const StyledTasl = styled.div.attrs({
  className: `${font('lr', 6)} plain-text tasl`, // Still need the tasl class as it's used with .image-gallery-v2 styles
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
  className: 'plain-button absolute',
})<TaslButtonProps>`
  right: 0;
  top: ${props => (props.positionAtTop ? '2px' : 'auto')};
  bottom: ${props => (props.positionAtTop ? 'auto' : '2px')};
`;

type TaslIconProps = {
  isEnhanced: boolean;
};
const TaslIcon = styled.span.attrs({
  className: 'flex--v-center flex--h-center bg-transparent-black font-white',
})<TaslIconProps>`
  width: ${props => `${props.theme.iconDimension}px`};
  height: ${props => `${props.theme.iconDimension}px`};
  border-radius: 50%;
  display: ${props => (props.isEnhanced ? 'flex' : 'inline')};
`;

type MarkUpProps = {
  title?: string | null;
  author?: string | null;
  sourceName?: string | null;
  sourceLink?: string | null;
  license?: string | null;
  copyrightHolder?: string | null;
  copyrightLink?: string | null;
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
  const licenseInfo = license && getLicenseInfo(license);

  return (
    <>
      {getTitleHtml(title, author, sourceLink)}
      {getSourceHtml(sourceName, sourceLink)}
      {getCopyrightHtml(copyrightHolder, copyrightLink)}
      {licenseInfo && (
        <>
          <a rel="license" href={licenseInfo.url}>
            {licenseInfo.label}
          </a>
          .
        </>
      )}
    </>
  );
}

function getTitleHtml(title, author, sourceLink) {
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

function getSourceHtml(sourceName, sourceLink) {
  if (!sourceName) return '';

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

function getCopyrightHtml(copyrightHolder, copyrightLink) {
  if (!copyrightHolder) return '';

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

export type Props = MarkUpProps & {
  isFull: boolean;
  isActive: boolean;
  toggle: () => void;
};

const Tasl: FunctionComponent<Props> = ({
  isFull,
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
    <StyledTasl positionAtTop={isFull} isEnhanced={isEnhanced}>
      <TaslButton
        onClick={toggleWithAnalytics}
        positionAtTop={isFull}
        aria-expanded={isActive}
        aria-controls={title || sourceName || copyrightHolder || ''}
      >
        <TaslIcon isEnhanced={isEnhanced}>
          <Icon name={isActive ? 'cross' : 'information'} color={'white'} />
          <span className="visually-hidden">
            {isActive
              ? `hide credit information for image '${title}'`
              : `show credit information for image '${title}'`}
          </span>
        </TaslIcon>
      </TaslButton>
      <Space
        id={title || sourceName || copyrightHolder || ''}
        v={{
          size: 's',
          properties: ['padding-top', 'padding-bottom'],
        }}
        h={{ size: 's', properties: ['padding-left'] }}
        className={classNames({
          'bg-black font-white': true,
          'is-hidden': isEnhanced && !isActive,
        })}
        style={{ paddingRight: '36px' }}
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
      </Space>
    </StyledTasl>
  ) : null;
};

export default Tasl;
