import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import Space from '@weco/common/views/components/styled/Space';

export type ThemeCardsListProps = SliceComponentProps<RawThemeCardsListSlice>;

const ThemeCardsList: FunctionComponent<ThemeCardsListProps> = ({ slice }) => {
  console.log(slice);
  return (
    <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
      <p>hi</p>
    </Space>
  );
};

export default ThemeCardsList;
