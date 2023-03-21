import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { useState } from 'react';
import TextInput from './TextInput';
import useValidation from '../../../hooks/useValidation';
import userEvent from '@testing-library/user-event';
import { fireEvent } from '@testing-library/dom';

const testErrorMessage = 'test error message';

const ExampleTextInput = () => {
  const [value, setValue] = useState('');
  return (
    <TextInput
      id="test-input"
      label="test input"
      name="email"
      type="email"
      value={value}
      setValue={setValue}
      required={true}
      errorMessage={testErrorMessage}
      {...useValidation()}
    />
  );
};

describe('TextInput', () => {
  test('The input will validate when blurred', async () => {
    const { getByLabelText, getByTestId } = renderWithTheme(
      <ExampleTextInput />
    );

    const inputEl = getByLabelText('test input');

    inputEl.focus();
    await userEvent.type(inputEl, 'invalidemail@');
    fireEvent.focusOut(inputEl);
    expect(getByTestId('TextInputErrorMessage'));
  });

  test('The input will hide errors at the point it becomes valid', async () => {
    const { getByLabelText, getByTestId } = renderWithTheme(
      <ExampleTextInput />
    );

    const inputEl = getByLabelText('test input');

    inputEl.focus();
    await userEvent.type(inputEl, 'invalidemail@');
    fireEvent.focusOut(inputEl);
    expect(getByTestId('TextInputErrorMessage'));

    inputEl.focus();
    await userEvent.clear(inputEl);
    await userEvent.type(inputEl, 'valid@email.com');
    fireEvent.focusOut(inputEl);
    expect(() => getByTestId('TextInputErrorMessage')).toThrow();
  });

  test('A valid input will hide its valid state at the point invalid input is added', async () => {
    const { getByLabelText, getByTestId } = renderWithTheme(
      <ExampleTextInput />
    );

    const inputEl = getByLabelText('test input');

    inputEl.focus();
    await userEvent.type(inputEl, 'valid@email.com');
    fireEvent.focusOut(inputEl);
    expect(getByTestId('TextInputCheckmark'));

    await userEvent.clear(inputEl);
    await userEvent.type(inputEl, 'invalidemail@');

    expect(() => getByTestId('TextInputCheckmark')).toThrow();
    expect(() => getByTestId('TextInputErrorMessage')).toThrow();
    fireEvent.focusOut(inputEl);
    expect(getByTestId('TextInputErrorMessage'));
  });
});
