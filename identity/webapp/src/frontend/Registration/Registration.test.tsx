import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Router } from 'react-router-dom';
import { Registration } from './Registration';
import userEvent from '@testing-library/user-event';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { ThemeProvider } from 'styled-components';
import { createMemoryHistory } from 'history';
import theme from '@weco/common/views/themes/default';

// avoid rendering header SVG to help with debugging tests
jest.mock('../components/PageWrapper', () => ({
  __esModule: true,
  PageWrapper: ({ children }) => <>{children}</>, // eslint-disable-line react/display-name
}));

const history = createMemoryHistory({ initialEntries: ['/'] });

window.scrollTo = jest.fn();

const renderComponent = () =>
  render(
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Registration />
      </Router>
    </ThemeProvider>
  );

describe('Registration', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('sets the document title', () => {
    renderComponent();
    expect(document.title).toEqual('Register for a library account | Wellcome Collection');
  });

  it('shows a page title', () => {
    renderComponent();
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/register for a library account/i);
  });

  it('allows the user to enter their first name', async () => {
    renderComponent();
    const firstNameInput = screen.getByLabelText(/first name/i);
    expect(firstNameInput).toBeInTheDocument();
    userEvent.type(firstNameInput, 'Clark');
    await waitFor(() => expect(firstNameInput).toHaveValue('Clark'));
  });

  it('allows the user to enter their last name', async () => {
    renderComponent();
    const lastNameInput = screen.getByLabelText(/last name/i);
    expect(lastNameInput).toBeInTheDocument();
    userEvent.type(lastNameInput, 'Kent');
    await waitFor(() => expect(lastNameInput).toHaveValue('Kent'));
  });

  it('allows the user to enter an email address', async () => {
    renderComponent();
    const emailAddressInput = screen.getByLabelText(/email address/i);
    expect(emailAddressInput).toBeInTheDocument();
    userEvent.type(emailAddressInput, 'clarkkent@dailybugle.com');
    await waitFor(() => expect(emailAddressInput).toHaveValue('clarkkent@dailybugle.com'));
  });

  it('allows the user to enter a password', async () => {
    renderComponent();
    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(passwordInput).toBeInTheDocument();
    userEvent.type(passwordInput, 'dolphins');
    await waitFor(() => expect(passwordInput).toHaveValue('dolphins'));
  });

  it('submits a complete and valid form to the API', async () => {
    renderComponent();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/email address/i), 'clarkkent@dailybugle.com');
    userEvent.type(screen.getByLabelText(/^password$/i), 'Superman1938');
    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(await screen.findByRole('progressbar')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /activate your library account/i, level: 1 })).toBeInTheDocument();
    });
  });

  it('does not submit with an empty first name field', async () => {
    renderComponent();
    expect(screen.queryByText(/enter your first name/i)).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/email address/i), 'clarkkent@dailybugle.com');
    userEvent.type(screen.getByLabelText(/^password$/i), 'Superman1938');
    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(await screen.findByText(/enter your first name/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /account created/i, level: 1 })).not.toBeInTheDocument();
  });

  it('does not submit with an empty last name field', async () => {
    renderComponent();
    expect(screen.queryByText(/enter your last name/i)).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/email address/i), 'clarkkent@dailybugle.com');
    userEvent.type(screen.getByLabelText(/^password$/i), 'Superman1938');
    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(await screen.findByText(/enter your last name/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /account created/i, level: 1 })).not.toBeInTheDocument();
  });

  it('does not submit with an empty email field', async () => {
    renderComponent();
    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    expect(screen.queryByText(/enter an email address/i)).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/^password$/i), 'Superman1938');
    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(createAccountButton);
    expect(await screen.findByText(/enter an email address/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /account created/i, level: 1 })).not.toBeInTheDocument();
  });

  it('does not submit when the email is missing an @', async () => {
    renderComponent();
    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    const emailAddressInput = screen.getByLabelText(/email address/i);
    expect(screen.queryByText(/enter a valid email address/i)).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/^password$/i), 'Superman1938');
    userEvent.click(screen.getByRole('checkbox'));

    userEvent.type(emailAddressInput, 'clarkkent.com'); // no @
    userEvent.click(createAccountButton);
    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /account created/i, level: 1 })).not.toBeInTheDocument();
  });

  it('does not submit when the email is missing a dot', async () => {
    renderComponent();
    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    const emailAddressInput = screen.getByLabelText(/email address/i);
    expect(screen.queryByText(/enter a valid email address/i)).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/^password$/i), 'Superman1938');
    userEvent.click(screen.getByRole('checkbox'));

    userEvent.type(emailAddressInput, 'clarkkent@dailybugle'); // no dot
    userEvent.click(createAccountButton);
    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /account created/i, level: 1 })).not.toBeInTheDocument();
  });

  it('does not submit with an empty password field', async () => {
    renderComponent();
    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    expect(screen.queryByText(/enter a password/i)).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/email address/i), 'clarkkent@dailybugle.com');
    userEvent.click(screen.getByRole('checkbox'));
    userEvent.click(createAccountButton);
    expect(await screen.findByText(/enter a password/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /account created/i, level: 1 })).not.toBeInTheDocument();
  });

  it('does not submit when the password is too short', async () => {
    renderComponent();
    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(screen.queryByText(/enter a valid password/i)).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/email address/i), 'clarkkent@dailybugle.com');
    userEvent.click(screen.getByRole('checkbox'));

    userEvent.type(passwordInput, 'Supes1'); // too short
    userEvent.click(createAccountButton);
    expect(await screen.findByText(/enter a valid password/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /account created/i, level: 1 })).not.toBeInTheDocument();
  });

  it('does not submit when the password is missing a capital letter', async () => {
    renderComponent();
    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(screen.queryByText(/enter a valid password/i)).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/email address/i), 'clarkkent@dailybugle.com');
    userEvent.click(screen.getByRole('checkbox'));

    userEvent.type(passwordInput, 'superman1'); // no capital
    userEvent.click(createAccountButton);
    expect(await screen.findByText(/enter a valid password/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /account created/i, level: 1 })).not.toBeInTheDocument();
  });

  it('does not submit when the password is missing a small letter', async () => {
    renderComponent();
    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(screen.queryByText(/enter a valid password/i)).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/email address/i), 'clarkkent@dailybugle.com');
    userEvent.click(screen.getByRole('checkbox'));

    userEvent.type(passwordInput, 'SUPERMAN1'); // no lower case
    userEvent.click(createAccountButton);
    expect(await screen.findByText(/enter a valid password/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /account created/i, level: 1 })).not.toBeInTheDocument();
  });

  it('does not submit when the password is missing a number', async () => {
    renderComponent();
    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(screen.queryByText(/enter a valid password/i)).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/email address/i), 'clarkkent@dailybugle.com');
    userEvent.click(screen.getByRole('checkbox'));

    userEvent.type(passwordInput, 'ManOfSteel'); // no number
    userEvent.click(createAccountButton);
    expect(await screen.findByText(/enter a valid password/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /account created/i, level: 1 })).not.toBeInTheDocument();
  });

  it('does not submit if the user does not accept the terms', async () => {
    renderComponent();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/email address/i), 'clarkkent@dailybugle.com');
    userEvent.type(screen.getByLabelText(/^password$/i), 'Superman1938');
    userEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/accept the terms to continue/i);
    expect(screen.queryByRole('heading', { name: /account created/i, level: 1 })).not.toBeInTheDocument();
  });

  it('shows an error message when the email address is attached to an extant account', async () => {
    server.use(
      rest.post('/api/user/create', (req, res, ctx) => {
        return res(ctx.status(409));
      })
    );
    renderComponent();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/email address/i), 'clarkkent@dailybugle.com');
    userEvent.type(screen.getByLabelText(/^password$/i), 'Superman1938');
    userEvent.click(screen.getByRole('button', { name: /create account/i }));
    userEvent.click(screen.getByRole('checkbox'));
    expect(
      await screen.findByRole('alert', { name: /an account with this email address already exists, please sign in/i })
    ).toBeInTheDocument();
    expect(await screen.findByText('Email address already in use.')).toBeInTheDocument();
  });

  it('shows an error message when a common password is used', async () => {
    server.use(
      rest.post('/api/user/create', (req, res, ctx) => {
        return res(ctx.status(422));
      })
    );
    renderComponent();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/email address/i), 'clarkkent@dailybugle.com');
    userEvent.type(screen.getByLabelText(/^password$/i), 'Superman1938');
    userEvent.click(screen.getByRole('button', { name: /create account/i }));
    userEvent.click(screen.getByRole('checkbox'));
    expect(await screen.findByRole('alert')).toHaveTextContent(/password is too common/i);
  });

  it('shows an error message when a server error occurs', async () => {
    server.use(
      rest.post('/api/user/create', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    renderComponent();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.type(screen.getByLabelText(/first name/i), 'Clark');
    userEvent.type(screen.getByLabelText(/last name/i), 'Kent');
    userEvent.type(screen.getByLabelText(/email address/i), 'clarkkent@dailybugle.com');
    userEvent.type(screen.getByLabelText(/^password$/i), 'Superman1938');
    userEvent.click(screen.getByRole('button', { name: /create account/i }));
    userEvent.click(screen.getByRole('checkbox'));
    expect(await screen.findByRole('alert')).toHaveTextContent(/an unknown error occurred/i);
  });

  it('takes user back when Cancel link is clicked', () => {
    history.goBack = jest.fn();
    renderComponent();
    userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(history.goBack).toBeCalled();
  });
});
