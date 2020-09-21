import { useState } from 'react';
import TextInput from '../../views/components/TextInput/TextInput';
import { mountWithTheme } from '../fixtures/enzyme-helpers';
import useValidation from '../../hooks/useValidation';

const ExampleTextInput = () => {
  const [value, setValue] = useState('');

  return (
    <TextInput
      type="email"
      value={value}
      setValue={setValue}
      required={true}
      errorMessage={`test error message`}
      {...useValidation()}
    />
  );
};

describe('TextInput', () => {
  test(`The input will validate when blurred`, () => {
    const wrapper = mountWithTheme(<ExampleTextInput />);
    const input = wrapper.find('input');

    input.simulate('focus');
    input.instance().value = 'invalidemail@';
    input.simulate('change');
    input.simulate('blur');

    expect(
      wrapper.find("[data-test-id='TextInputErrorMessage']")
    ).toMatchSnapshot();
  });
  test(`The input will hide errors at the point it becomes valid`, () => {
    const wrapper = mountWithTheme(<ExampleTextInput />);
    const input = wrapper.find('input');

    input.simulate('focus');
    input.instance().value = 'invalidemail@';
    input.simulate('change');
    input.simulate('blur');

    expect(
      wrapper.find("[data-test-id='TextInputErrorMessage']")
    ).toMatchSnapshot();

    input.simulate('focus');
    input.instance().value = 'valid@email.com';
    input.simulate('change');

    expect(
      wrapper.find("[data-test-id='TextInputErrorMessage']")
    ).toMatchSnapshot();
  });
  test(`A valid input will hide its valid state at the point valid input is added`, () => {
    const wrapper = mountWithTheme(<ExampleTextInput />);
    const input = wrapper.find('input');

    input.simulate('focus');
    input.instance().value = 'valid@email.com';
    input.simulate('change');
    input.simulate('blur');

    expect(
      wrapper.find("[data-test-id='TextInputCheckmark']")
    ).toMatchSnapshot();

    input.simulate('focus');
    input.instance().value = 'valid@email.co';
    input.simulate('change');

    expect(
      wrapper.find("[data-test-id='TextInputCheckmark']")
    ).toMatchSnapshot();
  });

  test(`A valid input will hide its valid state at the point invalid input is added`, () => {
    const wrapper = mountWithTheme(<ExampleTextInput />);
    const input = wrapper.find('input');

    input.simulate('focus');
    input.instance().value = 'valid@email.com';
    input.simulate('change');
    input.simulate('blur');

    input.simulate('focus');
    input.instance().value = 'invalidemail@';
    input.simulate('change');

    expect(
      wrapper.find("[data-test-id='TextInputErrorMessage']")
    ).toMatchSnapshot();
  });
});
