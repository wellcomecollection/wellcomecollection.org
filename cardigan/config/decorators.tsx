import { ReactNode, ComponentType, FC } from 'react';
import { ThemeProvider } from 'styled-components';
import theme, { GlobalStyle } from '@weco/common/views/themes/default';
import { AppContextProvider } from '@weco/common/views/components/AppContext/AppContext';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  children: ReactNode;
};
export const ContextDecorator: FC<Props> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle isFontsLoaded={true} />
      <AppContextProvider>
        <div className="enhanced">{children}</div>
      </AppContextProvider>
    </ThemeProvider>
  );
};

type ReadmeDecoratorProps = {
  WrappedComponent: ComponentType;
  args: Record<string, unknown>;
  Readme: ComponentType;
};

export const ReadmeDecorator: FC<ReadmeDecoratorProps> = ({
  WrappedComponent,
  args,
  Readme,
}) => {
  return (
    <>
      <WrappedComponent {...args} />
      <Space
        v={{
          size: 'xl',
          properties: ['margin-top'],
        }}
        h={{ size: 'm', properties: ['padding-left', 'padding-right'] }}
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
        <Space v={{ size: 'm', properties: ['padding-top'] }}>
          <Readme />
        </Space>
      </Space>
    </>
  );
};
