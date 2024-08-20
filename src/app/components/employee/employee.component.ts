import { ChangeDetectionStrategy, Component, Inject, model } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../material/material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../services/employee.service';
import { GetListDepartmentListResponse } from '../../models/departments/getListDepartmentListResponse';
import { DepartmentService } from '../../services/department.service';
import { GetListDepartmentPositionsList } from '../../models/positions/getListDepartmentPositionListResponse';
import { PositionService } from '../../services/position.service';
import { UniversityList } from '../../models/employees/universityList';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {
  departmentList: GetListDepartmentListResponse[] = [];
  positionList: GetListDepartmentPositionsList[] = [];
  universityList: UniversityList[] = [];
  employeeForm!: FormGroup;
  actionBtnName: string = 'Kaydet';
  dialogTitle: string = 'Personel Ekle';



  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private positionService: PositionService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EmployeeComponent>) {
  }


  ngOnInit(): void {
    console.log(this.data);
    this.getForms();
    this.getAllDepartment();
    this.getUniversities();
    
  }

  getAllDepartment() {
    this.departmentService.getAllDepartmentList().subscribe({
      next: (response) => this.departmentList = response,
      error: (err) => console.error('Departman Yükleme Hatası', err)
    });
  }

  getUniversities() {
    this.employeeService.getUniversities().subscribe({
      next: (response) => this.universityList = response,
      error: (err) => console.error('Üniversiteler yüklenemedi.Lütfen daha sonra tekrar deneyin.', err)
    });
  }

  getAllDepartmentPositionList(deparmentId: string) {
    this.positionService.getListDepartmentPositionsList(deparmentId).subscribe({
      next: (response) => this.positionList = response,
      error: (err) => console.error('Departman Pozisyonları Yükleme Hatası', err),
    });
  }

  onDepartmentChange(departmentId: string): void {
    if (departmentId) {
      this.getAllDepartmentPositionList(departmentId);
    } else {
      this.positionList = [];
    }
  }

  getForms() {
    this.createEmployeeForm();
    if (!this.data.status) {
      this.onDepartmentChange(this.data.row.departmentId);
      this.editEmployeeForm();
      this.dialogTitle='Personel Güncelle'
      this.actionBtnName='Güncelle'
    }
  }
  createEmployeeForm() {
    if (this.data.status) {
      this.employeeForm = this.formBuilder.group({
        departmentId: ['', Validators.required],
        positionId: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', Validators.email],
        graduatedSchool: ['', Validators.required],
        graduatedField: ['', Validators.required],
        birthDate: [''],
        dateOfEntry: [''],
        asset: ['', Validators.required],
        address: [''],
      });
    } else if (!this.data.status) {
      this.employeeForm = this.formBuilder.group({
        id: [this.data.row.id],
        departmentId: ['', Validators.required],
        positionId: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', Validators.email],
        graduatedSchool: ['', Validators.required],
        graduatedField: ['', Validators.required],
        birthDate: [''],
        dateOfEntry: [''],
        asset: ['', Validators.required],
        address: [''],
        status: [this.data.row.status],
      });
    }
  }

  editEmployeeForm() {
    this.employeeForm.controls['departmentId'].setValue(
      this.data.row.departmentId
    );
    this.employeeForm.controls['positionId'].setValue(
      this.data.row.positionId
    );
    this.employeeForm.controls['firstName'].setValue(
      this.data.row.firstName
    );
    this.employeeForm.controls['lastName'].setValue(
      this.data.row.lastName
    );
    this.employeeForm.controls['gender'].setValue(
      this.data.row.gender
    );
    this.employeeForm.controls['phone'].setValue(
      this.data.row.phone
    );
    this.employeeForm.controls['email'].setValue(
      this.data.row.email
    );
    this.employeeForm.controls['graduatedSchool'].setValue(
      this.data.row.graduatedSchool
    );
    this.employeeForm.controls['graduatedField'].setValue(
      this.data.row.graduatedField
    );
    this.employeeForm.controls['birthDate'].setValue(
      this.data.row.birthDate
    );
    this.employeeForm.controls['dateOfEntry'].setValue(
      this.data.row.dateOfEntry
    );
    this.employeeForm.controls['asset'].setValue(
      this.data.row.asset
    );
    this.employeeForm.controls['address'].setValue(
      this.data.row.address
    );
  }



  statusControl() {
    if (this.data.status) {
      this.add();
    } else if (!this.data.status) {
      this.update();
    }
  }

  add() {
    if (this.employeeForm.valid) {
      let employeeModel = Object.assign({}, this.employeeForm.value);
      this.employeeService.addEmployee(employeeModel).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı');
          this.employeeForm.reset();
          this.dialogRef.close('save');
        },
        (responseError) => {
          if (responseError.error.ValidationErrors == undefined) {
            this.toastrService.error(responseError.error, 'Dikkat');
          } else {
            if (responseError.error.ValidationErrors.length > 0) {
              for (
                let i = 0;
                i < responseError.error.ValidationErrors.length;
                i++
              ) {
                this.toastrService.error(
                  responseError.error.ValidationErrors[i].ErrorMessage,
                  'Doğrulama Hatası'
                );
              }
            }
          }
        }
      );
    } else {
      this.toastrService.error(
        'Lütfen Tüm Zorunlu Alanları Doldurun',
        'Dikkat'
      );
    }
  }

  update() {
    let employeeModel = Object.assign({}, this.employeeForm.value);
    console.log(employeeModel);
    if (this.employeeForm.valid) {
      let employeeModel = Object.assign({}, this.employeeForm.value);
      this.employeeService.updateEmployee(employeeModel).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı');
          this.employeeForm.reset();
          this.dialogRef.close('update');
        },
        (responseError) => {
          if (responseError.error.ValidationErrors == undefined) {
            this.toastrService.error(responseError.error, 'Dikkat');
          } else {
            if (responseError.error.ValidationErrors.length > 0) {
              for (
                let i = 0;
                i < responseError.error.ValidationErrors.length;
                i++
              ) {
                this.toastrService.error(
                  responseError.error.ValidationErrors[i].ErrorMessage,
                  'Doğrulama Hatası'
                );
              }
            }
          }
        }
      );
    } else {
      this.toastrService.error('Lütfen Tüm Zorunlu Alanları Doldurun', 'Dikkat');
    }
  }
}

