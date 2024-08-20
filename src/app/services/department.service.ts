import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetListResponse } from '../models/getListResponse';
import { GetListDepartmentListResponse } from '../models/departments/getListDepartmentListResponse';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = `${environment.apiBaseUrl}/Departments`;

  constructor(private http: HttpClient) { }

  getAllDepartmentList(): Observable<GetListDepartmentListResponse[]> {
    return this.http.get<GetListDepartmentListResponse[]>(`${this.apiUrl}/GetAll`);
  }
}
