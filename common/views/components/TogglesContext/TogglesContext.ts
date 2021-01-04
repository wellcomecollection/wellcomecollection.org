import { createContext } from 'react';
import { Toggles } from '@weco/toggles';

const TogglesContext = createContext<Toggles>({} as Toggles);

export default TogglesContext;
