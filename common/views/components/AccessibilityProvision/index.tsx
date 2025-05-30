import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { accessibilityProvisionText } from '@weco/common/data/microcopy';
import {
  accessibleSquare,
  audioDescribedSquare,
  bslSquare,
  closedCaptioningSquare,
} from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

type StyleProps = { $showText: boolean };

const Text = styled.p`
  margin: 0;
  align-content: center;
`;

const IconsContainer = styled(Space).attrs({
  $h: { size: 's', properties: ['margin-right'] },
})<StyleProps>`
  display: flex;

  .icon {
    display: block;
    margin-right: 4px;
    width: ${props => (!props.$showText ? '24px' : '32px')};
    height: ${props => (!props.$showText ? '24px' : '32px')};

    ${props => props.theme.media('medium')`
      width: 32px;
      height: 32px;
    `}
  }
`;

type Props = {
  showText?: boolean;
};

const AccessibilityProvision: FunctionComponent<Props> = ({
  showText = true,
}) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: '10px' }}>
      <IconsContainer
        $showText={showText}
        aria-hidden={showText ? 'true' : 'false'}
        aria-labelledby={!showText ? 'accessibility-provision' : undefined}
      >
        <Icon icon={accessibleSquare} />
        <Icon icon={bslSquare} />
        <Icon icon={audioDescribedSquare} />
        <Icon icon={closedCaptioningSquare} />
      </IconsContainer>
      <Text
        className={!showText ? `visually-hidden` : font('intr', 5)}
        id="accessibility-provision"
      >
        {accessibilityProvisionText}
      </Text>
    </div>
  );
};

export default AccessibilityProvision;
