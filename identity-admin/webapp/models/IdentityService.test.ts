import axios from 'axios';
import { mockUser } from '../mocks/UserInfo.mock';
import { IdentityService } from './IdentityService';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
process.env.API_BASE_URL = 'https://example.com/api';
process.env.API_KEY = 'SUPER_SECRET_KEY';

describe('IdentityService', () => {
  it('gets the data for a user', async () => {
    const mockResponse = {
      status: 200,
      data: mockUser,
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    expect(await IdentityService.getUserInfo(1234567, 'ACCESS_TOKEN')).toEqual(
      mockResponse
    );
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://example.com/api/users/1234567',
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer ACCESS_TOKEN',
          'x-api-key': 'SUPER_SECRET_KEY',
        },
      })
    );
  });

  it('updates the current user info', async () => {
    const mockResponse = {
      status: 200,
    };
    mockedAxios.put.mockResolvedValue(mockResponse);

    expect(
      await IdentityService.updateUserInfo(7654321, 'ACCESS_TOKEN', {
        firstName: 'Tony',
        lastName: 'Stark',
        email: 'tony@starkindustries.com',
      })
    ).toEqual(mockResponse);
    expect(mockedAxios.put).toHaveBeenCalledWith(
      'https://example.com/api/users/7654321',
      {
        firstName: 'Tony',
        lastName: 'Stark',
        email: 'tony@starkindustries.com',
      },
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer ACCESS_TOKEN',
          'x-api-key': 'SUPER_SECRET_KEY',
        },
      })
    );
  });
});
