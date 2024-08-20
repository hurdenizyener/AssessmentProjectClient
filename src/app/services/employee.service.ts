import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetListResponse } from '../models/getListResponse';
import { environment } from '../environments/environment';
import { GetListEmployeeListResponse } from '../models/employees/getList/getListEmployeeListResponse';
import { CreateEmployeeCommand } from '../models/employees/create/createEmployeeCommand';
import { CreatedEmployeeResponse } from '../models/employees/create/createdEmployeeResponse';
import { UniversityList } from '../models/employees/universityList';
import { UpdateEmployeeCommand } from '../models/employees/update/updateEmployeeCommand';
import { UpdatedEmployeeResponse } from '../models/employees/update/updatedEmployeeResponse';
import { UpdateStatusCommand } from '../models/employees/updateStatus/updateStatusCommand';
import { UpdatedStatusResponse } from '../models/employees/updateStatus/updatedStatusResponse';

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  private apiUrl = `${environment.apiBaseUrl}/Employees`;
  private uniApiUrl='http://universities.hipolabs.com/search?country=Turkey';

  constructor(private http: HttpClient) { }


  addEmployee(command: CreateEmployeeCommand): Observable<CreatedEmployeeResponse> {
    return this.http.post<CreatedEmployeeResponse>(this.apiUrl, command);
  }

  updateEmployee(command: UpdateEmployeeCommand): Observable<UpdatedEmployeeResponse> {
    return this.http.put<UpdatedEmployeeResponse>(this.apiUrl, command);
  }

  updateStatusEmployee(command: UpdateStatusCommand): Observable<UpdatedStatusResponse> {
    return this.http.put<UpdatedStatusResponse>(`${this.apiUrl}/UpdateStatus`, command);
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
  getListEmployeesList(pageIndex: number, pageSize: number): Observable<GetListResponse<GetListEmployeeListResponse>> {
    let params = new HttpParams()
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
      
    return this.http.get<GetListResponse<GetListEmployeeListResponse>>(this.apiUrl, { params });
  }

  getUniversities(): Observable<UniversityList[]> {
    return this.http.get<UniversityList[]>(this.uniApiUrl);
  }
}
