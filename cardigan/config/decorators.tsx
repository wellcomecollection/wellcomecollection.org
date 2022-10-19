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

export const ReadmeDecordator: FC<ReadmeDecoratorProps> = ({
  WrappedComponent,
  args,
  Readme,
}) => {
  return (
    <>
      <WrappedComponent {...args} />
      <Space v={{ size: 'l', properties: ['margin-top'] }}>
        <Readme />
      </Space>
    </>
  );
};
