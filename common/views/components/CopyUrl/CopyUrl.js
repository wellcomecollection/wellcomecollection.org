// @flow

import {spacing, font} from '../../../utils/classnames';
import {Component} from 'react';
import Icon from '../Icon/Icon';
import HTMLInput from '../HTMLInput/HTMLInput';

type Props = {|
  id: string,
  url: string
|}

type State = {|
  isEnhanced: boolean,
  isTextCopied: boolean,
  buttonText: string
|}

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
    buttonText: 'Copy link'
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
        isTextCopied: true,
        buttonText: '<span class="visually-hidden">link has been</span>Copied'
      });
    } catch (err) {
      this.setState({
        isTextCopied: false,
        buttonText: 'Copy failed'
      });
    }

    textarea.remove();
    this.focusTextInput();
  }

  render() {
    const { url, id } = this.props;
    const { isTextCopied, buttonText } = this.state;

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
          className={`${isTextCopied ? 'plain-button' : ''} ${spacing({s: 2}, {margin: ['top']})} ${font({s: 'HNM5', m: 'HNM4'})} btn btn--light ${this.state.isEnhanced ? '' : 'is-hidden'} js-copy-url pointer`}>
          <Icon name='check' extraClasses={`icon--black ${isTextCopied ? '' : 'is-hidden'}`} />
          <span className='js-copy-text' dangerouslySetInnerHTML={{__html: buttonText}} />
        </button>
      </div>
    );
  }
};

export default CopyUrl;
