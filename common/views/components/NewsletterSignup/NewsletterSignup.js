import {spacing, font} from '../../../utils/classnames';
import HTMLInput from '../HTMLInput/HTMLInput';
import Button from '../Buttons/Button/Button';
import {Component} from 'react';

const addressBooks = [
  {
    id: 'whats_on',
    label: `What’s On`,
    name: 'addressbook_40131',
    description: `Exhibitions, events and opportunities to get involved - What’s On is sent monthly, with occasional updates`
  },
  {
    id: 'accessibility',
    label: `What’s On: Access`,
    name: 'addressbook_40129',
    description: `What’s On: Access - highlights events, tours and opportunities to get involved, including BSL, Audio Description and Speech-to-Text events`
  },
  {
    id: 'young_people_14-19',
    label: `What’s On for 14-19 year olds`,
    name: 'addressbook_40132',
    description: `What’s On for 14-19 year olds: creative opportunities and events for young people aged 14-19, including RawMinds and Saturday Studio`
  },
  {
    id: 'teachers',
    label: `Study Days`,
    name: 'addressbook_40130',
    description: `Study days and other events for secondary school teachers and school groups`
  },
  {
    id: 'youth_and_community_workers',
    label: `Updates for Youth & Community Workers`,
    name: 'addressbook_40133',
    description: `Updates for Youth & Community Workers, featuring events and activities for youth 14-19`
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

    this.setState({
      isSubmitAttempted: true
    });

    if (!this.state.isCheckboxError && !this.state.isEmailError) {
      event.target.submit();
    }
  }

  render() {
    return (
      <form
        noValidate={this.state.noValidate}
        onSubmit={this.handleSubmit}
        name='newsletter-signup'
        id='newsletter-signup'
        action='https://r1-t.trackedlink.net/signup.ashx'
        method='post'>
        <input type='hidden' name='userid' value='225683' />
        <input type='hidden' name='ReturnURL' value='http://localhost:3000/info/newsletter' />
        <input type='hidden' name='SIG22a9ece3ebe9b2e10e328f234fd10b3f5686b9f4d45f628f08852417032dc990' value='' />

        <fieldset className={spacing({s: 2}, {margin: ['bottom']})}>
          <legend>What are you interested in? Choose as many as you like:</legend>
          <ul className='plain-list no-padding'>
            {addressBooks.map((addressBook) => (
              <li className={spacing({s: 2}, {margin: ['bottom']})} key={addressBook.id}>
                <HTMLInput
                  id={addressBook.id}
                  type='checkbox'
                  name={addressBook.name}
                  label={addressBook.label}
                  onChange={this.updateCheckedInputs} />
                <p className={`${font({s: 'HNL6'})} ${spacing({s: 1}, {margin: ['top']})}`}>{addressBook.description}</p>
              </li>
            ))}
          </ul>
        </fieldset>

        <div className={spacing({s: 2}, {margin: ['bottom']})}>
          <HTMLInput
            required={true}
            id='email'
            type='email'
            name='Email'
            label='Your email address'
            placeholder='Your email address'
            isLabelHidden={true}
            onChange={this.handleEmailInput}
          />
        </div>

        <p className={font({s: 'HNL6'})}>We use a third party provider, Dotmailer, to deliver our newsletters. For information about how we handle your data, please read our <a href='https://wellcome.ac.uk/about-us/privacy-and-terms'>privacy notice</a>. You can unsubscribe at any time using links in the emails you receive.</p>

        <Button
          extraClasses={`btn--primary ${spacing({s: 2}, {margin: ['bottom']})}`}
          text='Submit' />

        {this.state.isCheckboxError && this.state.isSubmitAttempted &&
          <p className={`${spacing({s: 2}, {padding: ['top', 'right', 'bottom', 'left'], margin: ['bottom']})} border-width-1 border-color-red font-red`}>Please select an option.</p>
        }

        {this.state.isEmailError && this.state.isSubmitAttempted &&
          <p className={`${spacing({s: 2}, {padding: ['top', 'right', 'bottom', 'left'], margin: ['bottom']})} border-width-1 border-color-red font-red`}>Please enter a valid email address.</p>
        }
      </form>
    );
  }
}

export default NewsletterSignup;
