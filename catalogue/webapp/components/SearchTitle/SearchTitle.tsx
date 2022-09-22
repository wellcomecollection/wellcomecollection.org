import { FunctionComponent, ReactElement } from 'react';
import { grid, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  isVisuallyHidden: boolean;
};

const SearchTitle: FunctionComponent<Props> = ({
  isVisuallyHidden,
}): ReactElement => {
  return (
    <div
      className={classNames({
        grid: true,
        'visually-hidden': isVisuallyHidden,
      })}
    >
      <div className={grid({ s: 12, m: 12, l: 12, xl: 12 })}>
        <Space
          v={{
            size: 'm',
            properties: ['margin-bottom'],
          }}
          className="flex flex--h-space-between flex--v-center flex--wrap"
        >
          <Space
            as="h1"
            v={{ size: 'm', properties: ['margin-top', 'margin-bottom'] }}
            className="h1"
          >
            Search the collections
          </Space>
        </Space>
      </div>
    </div>
  );
};

export default SearchTitle;
