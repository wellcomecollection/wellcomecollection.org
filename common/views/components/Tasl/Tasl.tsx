import { FunctionComponent, MouseEvent, useContext, useState } from 'react';
import styled from 'styled-components';

import { cross, information } from '@weco/common/icons';
import { classNames, font } from '@weco/common/utils/classnames';
import { dasherizeShorten } from '@weco/common/utils/grammar';
import { getPrismicLicenseData } from '@weco/common/utils/licenses';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

type StyledTaslProps = {
  $positionAtTop: boolean;
  $isEnhanced: boolean;
};

const StyledTasl = styled.div.attrs({
  className: `${font('lr', 6)} plain-text tasl`, // Need the tasl class as it's used with ImageGallery styled components
})<StyledTaslProps>`
  text-align: right;
  top: ${props => (props.$positionAtTop ? 0 : 'auto')};
  bottom: ${props => (props.$positionAtTop ? 'auto' : 0)};
  left: 0;
  right: 0;
  z-index: 2;
  position: ${props => (props.$isEnhanced ? 'absolute' : 'static')};
`;

type TaslButtonProps = {
  $positionAtTop: boolean;
};

const TaslButton = styled.button<TaslButtonProps>`
  position: absolute;
  right: 0;
  top: ${props => (props.$positionAtTop ? '2px' : 'auto')};
  bottom: ${props => (props.$positionAtTop ? 'auto' : '2px')};
`;

type TaslIconProps = {
  $isEnhanced: boolean;
};
const TaslIcon = styled.span<TaslIconProps>`
  align-items: center;
  justify-content: center;
  background: rgb(29, 29, 29, 0.61);
  color: ${props => props.theme.color('white')};
  width: ${props => `${props.theme.iconDimension}px`};
  height: ${props => `${props.theme.iconDimension}px`};
  border-radius: 50%;
  display: ${props => (props.$isEnhanced ? 'flex' : 'inline')};
`;

const InfoContainer = styled(Space).attrs({
  $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 's', properties: ['padding-left'] },
})`
  color: ${props => props.theme.color('white')};
  background-color: ${props => props.theme.color('black')};
  padding-right: 36px;
`;

type MarkupProps = {
  title?: string;
  author?: string;
  sourceName?: string;
  sourceLink?: string;
  license?: string;
  copyrightHolder?: string;
  copyrightLink?: string;
  idSuffix?: string;
};

type TitleProps = { title?: string; author?: string; sourceLink?: string };

const Title: FunctionComponent<TitleProps> = ({
  title,
  author,
  sourceLink,
}) => {
  if (!title) return null;

  const byAuthor = author ? `, ${author}` : '';

  if (sourceLink) {
    return (
      <>
        <a href={sourceLink} rel="cc:attributionURL">
          {title}
          {byAuthor}
        </a>
        .{' '}
      </>
    );
  } else {
    return (
      <>
        <span>
          {title}
          {byAuthor}.
        </span>{' '}
      </>
    );
  }
};

type SourceProps = { sourceName?: string; sourceLink?: string };

const Source: FunctionComponent<SourceProps> = ({ sourceName, sourceLink }) => {
  if (!sourceName) return null;

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
};

type CopyrightProps = {
  copyrightHolder?: string;
  copyrightLink?: string;
};

const Copyright: FunctionComponent<CopyrightProps> = ({
  copyrightHolder,
  copyrightLink,
}) => {
  if (!copyrightHolder) return null;

  if (copyrightLink) {
    return (
      <>
        &copy; <a href={copyrightLink}>{copyrightHolder}</a>.{' '}
      </>
    );
  } else {
    return <>&copy; {copyrightHolder}. </>;
  }
};

type LicenseProps = { license?: string };

const License: FunctionComponent<LicenseProps> = ({ license }) => {
  const licenseData = license && getPrismicLicenseData(license);

  if (!licenseData) return null;

  return (
    <>
      <a rel="license" href={licenseData.url}>
        {licenseData.label}
      </a>
      .
    </>
  );
};

const Markup: FunctionComponent<MarkupProps> = ({
  title,
  author,
  sourceName,
  sourceLink,
  license,
  copyrightHolder,
  copyrightLink,
}) => {
  return (
    <>
      <Title title={title} author={author} sourceLink={sourceLink} />
      <Source sourceName={sourceName} sourceLink={sourceLink} />
      <Copyright
        copyrightHolder={copyrightHolder}
        copyrightLink={copyrightLink}
      />
      <License license={license} />
    </>
  );
};

export type Props = MarkupProps & {
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
  idSuffix = '',
}) => {
  const { isEnhanced } = useContext(AppContext);
  const [isActive, setIsActive] = useState(false);
  function toggleWithAnalytics(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    setIsActive(!isActive);
  }

  const id = title
    ? dasherizeShorten(title)
    : sourceName
      ? dasherizeShorten(sourceName)
      : copyrightHolder
        ? dasherizeShorten(copyrightHolder)
        : '';
  const idWithSuffix = `${id}${idSuffix}`;

  return [title, sourceName, copyrightHolder].some(_ => _) ? (
    <StyledTasl $positionAtTop={positionTop} $isEnhanced={isEnhanced}>
      <TaslButton
        onClick={toggleWithAnalytics}
        $positionAtTop={positionTop}
        aria-expanded={isActive}
        aria-controls={idWithSuffix}
      >
        <TaslIcon $isEnhanced={isEnhanced}>
          <Icon icon={isActive ? cross : information} iconColor="white" />
          <span className="visually-hidden">
            {isActive
              ? `hide credit information for image '${title}'`
              : `show credit information for image '${title}'`}
          </span>
        </TaslIcon>
      </TaslButton>
      <InfoContainer
        id={idWithSuffix}
        className={classNames({
          'is-hidden': isEnhanced && !isActive,
        })}
      >
        <Markup
          title={title}
          author={author}
          license={license}
          sourceName={sourceName}
          sourceLink={sourceLink}
          copyrightHolder={copyrightHolder}
          copyrightLink={copyrightLink}
        />
      </InfoContainer>
    </StyledTasl>
  ) : null;
};

export default Tasl;
