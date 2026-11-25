import { useEffect, useState } from 'react';

export type ToggleMessage = {
  text: string;
  isError?: boolean;
  isEnabled?: boolean;
};

export const MESSAGE_TIMEOUT_MS = 20_000;

/** The floating message, which clears itself after a while unless it's an error. */
export const useFloatingMessage = () => {
  const [message, setMessage] = useState<ToggleMessage | null>(null);

  // Changes with each new message so the timer line on it starts over
  const [messageKey, setMessageKey] = useState(0);
  useEffect(() => {
    setMessageKey(key => key + 1);
  }, [message]);

  // Messages float, so clear them after a while. Errors stay until
  // dismissed - e.g. a failed load would otherwise leave a blank page.
  useEffect(() => {
    if (!message || message.isError) return;
    const timeout = setTimeout(() => setMessage(null), MESSAGE_TIMEOUT_MS);
    return () => clearTimeout(timeout);
  }, [message]);

  return { message, setMessage, messageKey };
};
