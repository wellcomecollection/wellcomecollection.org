import { createContext } from 'react';

const TogglesContext = createContext<{ [key: string]: boolean }>({});

export default TogglesContext;
