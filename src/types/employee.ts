export type YesNo = "yes" | "no";

export type TshirtSize =
  | "XS"
  | "S"
  | "M"
  | "L"
  | "XL"
  | "XXL"
  | "XXXL"
  | "4XL"
  | "5XL";

export type EmployeeFormValues = {
  fullName: string;
  latestQualification: string;

  documentsFile: FileList;

  // (kept because you already have these in defaultValues; you can delete later if not used)
  prCardName: string;
  prCardValidity: string;

  aadharName: string;
  aadharNumber: string;

  passportNumber?: string;
  passportValidity?: string;

  drivingLicense: string;
  panNumber: string;
  phoneNumber: string;

  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;

  bankAccountHolderName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  bankBranchName: string;
  bankCancelledCheque: FileList;

  fatherName: string;
  motherName: string;

  // ✅ New family fields
  siblings: string;
  localGuardian: string;

  // ✅ Police verification
  policeVerification: YesNo;
  policeStation?: string;
  policeReportFile?: FileList;

  // ✅ Medical report
  medicalReportRecent: YesNo;
  medicalReportFile?: FileList;

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

  hasMedicalInsurance: YesNo;
  medicalIssues?: string;
};

export type EmployeeCreateRequest = EmployeeFormValues;

export type EmployeeCreateResponse = {
  id: number | string;
  message?: string;
};