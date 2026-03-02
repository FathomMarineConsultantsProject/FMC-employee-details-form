// src/types/employee.ts
export type YesNo = "yes" | "no";
export type TshirtSize = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | "4XL" | "5XL";

export type EmployeeFormValues = {
  fullName: string;
  latestQualification: string;

  prCardName?: string;
  prCardValidity?: string;
  drivingLicense?: string;

  // In react-hook-form, file input gives FileList | undefined at first
  documentsFile: FileList;

  aadharName: string;
  aadharNumber: string;

  passportNumber?: string;
  passportValidity?: string;

  panNumber: string;
  phoneNumber: string;

  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;

  fatherName: string;
  motherName: string;

  siblings: string;
  localGuardian: string;

  bankAccountHolderName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  bankBranchName: string;

  bankCancelledCheque: FileList;

  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  emergencyContactRelation: string;

  hobbies: string;
  booksLikeToRead: string;
  sportsYouPlay: string;
  favouriteArtist: string;
  favouriteCuisine: string;
  favouriteMoviesBollywood: string;

  tshirtSize: TshirtSize;
  shoeSize: string;

  policeVerification: YesNo;
  policeStation?: string;
  policeReportFile?: FileList;

  medicalReportRecent: YesNo;
  medicalReportFile?: FileList;

  hasMedicalInsurance: YesNo;
  medicalIssues?: string;
};

export type EmployeeCreateResponse = {
  success: boolean;
  message?: string;
  id?: string | number;
};