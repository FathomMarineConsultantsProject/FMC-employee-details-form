import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import type { EmployeeFormValues } from "../types/employee";
import EmployeeFormFields from "./employeeFormFields";
import Button from "../ui/Button";
import { createEmployee } from "../api/employee.api";

const phoneRegex = /^[0-9+ -]{10,15}$/;

const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_DOC_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_DOC_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Optional upload docs (police/medical report) - you can keep 5MB too
const MAX_REPORT_SIZE = 5 * 1024 * 1024;
const ACCEPTED_REPORT_TYPES = [
  ...ACCEPTED_DOC_TYPES,
  "image/jpeg",
  "image/png",
  "image/webp",
];

const schema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    latestQualification: z.string().min(2, "Qualification is required"),

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
        "Only PDF / DOC / DOCX files allowed"
      ),

    aadharName: z.string().min(2, "Aadhar name is required"),
    aadharNumber: z
      .string()
      .regex(/^\d{12}$/, "Aadhar number must be exactly 12 digits"),

    passportNumber: z.string().optional(),
    passportValidity: z.string().optional(),

    panNumber: z
      .string()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i, "Invalid PAN format"),

    phoneNumber: z.string().regex(phoneRegex, "Invalid phone number"),

    email: z.string().email("Enter a valid email"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    postalCode: z
      .string()
      .min(4, "Postal code is required")
      .max(10, "Postal code too long"),

    fatherName: z.string().min(2, "Father name is required"),
    motherName: z.string().min(2, "Mother name is required"),

    // ✅ New family fields
    siblings: z.string().min(1, "Siblings field required"),
    localGuardian: z.string().min(2, "Local guardian required"),

    bankAccountHolderName: z.string().min(2, "Account holder name is required"),
    bankAccountNumber: z
      .string()
      .min(6, "Account number is required")
      .max(18, "Account number too long")
      .regex(/^\d+$/, "Account number must be numeric"),
    bankIfscCode: z
      .string()
      .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/i, "Invalid IFSC code"),
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

    // ✅ Police
    policeVerification: z.enum(["yes", "no"]),
    policeStation: z.string().optional().or(z.literal("")),
    policeReportFile: z.any().optional(),

    // ✅ Medical report
    medicalReportRecent: z.enum(["yes", "no"]),
    medicalReportFile: z.any().optional(),

    hasMedicalInsurance: z.enum(["yes", "no"]),
    medicalIssues: z.string().optional().or(z.literal("")),
  })
  // ✅ Require police station + report if policeVerification is yes
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
          message: "Police verification report is required",
        });
      } else {
        const file = f[0];
        if (file.size > MAX_REPORT_SIZE) {
          ctx.addIssue({
            code: "custom",
            path: ["policeReportFile"],
            message: "Police report max size is 5MB",
          });
        }
        if (!ACCEPTED_REPORT_TYPES.includes(file.type)) {
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
        const file = f[0];
        if (file.size > MAX_REPORT_SIZE) {
          ctx.addIssue({
            code: "custom",
            path: ["medicalReportFile"],
            message: "Medical report max size is 5MB",
          });
        }
        if (!ACCEPTED_REPORT_TYPES.includes(file.type)) {
          ctx.addIssue({
            code: "custom",
            path: ["medicalReportFile"],
            message: "Medical report must be PDF/DOC/DOCX or image",
          });
        }
      }
    }

    if (data.medicalIssues && data.medicalIssues.trim().length > 0 && data.medicalIssues.trim().length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["medicalIssues"],
        message: "Medical issues should be at least 2 characters",
      });
    }
  });

export default function EmployeeForm() {
  const [serverMsg, setServerMsg] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      latestQualification: "",
      documentsFile: undefined as any,

      prCardName: "",
      prCardValidity: "",

      aadharName: "",
      aadharNumber: "",

      passportNumber: "",
      passportValidity: "",

      drivingLicense: "",
      panNumber: "",

      phoneNumber: "",

      email: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",

      fatherName: "",
      motherName: "",

      siblings: "",
      localGuardian: "",

      bankAccountHolderName: "",
      bankAccountNumber: "",
      bankIfscCode: "",
      bankBranchName: "",
      bankCancelledCheque: undefined as any,

      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactEmail: "",
      emergencyContactRelation: "",

      hobbies: "",
      booksLikeToRead: "",
      sportsYouPlay: "",
      favouriteArtist: "",
      favouriteCuisine: "",
      favouriteMoviesBollywood: "",

      tshirtSize: "M",
      shoeSize: "",

      policeVerification: "no",
      policeStation: "",
      policeReportFile: undefined as any,

      medicalReportRecent: "no",
      medicalReportFile: undefined as any,

      hasMedicalInsurance: "no",
      medicalIssues: "",
    },
  });

  const onSubmit = async (values: EmployeeFormValues) => {
    setServerMsg("");

    try {
      const result = await createEmployee(values);
      toast.success("Form submitted successfully 🎉");
      // toast.success(`Submitted! ID: ${result.id}`);
      reset();
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Something went wrong.";
      toast.error(msg);
      setServerMsg(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <h1 className="text-2xl font-semibold text-white">
            Fathom Marine — Employee Details Form
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/90">
            Please enter accurate information. Fields marked{" "}
            <span className="font-semibold text-white">*</span> are mandatory.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Employee Information
                </p>
                <p className="text-xs text-slate-500">
                  Keep documents handy while filling this form.
                </p>
              </div>

              {serverMsg ? (
                <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  {serverMsg}
                </div>
              ) : null}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6">
            <EmployeeFormFields register={register} errors={errors} watch={watch} />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="submit" loading={isSubmitting}>
                Submit
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => reset()}
                disabled={isSubmitting}
              >
                Reset
              </Button>

              <p className="text-xs text-slate-500 sm:ml-auto">
                By submitting, you confirm the details are correct.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}