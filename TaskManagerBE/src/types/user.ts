export enum ROLES {
  MANAGER = "manager",
  TEAM_LEAD = "team lead",
  EMPLOYEE = "employee",
}

export type User = {
  username: string;
  email: string;
  password: string;
  role: ROLES;
  _id: string;
};
