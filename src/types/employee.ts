export type EmployeeFormValues = {
  // Existing
  fullName: string;
  latestQualification: string;
documentsFile: FileList;
  prCardName: string;
  prCardValidity: string;

  aadharName: string;
  aadharNumber: string;

  passportNumber?: string;
  passportValidity?: string;

  drivingLicense: string;
  panNumber: string;
  phoneNumber: string;

  // New: Contact
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

  // New: Family
  fatherName: string;
  motherName: string;

  // New: Emergency contact section
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactEmail: string;
  emergencyContactRelation: string;

  // New: Personal
  hobbies: string;
  booksLikeToRead: string;
sportsYouPlay: string;
favouriteArtist: string;
favouriteCuisine: string;
favouriteMoviesBollywood: string;

tshirtSize: "XS" | "S" | "M" | "L" | "XL" | "XXL"| "XXXL";
shoeSize: string; // keep as string so you can accept 6, 7, 8.5, 42 etc.

  // New: Medical
  hasMedicalInsurance: "yes" | "no";
  medicalIssues?: string;
};
// Later (when backend is ready) you can extend like:
export type EmployeeCreateRequest = EmployeeFormValues;

export type EmployeeCreateResponse = {
  id: number | string;
  message?: string;
};