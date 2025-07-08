import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserResponse[]> {
  const token = localStorage.getItem('access_token');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  return this.http.get<UserResponse[]>(`${this.apiUrl}`, { headers });
}

  getUserRoles(): Observable<{ roles: string[] }> {
  return this.http.get<{ roles: string[] }>(`${this.apiUrl}/roles`);
}



  deleteUser(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

updateUser(id: string, data: Partial<UserResponse>): Observable<any> {
  return this.http.patch(`${this.apiUrl}/${id}`, data);
}

}
