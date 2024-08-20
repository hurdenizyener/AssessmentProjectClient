import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetListResponse } from '../models/getListResponse';
import { GetListDepartmentPositionsList } from '../models/positions/getListDepartmentPositionListResponse';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private apiUrl = `${environment.apiBaseUrl}/Positions`;

  constructor(private http: HttpClient) { }

  getListDepartmentPositionsList(departmentId: string): Observable<GetListDepartmentPositionsList[]> {
    return this.http.get<GetListDepartmentPositionsList[]>(`${this.apiUrl}/ListByDepartment/${departmentId}`);
  }
}
