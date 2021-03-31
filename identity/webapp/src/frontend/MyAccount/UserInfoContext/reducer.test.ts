import { mockUser } from '../../mocks/user';
import { initialState, userInfoReducer } from './reducer';

describe('userInfoReducer', () => {
  it('returns a loading state when fetching user data', () => {
    expect(userInfoReducer(initialState, { type: 'FETCH' })).toEqual({ status: 'loading' });
  });

  it('returns a state with a user when fetching resolves', () => {
    expect(userInfoReducer(initialState, { type: 'RESOLVE', payload: mockUser })).toEqual({
      status: 'success',
      user: mockUser,
    });
  });

  it('returns an error state when fetching rejects', () => {
    expect(userInfoReducer(initialState, { type: 'REJECT', error: 'Uh-oh!' })).toEqual({
      status: 'failure',
      error: 'Uh-oh!',
    });
  });

  it('returns an idle state when fetching is cancelled', () => {
    const fetchingState = userInfoReducer(initialState, { type: 'FETCH' });
    expect(userInfoReducer(fetchingState, { type: 'CANCEL' })).toEqual({
      status: 'idle',
    });
  });

  it('manually updates the user', () => {
    const resolvedState = userInfoReducer(initialState, { type: 'RESOLVE', payload: mockUser });
    expect(userInfoReducer(resolvedState, { type: 'UPDATE', payload: { email: 'new@email.com' } })).toEqual({
      status: resolvedState.status,
      user: {
        ...mockUser,
        email: 'new@email.com',
      },
    });
  });
});
