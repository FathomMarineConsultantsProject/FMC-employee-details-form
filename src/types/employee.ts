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

// ✅ Reusable type for file inputs in react-hook-form
export type RHFFile = FileList | undefined;

export type EmployeeFormValues = {
  fullName: string;
  latestQualification: string;

  // ✅ Required file
  documentsFile: FileList;

  // If you are not using PR card fields in UI, keep optional.
  // If you want them mandatory, change to: string
  prCardName?: string;
  prCardValidity?: string;

  aadharName: string;
  aadharNumber: string;

  passportNumber?: string;
  passportValidity?: string;

  // If you're not using drivingLicense in UI, keep optional
  drivingLicense?: string;

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

  // ✅ Required file
  bankCancelledCheque: FileList;

  fatherName: string;
  motherName: string;

  // ✅ New family
  siblings: string;
  localGuardian: string;

  // ✅ Police Verification
  policeVerification: YesNo;
  policeStation?: string;
  policeReportFile?: RHFFile;

  // ✅ Medical Report (last 2 months)
  medicalReportRecent: YesNo;
  medicalReportFile?: RHFFile;

  // ✅ Emergency
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  emergencyContactRelation: string;

  // ✅ Other Details
  hobbies: string;
  booksLikeToRead: string;
  sportsYouPlay: string;
  favouriteArtist: string;
  favouriteCuisine: string;
  favouriteMoviesBollywood: string;

  tshirtSize: TshirtSize;
  shoeSize: string;

  // ✅ Medical insurance + issues
  hasMedicalInsurance: YesNo;
  medicalIssues?: string;
};

export type EmployeeCreateResponse = {
  id: number | string;
  message?: string;
};