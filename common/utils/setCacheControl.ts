import { ServerResponse } from 'http';

export const setCacheControl = (res: ServerResponse) => {
  res.setHeader('Cache-Control', 'public');
};
