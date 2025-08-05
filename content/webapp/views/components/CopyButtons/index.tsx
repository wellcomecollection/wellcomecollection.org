import { FunctionComponent } from 'react';

import CopyContent, { Props as CopyContentProps } from './CopyButtons.Content';
import CopyUrl, { Props as CopyUrlProps } from './CopyButtons.Url';

type Props =
  | (CopyContentProps & { variant: 'content' })
  | (CopyUrlProps & { variant: 'url' });

const CopyButtons: FunctionComponent<Props> = props => {
  const { variant } = props;

  return (
    <>
      {variant === 'content' ? (
        <CopyContent data-component="copy-content" {...props} />
      ) : (
        <CopyUrl data-component="copy-url" {...props} />
      )}
    </>
  );
};

export default CopyButtons;
