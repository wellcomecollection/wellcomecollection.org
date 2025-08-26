import { FunctionComponent, MouseEvent, useState } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { cross, information } from '@weco/common/icons';
import { classNames } from '@weco/common/utils/classnames';
import { dasherizeShorten } from '@weco/common/utils/grammar';
import Icon from '@weco/common/views/components/Icon';

import TaslMarkup, { MarkupProps } from './Tasl.Markup';
import { InfoContainer, StyledTasl, TaslButton, TaslIcon } from './Tasl.styles';

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
  const { isEnhanced } = useAppContext();
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
    <StyledTasl
      data-component="tasl"
      $positionAtTop={positionTop}
      $isEnhanced={isEnhanced}
    >
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
        <TaslMarkup
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
