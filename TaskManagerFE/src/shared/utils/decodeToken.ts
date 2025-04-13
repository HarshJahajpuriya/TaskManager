import * as jwt_decode from 'jwt-decode';
import { User } from '../models/User';

export const decodeToken = (token: string): User => {
  try {
    const decoded = jwt_decode.jwtDecode(token);
    return decoded as User;
  } catch (error) {
    console.error('Invalid token:', error);
    throw error;
  }
};
