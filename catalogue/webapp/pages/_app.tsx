import App from '@weco/common/views/pages/_app';
// this css should be included in the ColorPicker component
// but is causing this error https://err.sh/next.js/css-npm
import 'react-colorful/dist/index.css';
import '@weco/common/views/components/ColorPicker/react-colorful-overrides.css';
import '../styles.scss';
export default App;
