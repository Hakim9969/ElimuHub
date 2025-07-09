export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  createdAt: Date;
  updatedAt: Date;
  updated?: boolean;
}
