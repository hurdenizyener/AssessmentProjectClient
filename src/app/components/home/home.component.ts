import { Component, inject, ViewChild } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { MaterialModule } from '../material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { EmployeeComponent } from '../employee/employee.component';
import { GetListEmployeeListResponse } from '../../models/employees/getList/getListEmployeeListResponse';
import { ToastrService } from 'ngx-toastr';
import { response } from 'express';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'console';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  employeeList: GetListEmployeeListResponse[] = [];
  pageIndex: number = 0;
  pageSize: number = 10;
  dataLoaded = false;
  searchHide = false;
  filterText = '';
  displayedColumns: string[] = ['FirstName', 'LastName', 'Gender', 'Phone', 'Email', 'BirthDate', 'Department', 'Position', 'GraduatedSchool', 'GraduatedField', 'DateOfEntry', 'Asset', 'Status', 'Action'];
  dataSource: MatTableDataSource<GetListEmployeeListResponse> = new MatTableDataSource<GetListEmployeeListResponse>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageEvent!: PageEvent;



  constructor(
    private toastrService: ToastrService,
    private employeeService: EmployeeService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.getListEmployee();
  }

  getListEmployee() {
    this.employeeService.getListEmployeesList(this.pageIndex, this.pageSize).subscribe({
      next: (response) => this.employeeList = response.items,
      complete: () => this.getListEmployeeComplete()
    });
  }


  getListEmployeeComplete() {
    this.dataSource = new MatTableDataSource<GetListEmployeeListResponse>(this.employeeList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataLoaded = true;
  }

  onPageChange(event: PageEvent) {
    debugger
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getListEmployee();
  }

  onStatusChange(row: any, status: boolean) {
    const updateStatusCommand = {
      id: row.id,
      status: status
    };

    this.employeeService.updateStatusEmployee(updateStatusCommand).subscribe({
      next: (response) => this.toastrService.success(response.message, 'Başarılı'),
      error: (err) => this.toastrService.error(err, 'Başarısız'),
      complete: () => this.getListEmployee()
    });
  }


  filterDataSource() {
    this.dataSource.filter = this.filterText.trim().toLocaleLowerCase();
  }

  openAddDialog() {
    this.dialog
      .open(EmployeeComponent, {
        width: '700px',
        data: { status: true },
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'save') {
          this.getListEmployee();
        }
      });
  }

  openEditDialog(row: any) {
    this.dialog
      .open(EmployeeComponent, {
        width: '700px',
        data: { status: false, row }
      })
      .afterClosed()
      .subscribe((value) => {
        if (value === 'update') {
          this.getListEmployee();
        }
      });
  }


  deleteEmployee(row: any) {
    const isConfirmed = window.confirm('Silmek İstediğinize Emin Misiniz?');

    if (isConfirmed) {
      this.employeeService.deleteEmployee(row.id).subscribe(
        response => {
          this.toastrService.success(response.message, 'Başarılı'),
            this.getListEmployee();
        },
        reportError => this.toastrService.error(reportError.error.message, 'Başarısız')
      )
    }
    else {
      this.toastrService.info('Silme İşlemi İptal Edildi', 'İptal')
    }

  }


}
