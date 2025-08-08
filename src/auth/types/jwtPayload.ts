import { UserStatus } from '../../../generated/prisma';

export type jwtPayload = {
  sub: string; //subject in JWT, typically the user ID
  username: string;
  status: UserStatus;
};
