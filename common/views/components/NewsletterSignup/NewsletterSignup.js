import {spacing} from '../../../utils/classnames';
import HTMLInput from '../HTMLInput/HTMLInput';
import Button from '../Buttons/Button/Button';
import {Component} from 'react';

const addressBooks = [
  {
    id: 'whats_on',
    label: 'What\'s on',
    name: 'addressbook_15120891'
  },
  {
    id: 'teachers',
    label: 'Teachers',
    name: 'addressbook_15120905'
  },
  {
    id: 'young_people_14-19',
    label: 'Young people 14-19',
    name: 'addressbook_15120909'
  },
  {
    id: 'youth_and_community_workers',
    label: 'Youth and community workers',
    name: 'addressbook_15120914'
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    name: 'addressbook_15120997'
  }
];

class NewsletterSignup extends Component {
  state = {
    checkedInputs: [],
    isEmailError: true,
    isCheckboxError: true,
    noValidate: false,
    isSubmitAttempted: false
  };

  componentDidMount() {
    this.setState({
      noValidate: true
    });
  }

  updateCheckedInputs = (event) => {
    const isChecked = event.target.checked;
    const id = event.target.id;

    const newInputs = isChecked
      ? this.state.checkedInputs.concat(id)
      : this.state.checkedInputs.filter(c => c !== id);

    this.setState({
      checkedInputs: newInputs,
      isCheckboxError: newInputs.length === 0
    });
  }

  handleEmailInput = (event) => {
    this.setState({
      isEmailError: !event.target.validity.valid
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const emailInputEl = event.target.querySelector('input[type="email"]');

    this.setState({
      isSubmitAttempted: true
    });

    if (!this.state.checkedInputs.length) {
      this.setState({
        isCheckboxError: true
      });
    }

    if (!emailInputEl.validity.valid) {
      this.setState({
        isEmailError: true
      });
    }

    if (!this.state.isCheckboxError && !this.state.isEmailError) {
      event.target.submit();
    }
  }

  render() {
    return (
      <form noValidate={this.state.noValidate} onSubmit={this.handleSubmit} name='newsletter-signup' id='newsletter-signup' action='https://r1-t.trackedlink.net/signup.ashx' method='post'>
        <input type='hidden' name='userid' value='126919' />
        <input type='hidden' name='ReturnURL' value='https://wellcomecollection.org/info/newsletter' />

        <HTMLInput
          required={true}
          id='email'
          type='email'
          name='Email'
          label='Email'
          placeholder='Email'
          isLabelHidden={true}
          onChange={this.handleEmailInput}
        />

        <fieldset>
          <legend>Newsletters</legend>
          <ul className='plain-list no-padding'>
            {addressBooks.map((addressBook) => (
              <li key={addressBook.id}>
                <HTMLInput
                  id={addressBook.id}
                  type='checkbox'
                  name={addressBook.name}
                  label={addressBook.label}
                  onChange={this.updateCheckedInputs} />
              </li>
            ))}
          </ul>
        </fieldset>

        <Button
          extraClasses={`btn--primary ${spacing({s: 2}, {margin: ['top', 'bottom']})}`}
          text='Submit' />

        {this.state.isCheckboxError && this.state.isSubmitAttempted &&
          <p className={`${spacing({s: 2}, {padding: ['top', 'right', 'bottom', 'left'], margin: ['bottom']})} border-width-1 border-color-red font-red`}>Please select at least one newsletter.</p>
        }

        {this.state.isEmailError && this.state.isSubmitAttempted &&
          <p className={`${spacing({s: 2}, {padding: ['top', 'right', 'bottom', 'left'], margin: ['bottom']})} border-width-1 border-color-red font-red`}>Please enter a valid email address.</p>
        }
      </form>
    );
  }
}

export default NewsletterSignup;
