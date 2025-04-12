import { ROLES } from '../utils/enums';

export type User = {
  username: string;
  email: string;
  password: string;
  role: ROLES;
  capitalizedRole: string;
  _id: string;
};
