import { FunctionComponent } from 'react';
import { mount } from 'enzyme';
import { withAppPathPrefix } from '../../utils/identity-path-prefix';

const ComponentWithPrefix: FunctionComponent<{ path: string }> = ({ path }) => (
  <div data-test-id="dummy-div">{withAppPathPrefix(path)}</div>
);

describe('withAppPathPrefix (client)', () => {
  beforeEach(() => {
    const root = document.createElement('div');
    root.setAttribute('id', 'root');
    document.body.appendChild(root);
  });

  afterEach(() => {
    const root = document.getElementById('root');
    if (root) {
      document.body.removeChild(root);
    }
  });

  it('returns the original path when no context_path is defined', () => {
    const root = document.getElementById('root');
    const result = mount(<ComponentWithPrefix path="/home" />, {
      attachTo: root,
    });
    expect(result.text()).toBe('/home');
  });

  it('adds the context_path prefix when set on the document root', () => {
    const root = document.getElementById('root')!;
    root.dataset.contextPath = 'myApp';
    const result = mount(<ComponentWithPrefix path="/home" />, {
      attachTo: root,
    });
    expect(result.text()).toBe('/myApp/home');
  });
});
