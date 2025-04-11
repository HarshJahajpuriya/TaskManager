import { ROLES } from "../utils/enums";

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: ROLES;
};
