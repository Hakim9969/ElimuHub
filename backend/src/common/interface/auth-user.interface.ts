import {$Enums} from "../../../generated/prisma";
import Role = $Enums.Role;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  verified: boolean;
  role: Role;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
}
