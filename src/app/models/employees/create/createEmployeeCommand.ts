export interface CreateEmployeeCommand  {
    departmentId:string;
    positionId:string;
    firstName:string;
    lastName:string;
    gender:string;
    phone:string;
    email:string;
    graduatedSchool:string;
    graduatedField:string;
    birthDate:Date;
    dateOfEntry:Date;
    asset:boolean;
    address:string;
  }
