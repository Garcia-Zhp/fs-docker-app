import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Organization } from '../models/organization.models';


@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private http = inject(HttpClient);
  private apiUrl = environment.production 
    ? `${environment.apiUrl}/organization`
    : 'http://localhost:8080/api/organization';

  getAllOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(`${this.apiUrl}/admin/all`);
  }

  getOrganizationById(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/admin/${id}`);
  }

  createOrganization(org: Partial<Organization>): Observable<Organization> {
    return this.http.post<Organization>(`${this.apiUrl}/admin`, org);
  }
}