import { useState } from "react";
import {
  useForm,
  type SubmitHandler,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import EmployeeFormFields from "./employeeFormFields";
import Button from "../ui/Button";
import { createEmployee } from "../api/employee.api";
import { employeeSchema, type EmployeeFormValues } from "../types/employee";

export default function EmployeeForm() {
  const [serverMsg, setServerMsg] = useState("");

  // ✅ IMPORTANT: force resolver to be exactly Resolver<EmployeeFormValues>
  const resolver: Resolver<EmployeeFormValues> =
    zodResolver(employeeSchema) as unknown as Resolver<EmployeeFormValues>;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver,
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      latestQualification: "",

      prCardName: "",
      prCardValidity: "",
      drivingLicense: "",

      documentsFile: undefined as any,

      aadharName: "",
      aadharNumber: "",

      passportNumber: "",
      passportValidity: "",

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

  const onSubmit: SubmitHandler<EmployeeFormValues> = async (values) => {
    setServerMsg("");
    try {
      await createEmployee(values);
      toast.success("Form submitted successfully 🎉");
      reset();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Something went wrong.";
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