import { DeveloperRoles } from '@prisma/client';

export interface UpdateData {
  name?: string;
  email?: string;
  bio?: string;
  devRole: DeveloperRoles;
  profile_picture?: string;
}
