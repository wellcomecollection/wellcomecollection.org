import {spacing} from '../../../utils/classnames';
import HTMLInput from '../HTMLInput/HTMLInput';
import Button from '../Buttons/Button/Button';

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

const NewsletterSignup = () => (
  <form name='signup' id='signup' action='https://r1-t.trackedlink.net/signup.ashx' method='post'>
    <input type='hidden' name='userid' value='126919' />
    <input type='hidden' name='ReturnURL' value='https://wellcomecollection.org' />

    <HTMLInput
      id='email'
      type='text'
      name='Email'
      label='Email'
      placeholder='Email'
      isLabelHidden={true}
    />

    <fieldset>
      <legend>Newsletters</legend>
      <ul>
        {addressBooks.map((addressBook) => (
          <li key={addressBook.id}>
            <HTMLInput
              id={addressBook.id}
              type='checkbox'
              name={addressBook.name}
              label={addressBook.label}/>
          </li>
        ))}
      </ul>
    </fieldset>

    <Button
      extraClasses={`btn--primary ${spacing({s: 2}, {margin: ['top']})}`}
      text='Submit' />
  </form>
);

export default NewsletterSignup;
