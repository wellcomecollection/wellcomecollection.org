import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { UserInfoProvider } from '../../context/UserInfoContext';
import { UserInfo } from '../../types/UserInfo';
import { mockUser } from '../../__mocks__/UserInfo.mock';
import { server } from '../../__mocks__/server';
import { EditProfile } from './EditProfile';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { userId: '123' },
    };
  },
}));

const renderPage = (userOverride: Partial<UserInfo> = {}) => {
  server.use(
    rest.get(new RegExp('/api/user/123'), (_req, res, ctx) => {
      return res(ctx.json({ ...mockUser, ...userOverride }));
    })
  );
  return render(
    <UserInfoProvider>
      <EditProfile />
    </UserInfoProvider>
  );
};

const waitForPageToLoad = async () => {
  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  );
};

describe('EditProfile', () => {
  it('shows a loading component', async () => {
    renderPage();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    );
  });

  it('has a top-level heading', async () => {
    renderPage();
    await waitForPageToLoad();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      /account administration/i
    );
  });

  it('has a link to the main screen', async () => {
    renderPage();
    await waitForPageToLoad();
    expect(screen.getByRole('link', { name: /main screen/i })).toHaveAttribute(
      'href',
      '/'
    );
  });

  it('has a second-level heading with the name of the user profile being edited', async () => {
    renderPage();
    const secondaryHeading = await screen.findByRole('heading', {
      level: 2,
      name: new RegExp(`${mockUser.firstName} ${mockUser.lastName}`),
    });
    expect(secondaryHeading).toBeInTheDocument();
  });

  describe('status', () => {
    it('is not shown by default', async () => {
      renderPage();
      await waitFor(expect(screen.getByText(/loading/i)).not.toBeInTheDocument);
      const userStatus = screen.queryByRole('complementary');
      expect(userStatus).not.toBeInTheDocument();
    });

    it('shows that an account has been blocked', async () => {
      renderPage({ locked: true });
      await waitFor(expect(screen.getByText(/loading/i)).not.toBeInTheDocument);
      const userStatus = screen.getByRole('complementary');
      expect(userStatus).toBeInTheDocument();
      expect(userStatus).toHaveTextContent(/account blocked/i);
    });

    it('shows that an account has requested deletion', async () => {
      renderPage({
        locked: true,
        deleteRequested: '2021-02-18T12:37:58.305Z',
      });
      await waitFor(expect(screen.getByText(/loading/i)).not.toBeInTheDocument);
      const userStatus = screen.getByRole('complementary');
      expect(userStatus).toBeInTheDocument();
      expect(userStatus).toHaveTextContent(/user has requested delete/i);
    });

    it("shows that an account's email is not validated", async () => {
      renderPage({ emailValidated: false });
      await waitFor(expect(screen.getByText(/loading/i)).not.toBeInTheDocument);
      const userStatus = screen.getByRole('complementary');
      expect(userStatus).toBeInTheDocument();
      expect(userStatus).toHaveTextContent(/waiting activation/i);
    });
  });

  it("shows the user's library card number", async () => {
    renderPage();
    await waitForPageToLoad();
    expect(screen.getByText(mockUser.barcode)).toBeInTheDocument();
  });

  it("shows the user's patron record number", async () => {
    renderPage();
    await waitForPageToLoad();
    expect(screen.getByText(mockUser.userId)).toBeInTheDocument();
  });

  it("lets the admin edit the user's name and email", async () => {
    renderPage();
    await waitForPageToLoad();
    const firstNameInput = screen.getByLabelText(/first name/i);
    expect(firstNameInput).toHaveValue(mockUser.firstName);
    userEvent.clear(firstNameInput);
    userEvent.type(firstNameInput, 'Tony');
    expect(firstNameInput).toHaveValue('Tony');

    const lastNameInput = screen.getByLabelText(/last name/i);
    expect(lastNameInput).toHaveValue(mockUser.lastName);
    userEvent.clear(lastNameInput);
    userEvent.type(lastNameInput, 'Stark');
    expect(lastNameInput).toHaveValue('Stark');

    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toHaveValue(mockUser.email);
    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'iamironman@starkindustries.com');
    expect(emailInput).toHaveValue('iamironman@starkindustries.com');
  });

  it('submits the edited user details and refreshes', async () => {
    renderPage();
    await waitForPageToLoad();

    const firstNameInput = screen.getByLabelText(/first name/i);
    userEvent.clear(firstNameInput);
    userEvent.type(firstNameInput, 'Tony');

    const lastNameInput = screen.getByLabelText(/last name/i);
    userEvent.clear(lastNameInput);
    userEvent.type(lastNameInput, 'Stark');

    const emailInput = screen.getByLabelText(/email address/i);
    userEvent.clear(emailInput);
    userEvent.type(emailInput, 'iamironman@starkindustries.com');

    userEvent.click(screen.getByRole('button', { name: /update details/i }));

    await waitFor(() => {
      expect(screen.getByText(/updating/i)).toBeInTheDocument();
    });
    expect(firstNameInput).not.toBeInTheDocument();
    expect(lastNameInput).not.toBeInTheDocument();
    expect(emailInput).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
    expect(firstNameInput).not.toBeInTheDocument();
    expect(lastNameInput).not.toBeInTheDocument();
    expect(emailInput).not.toBeInTheDocument();

    await waitForPageToLoad();

    expect(firstNameInput).toHaveValue('Tony');
    expect(lastNameInput).toHaveValue('Stark');
    expect(emailInput).toHaveValue('iamironman@starkindustries.com');
  });

  it('halts submit and shows a warning if the first name is blank', async () => {
    renderPage();
    await waitForPageToLoad();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.clear(screen.getByLabelText(/first name/i));
    userEvent.click(screen.getByRole('button', { name: /update details/i }));
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toHaveTextContent(
        /first name cannot be blank/i
      );
    });
    expect(screen.queryByText(/updating/i)).not.toBeInTheDocument();
  });

  it('halts submit and shows a warning if the last name is blank', async () => {
    renderPage();
    await waitForPageToLoad();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.clear(screen.getByLabelText(/last name/i));
    userEvent.click(screen.getByRole('button', { name: /update details/i }));
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toHaveTextContent(
        /last name cannot be blank/i
      );
    });
    expect(screen.queryByText(/updating/i)).not.toBeInTheDocument();
  });

  it('halts submit and shows a warning if the email is blank or invalid', async () => {
    renderPage();
    await waitForPageToLoad();
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', {
      name: /update details/i,
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.clear(emailInput);
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toHaveTextContent(
        /email address cannot be blank/i
      );
    });
    expect(screen.queryByText(/updating/i)).not.toBeInTheDocument();

    userEvent.type(emailInput, 'captainamerica@avengers'); // not a valid email
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).toHaveTextContent(
        /invalid email address/i
      );
    });
    expect(screen.queryByText(/updating/i)).not.toBeInTheDocument();
  });

  it("displays the date the user's account was created", async () => {
    renderPage({ creationDate: '2021-01-11T15:40:00.000Z' });
    await waitForPageToLoad();
    expect(screen.getByText(/creation date/i)).toBeInTheDocument();
    expect(screen.getByText(/11\/01\/2021 15:40:00/)).toBeInTheDocument();
  });

  it("displays the date the user's account was last updated", async () => {
    renderPage({ updatedDate: '2021-02-14T10:35:28.583Z' });
    await waitForPageToLoad();
    expect(screen.getByText(/last update/i)).toBeInTheDocument();
    expect(screen.getByText(/14\/02\/2021 10:35:28/)).toBeInTheDocument();
  });

  it('displays the date the user last logged in', async () => {
    renderPage({ lastLoginDate: '2021-02-23T09:20:32.507Z' });
    await waitForPageToLoad();
    expect(screen.getByText(/last login$/i)).toBeInTheDocument();
    expect(screen.getByText(/23\/02\/2021 09:20:32/)).toBeInTheDocument();
  });

  it('displays the IP the user last logged in from', async () => {
    renderPage({ lastLoginIp: '152.46.67.221' });
    await waitForPageToLoad();
    expect(screen.getByText(/last login ip/i)).toBeInTheDocument();
    expect(screen.getByText('152.46.67.221')).toBeInTheDocument();
  });

  it('displays the number of times the user has logged in', async () => {
    renderPage({ totalLogins: 138 });
    await waitForPageToLoad();
    expect(screen.getByText(/total logins/i)).toBeInTheDocument();
    expect(screen.getByText('138')).toBeInTheDocument();
  });

  it('displays account actions in a menu', async () => {
    renderPage();
    await waitForPageToLoad();
    expect(
      screen.queryByText(/resend activation email/i)
    ).not.toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: /account actions/i }));
    expect(screen.getByText(/resend activation email/i)).toBeInTheDocument();
  });

  it("can resend a user's activation email", async () => {
    renderPage();
    await waitForPageToLoad();
    userEvent.click(screen.getByRole('button', { name: /account actions/i }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.click(screen.getByText(/resend activation email/i));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Activation email resent'
    );
  });

  it("shows an error when resending a user's activation email fails", async () => {
    server.use(
      rest.put(
        new RegExp('/api/resend-activation-email/123'),
        (_req, res, ctx) => {
          return res(ctx.status(400));
        }
      )
    );
    renderPage();
    await waitForPageToLoad();
    userEvent.click(screen.getByRole('button', { name: /account actions/i }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    userEvent.click(screen.getByText(/resend activation email/i));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Failed to send activation email'
    );
  });
});
