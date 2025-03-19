import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { accessibilityProvision } from '@weco/common/data/microcopy';
import {
  accessibleSquare,
  audioDescribedSquare,
  bslSquare,
  inductionLoopSquare,
} from '@weco/common/icons';
import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

// TODO icons size small screens header - why isn't this working?

// TODO fix iconwrapper error
// TODO new signed off text content
// TODO text changes in header
// commit everything so far
// TODO new icons

type StyleProps = { $showText: boolean };
const Text = styled.p.attrs<StyleProps>(props => ({
  className: !props.$showText ? `visually-hidden` : font('intr', 5),
}))`
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
  const { exhibitionAccessContent } = useToggles();

  return exhibitionAccessContent ? (
    <div style={{ display: 'flex', flexWrap: 'wrap', rowGap: '10px' }}>
      <IconsContainer
        $showText={showText}
        aria-hidden={showText ? 'true' : 'false'}
        aria-labbelledby={!showText ? 'accessibility-provision' : null}
      >
        <Icon icon={accessibleSquare} />
        <Icon icon={bslSquare} />
        <Icon icon={audioDescribedSquare} />
        <Icon icon={inductionLoopSquare} />
      </IconsContainer>
      <Text $showText={showText} id="accessibility-provision">
        {accessibilityProvision}
      </Text>
    </div>
  ) : null;
};

export default AccessibilityProvision;
