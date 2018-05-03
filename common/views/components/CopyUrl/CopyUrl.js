// @flow

import {spacing, font} from '../../../utils/classnames';
import {Fragment, Component} from 'react';
import Icon from '../Icon/Icon';
import HTMLInput from '../HTMLInput/HTMLInput';

type Props = {|
  id: string,
  url: string
|}

// TODO: work out how to handle cutting-the-mustard (?HOC)
// and remove isEnhanced if/when this becomes a more global concern
type State = {|
  isEnhanced: boolean,
  isTextCopied: boolean,
  isClicked: boolean
|}

function getButtonMarkup(isTextCopied, isClicked) {
  if (!isClicked) {
    return 'Copy URL';
  } else if (isTextCopied) {
    return (
      <Fragment>
        <span className='visually-hidden'>link has been</span>Copied
      </Fragment>
    );
  } else {
    return 'Copy failed';
  }
}

class CopyUrl extends Component<Props, State> {
  textInput: ?HTMLInputElement;
  setTextInputRef: Function;
  focusTextInput: Function;

  constructor(props: Props) {
    super(props);
    this.textInput = null;

    // Using refs to get access to elements for e.g. focusing
    // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
    this.setTextInputRef = el => {
      this.textInput = el;
    };

    this.focusTextInput = () => {
      if (this.textInput) {
        this.textInput.focus();
      }
    };
  }

  state: State = {
    isEnhanced: false,
    isTextCopied: false,
    isClicked: false
  };

  componentDidMount() {
    this.setState({isEnhanced: true});
  }

  handleButtonClick = () => {
    const textarea = document.createElement('textarea');
    textarea.setAttribute('style', 'position: fixed; left: -9999px;');
    textarea.innerHTML = this.props.url;
    document.body && document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      this.setState({
        isTextCopied: true
      });
    } catch (err) {
      this.setState({
        isTextCopied: false
      });
    }

    this.setState({
      isClicked: true
    });

    textarea.remove();
    this.focusTextInput();
  }

  render() {
    const { url, id } = this.props;
    const { isTextCopied, isClicked } = this.state;

    return (
      <div>
        <HTMLInput
          inputRef={this.setTextInputRef}
          id='share'
          type='text'
          label='share url'
          defaultValue={url}
          isLabelHidden={true}
          fontStyles={{s: 'HNL5', m: 'HNL4'}} />

        <button aria-live='polite'
          onClick={this.handleButtonClick}
          data-copy-text={url}
          data-track-event={`{"category": "component", "action": "copy-url:click", "label": "id:${id}"}`}
          className={`${spacing({s: 2}, {margin: ['top']})} ${font({s: 'HNM5', m: 'HNM4'})} btn btn--tertiary flex-inline flex--v-center ${this.state.isEnhanced ? '' : 'is-hidden'} js-copy-url pointer`}>
          <span className='flex-inline flex--v-center'>
            <Icon name='check' extraClasses={`icon--black ${isTextCopied ? '' : 'is-hidden'}`} />
            <span className='js-copy-text'>
              {getButtonMarkup(isTextCopied, isClicked)}
            </span>
          </span>
        </button>
      </div>
    );
  }
};

export default CopyUrl;
