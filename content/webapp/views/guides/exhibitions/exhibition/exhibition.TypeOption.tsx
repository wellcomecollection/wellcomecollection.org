import { setCookie } from 'cookies-next';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import cookies from '@weco/common/data/cookies';
import { arrow } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { CardBody } from '@weco/common/views/components/Card';
import RelevantGuideIcons from '@weco/common/views/components/ExhibitionGuideRelevantIcons';
import Icon from '@weco/common/views/components/Icon';
import { plainListStyles } from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { PaletteColor } from '@weco/common/views/themes/config';
import { ExhibitionGuideType } from '@weco/content/types/exhibition-guides';

export const TypeList = styled(Space).attrs({
  $v: { size: 'l', properties: ['row-gap'] },
  $h: { size: 'l', properties: ['column-gap'] },
})`
  ${plainListStyles};
  display: grid;

  ${props => props.theme.media('medium')`
    grid-template-columns: 1fr 1fr;
  `}
`;

const TypeItem = styled.li`
  flex: 0 0 100%;
  position: relative;
  ${props => props.theme.media('medium')`
      flex-basis: calc(50% - 25px);
    `}
`;

const TypeLink = styled.a<{
  $backgroundColor: PaletteColor;
}>`
  display: block;
  height: 100%;
  width: 100%;
  text-decoration: none;
  border-radius: 6px;
  background: ${props => props.theme.color(props.$backgroundColor)};

  &:hover {
    text-decoration: underline;
  }
`;

const TypeIconsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

// TODO Review how this can be streamlined when we move to the new EG models
// https://github.com/wellcomecollection/wellcomecollection.org/issues/11181
type Props = {
  url: string;
  title: string;
  type: ExhibitionGuideType;
};

const TypeOption: FunctionComponent<Props> = ({ url, title, type }) => {
  const onClick = () => {
    // We set the cookie to expire in 8 hours (the maximum length of
    // time the galleries are open in a day)
    setCookie(cookies.exhibitionGuideType, type, {
      maxAge: 8 * 60 * 60,
      path: '/',
      secure: true,
    });
  };

  return (
    <TypeItem>
      <TypeLink href={url} $backgroundColor="warmNeutral.300" onClick={onClick}>
        <CardBody style={{ height: '100%' }}>
          <h2 className={font('wb', 3)}>{title}</h2>

          <TypeIconsWrapper>
            <RelevantGuideIcons types={[type]} />

            <Icon icon={arrow} sizeOverride="height: 32px; width: 32px;" />
          </TypeIconsWrapper>
        </CardBody>
      </TypeLink>
    </TypeItem>
  );
};

export default TypeOption;
