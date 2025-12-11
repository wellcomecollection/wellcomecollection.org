import { ComponentType, FunctionComponent, PropsWithChildren } from 'react';
import { ThemeProvider } from 'styled-components';

import { AppContextProvider } from '@weco/common/contexts/AppContext';
import Space from '@weco/common/views/components/styled/Space';
import theme, { GlobalStyle } from '@weco/common/views/themes/default';

export const ContextDecorator: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle isFontsLoaded={true} />
      <AppContextProvider>
        <div className="enhanced">{children}</div>
      </AppContextProvider>
    </ThemeProvider>
  );
};

export const ReadMeInfo = ({ Readme }: { Readme: ComponentType }) => {
  return (
    <Space
      data-chromatic="ignore"
      $v={{
        size: 'xl',
        properties: ['margin-top'],
      }}
      $h={{ size: 'sm', properties: ['padding-left', 'padding-right'] }}
      className="body-text"
      style={{
        border: '1px solid #eee',
        borderRadius: '6px',
        transform: 'scale(0.8)',
        transformOrigin: 'top left',
        position: 'relative',
      }}
    >
      <span
        id="readme"
        style={{
          position: 'absolute',
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#aaa',
          top: '-10px',
          padding: '0 6px',
          background: '#fff',
        }}
      >
        README
      </span>
      <Space $v={{ size: 'sm', properties: ['padding-top'] }}>
        <Readme />
      </Space>
    </Space>
  );
};

type ReadmeDecoratorProps = PropsWithChildren<{
  WrappedComponent: ComponentType | ComponentType<PropsWithChildren>;
  args?: Record<string, unknown>;
  Readme: ComponentType;
  order?: 'componentFirst' | 'readmeFirst';
}>;

export const ReadmeDecorator: FunctionComponent<ReadmeDecoratorProps> = ({
  WrappedComponent,
  args,
  Readme,
  order = 'componentFirst',
  children,
}) => {
  return (
    <div>
      {order === 'readmeFirst' && <ReadMeInfo Readme={Readme} />}

      <WrappedComponent {...args}>{children}</WrappedComponent>

      {order === 'componentFirst' && <ReadMeInfo Readme={Readme} />}
    </div>
  );
};
