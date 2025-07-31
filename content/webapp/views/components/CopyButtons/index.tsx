import { FunctionComponent } from 'react';

import CopyContent, { Props as CopyContentProps } from './CopyButtons.Content';
import CopyUrl, { Props as CopyUrlProps } from './CopyButtons.Url';

type Props =
  | (CopyContentProps & { variant: 'content' })
  | (CopyUrlProps & { variant: 'url' });

const CopyButtons: FunctionComponent<Props> = props => {
  const { variant } = props;

  return (
    <div data-component="copy-buttons">
      {variant === 'content' ? (
        <CopyContent {...props} />
      ) : (
        <CopyUrl {...props} />
      )}
    </div>
  );
};

export default CopyButtons;
