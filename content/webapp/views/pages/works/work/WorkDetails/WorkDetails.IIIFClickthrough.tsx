import { FunctionComponent, PropsWithChildren } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import useShowClickthrough from '@weco/content/hooks/useShowClickthrough';
import { TransformedAuthService } from '@weco/content/utils/iiif/v3';
const IframeAuthMessage = styled.iframe`
  display: none;
`;
const iframeId = 'authMessage';
function reloadAuthIframe(document: Document, id: string) {
  const authMessageIframe = document.getElementById(id) as HTMLIFrameElement;

  // assigning the iframe src to itself reloads the iframe and refires the window.message event
  // eslint-disable-next-line no-self-assign
  authMessageIframe.src = authMessageIframe.src;
}

type Props = PropsWithChildren<{
  clickThroughService?: TransformedAuthService;
  tokenService: string;
  origin?: string;
}>;

const IIIFClickthrough: FunctionComponent<Props> = ({
  clickThroughService,
  tokenService,
  origin,
  children,
}) => {
  const showClickthroughMessage = useShowClickthrough(
    clickThroughService,
    tokenService
  );

  return clickThroughService && tokenService ? (
    <>
      {tokenService && origin && (
        <IframeAuthMessage
          id={iframeId}
          title="IIIF Authentication iframe for cross-domain messaging"
          src={tokenService}
        />
      )}
      {showClickthroughMessage ? (
        <div className={font('intr', -1)}>
          {clickThroughService?.label && (
            <h2 className={font('intsb', 0)}>{clickThroughService?.label}</h2>
          )}
          {clickThroughService?.description && (
            <p
              dangerouslySetInnerHTML={{
                __html: clickThroughService?.description,
              }}
            />
          )}
          {clickThroughService?.id && origin && (
            <Space as="span" $h={{ size: 'm', properties: ['margin-right'] }}>
              <Button
                variant="ButtonSolid"
                dataGtmProps={{ trigger: 'show_the_content' }}
                text="Show the content"
                clickHandler={() => {
                  const authServiceWindow = window.open(
                    `${clickThroughService?.id || ''}?origin=${origin}`
                  );
                  authServiceWindow &&
                    authServiceWindow.addEventListener('unload', function () {
                      reloadAuthIframe(document, iframeId);
                    });
                }}
              />
            </Space>
          )}
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  ) : null;
};

export default IIIFClickthrough;
