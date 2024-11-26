import { DeveloperRoles } from '@prisma/client';

export interface UserData {
  name: string;
  email: string;
  password: string;
  bio?: string;
  devRole: DeveloperRoles;
  profile_picture?: string;
  role?: string;
}
