// src/types/express.d.ts
import { Role } from 'generated/prisma';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name: string;
      phone: string | null;
      verified: boolean;
      role: Role;
      profilePicture: string | null;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}

export {};
