import { z } from "zod";

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

// helper: always output string (never undefined)
const str = () =>
  z.preprocess((v) => (v === undefined || v === null ? "" : v), z.string());

const phoneRegex = /^[0-9+ -]{10,15}$/;

const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const MAX_DOC_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

const MAX_REPORT_SIZE = 5 * 1024 * 1024;
const ACCEPTED_REPORT_TYPES = [
  ...ACCEPTED_DOC_TYPES,
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const employeeSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    latestQualification: z.string().min(2, "Qualification is required"),

    prCardName: str(),
    prCardValidity: str(),
    drivingLicense: str(),

    documentsFile: z
      .any()
      .refine(
        (files) => files instanceof FileList && files.length === 1,
        "Document file is required"
      )
      .refine(
        (files) => files?.[0]?.size <= MAX_DOC_FILE_SIZE,
        "Max file size is 5MB"
      )
      .refine(
        (files) => ACCEPTED_DOC_TYPES.includes(files?.[0]?.type),
        "Only PDF / DOC / DOCX allowed"
      ),

    aadharName: z.string().min(2, "Aadhar name is required"),
    aadharNumber: z.string().regex(/^\d{12}$/, "Aadhar number must be exactly 12 digits"),

    passportNumber: str(),
    passportValidity: str(),

    panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, "Invalid PAN format"),
    phoneNumber: z.string().regex(phoneRegex, "Invalid phone number"),

    email: z.string().email("Enter a valid email"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    postalCode: z.string().min(4, "Postal code is required").max(10, "Postal code too long"),

    fatherName: z.string().min(2, "Father name is required"),
    motherName: z.string().min(2, "Mother name is required"),

    siblings: z.string().min(1, "Siblings field required"),
    localGuardian: str(),

    bankAccountHolderName: z.string().min(2, "Account holder name is required"),
    bankAccountNumber: z
      .string()
      .min(6, "Account number is required")
      .max(18, "Account number too long")
      .regex(/^\d+$/, "Account number must be numeric"),
    bankIfscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/i, "Invalid IFSC code"),
    bankBranchName: z.string().min(2, "Branch name is required"),

    bankCancelledCheque: z
      .any()
      .refine(
        (files) => files instanceof FileList && files.length === 1,
        "Cancelled cheque photo is required"
      )
      .refine((files) => files?.[0]?.size <= MAX_IMAGE_SIZE, "Max file size is 3MB")
      .refine(
        (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        "Only JPG/PNG/WebP allowed"
      ),

    emergencyContactName: z.string().min(2, "Emergency contact name is required"),
    emergencyContactPhone: z.string().regex(phoneRegex, "Invalid emergency phone"),
    emergencyContactEmail: z.string().email("Enter a valid emergency email"),
    emergencyContactRelation: z.string().min(2, "Relation is required"),

    hobbies: z.string().min(2, "Hobbies is required"),
    booksLikeToRead: z.string().min(2, "This field is required"),
    sportsYouPlay: z.string().min(2, "This field is required"),
    favouriteArtist: z.string().min(2, "This field is required"),
    favouriteCuisine: z.string().min(2, "This field is required"),
    favouriteMoviesBollywood: z.string().min(2, "This field is required"),

    tshirtSize: z.enum(["XS", "S", "M", "L", "XL", "XXL", "XXXL", "4XL", "5XL"]),
    shoeSize: z.string().min(1, "Shoe size is required"),

    policeVerification: z.enum(["yes", "no"]),
    policeStation: str(),
    policeReportFile: z.any().optional(),

    medicalReportRecent: z.enum(["yes", "no"]),
    medicalReportFile: z.any().optional(),

    hasMedicalInsurance: z.enum(["yes", "no"]),
    medicalIssues: str(),
  })
  .superRefine((data, ctx) => {
    if (data.policeVerification === "yes") {
      if (!data.policeStation || data.policeStation.trim().length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["policeStation"],
          message: "Police station is required",
        });
      }

      const f = data.policeReportFile as FileList | undefined;
      if (!f || f.length !== 1) {
        ctx.addIssue({
          code: "custom",
          path: ["policeReportFile"],
          message: "Police report is required",
        });
      } else {
        if (f[0].size > MAX_REPORT_SIZE) {
          ctx.addIssue({
            code: "custom",
            path: ["policeReportFile"],
            message: "Police report max size is 5MB",
          });
        }
        if (!ACCEPTED_REPORT_TYPES.includes(f[0].type as any)) {
          ctx.addIssue({
            code: "custom",
            path: ["policeReportFile"],
            message: "Police report must be PDF/DOC/DOCX or image",
          });
        }
      }
    }

    if (data.medicalReportRecent === "yes") {
      const f = data.medicalReportFile as FileList | undefined;
      if (!f || f.length !== 1) {
        ctx.addIssue({
          code: "custom",
          path: ["medicalReportFile"],
          message: "Medical report is required",
        });
      } else {
        if (f[0].size > MAX_REPORT_SIZE) {
          ctx.addIssue({
            code: "custom",
            path: ["medicalReportFile"],
            message: "Medical report max size is 5MB",
          });
        }
        if (!ACCEPTED_REPORT_TYPES.includes(f[0].type as any)) {
          ctx.addIssue({
            code: "custom",
            path: ["medicalReportFile"],
            message: "Medical report must be PDF/DOC/DOCX or image",
          });
        }
      }
    }
  });

// ✅ This is the ONLY type you should use everywhere
export type EmployeeFormValues = z.infer<typeof employeeSchema>;

export type EmployeeCreateResponse = {
  success: boolean;
  message?: string;
  id?: string | number;
};