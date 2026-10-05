import { fireEvent } from '@testing-library/dom';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import useValidation from '@weco/common/hooks/useValidation';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

import TextInput from '.';

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
      errorMessage="This input has an error"
      successMessage="This input is valid"
      required
      {...useValidation()}
    />
  );
};

test('(1) | TextInput; will validate when blurred', async () => {
  const { getByLabelText, getByTestId } = renderWithTheme(<ExampleTextInput />);

  const inputEl = getByLabelText('test input');
  await act(async () => {
    inputEl.focus();
    await userEvent.type(inputEl, 'invalidemail@');
    fireEvent.focusOut(inputEl);
  });
  expect(getByTestId('TextInputErrorMessage'));
});

test('(2) | TextInput; will hide errors at the point it becomes valid', async () => {
  const { getByLabelText, getByTestId } = renderWithTheme(<ExampleTextInput />);

  const inputEl = getByLabelText('test input');
  await act(async () => {
    inputEl.focus();
    await userEvent.type(inputEl, 'invalidemail@');
    fireEvent.focusOut(inputEl);
  });
  expect(getByTestId('TextInputErrorMessage'));
  await act(async () => {
    inputEl.focus();
    await userEvent.clear(inputEl);
    await userEvent.type(inputEl, 'valid@email.com');
    fireEvent.focusOut(inputEl);
  });
  expect(() => getByTestId('TextInputErrorMessage')).toThrow();
});

test('(3) | TextInput; a valid input will hide its valid state at the point invalid input is added and focus is out', async () => {
  const { getByLabelText, getByTestId } = renderWithTheme(<ExampleTextInput />);

  const inputEl = getByLabelText('test input');
  await act(async () => {
    inputEl.focus();
    await userEvent.type(inputEl, 'valid@email.com');
    fireEvent.focusOut(inputEl);
  });
  await expect(getByTestId('TextInputSuccessMessage')).toBeVisible();
  await act(async () => {
    await userEvent.clear(inputEl);
    await userEvent.type(inputEl, 'invalidemail@');
  });
  expect(() => getByTestId('TextInputSuccessMessage')).toThrow();
  await act(async () => {
    fireEvent.focusOut(inputEl);
  });
  await expect(getByTestId('TextInputErrorMessage')).toBeVisible();
});

// data-status is what styles outside TextInput use to leave validation
// borders alone (e.g. NewsletterPromo), so it needs to track the state shown
describe('data-status', () => {
  const getStatus = (inputEl: HTMLElement) =>
    inputEl
      .closest('[data-component="text-input"]')
      ?.querySelector('[data-status]')
      ?.getAttribute('data-status');

  test('(4) | is absent before the input has been validated', async () => {
    const { getByLabelText } = renderWithTheme(<ExampleTextInput />);

    const inputEl = getByLabelText('test input');
    expect(getStatus(inputEl)).toBeUndefined();

    await act(async () => {
      inputEl.focus();
      await userEvent.type(inputEl, 'valid@email.com');
    });
    expect(getStatus(inputEl)).toBeUndefined();
  });

  test('(5) | is "error" when an invalid input is blurred', async () => {
    const { getByLabelText } = renderWithTheme(<ExampleTextInput />);

    const inputEl = getByLabelText('test input');
    await act(async () => {
      inputEl.focus();
      await userEvent.type(inputEl, 'invalidemail@');
      fireEvent.focusOut(inputEl);
    });
    expect(getStatus(inputEl)).toBe('error');
  });

  test('(6) | is "success" when a valid input is blurred', async () => {
    const { getByLabelText } = renderWithTheme(<ExampleTextInput />);

    const inputEl = getByLabelText('test input');
    await act(async () => {
      inputEl.focus();
      await userEvent.type(inputEl, 'valid@email.com');
      fireEvent.focusOut(inputEl);
    });
    expect(getStatus(inputEl)).toBe('success');
  });

  test('(7) | is removed when the shown state is cleared', async () => {
    const { getByLabelText, getByTestId } = renderWithTheme(
      <ExampleTextInput />
    );

    const inputEl = getByLabelText('test input');
    await act(async () => {
      inputEl.focus();
      await userEvent.type(inputEl, 'valid@email.com');
      fireEvent.focusOut(inputEl);
    });
    expect(getStatus(inputEl)).toBe('success');

    await act(async () => {
      await userEvent.clear(inputEl);
      await userEvent.type(inputEl, 'invalidemail@');
    });
    expect(() => getByTestId('TextInputSuccessMessage')).toThrow();
    expect(getStatus(inputEl)).toBeUndefined();
  });
});
