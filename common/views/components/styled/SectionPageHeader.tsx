import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';

type Props = {
  sectionLevelPage: boolean;
};

export const SectionPageHeader = styled.h1.attrs<Props>(props => ({
  className: classNames({
    'inline-block no-margin': true,
    [font('wb', props.sectionLevelPage ? 0 : 1)]: true,
  }),
}))<Props>``;
