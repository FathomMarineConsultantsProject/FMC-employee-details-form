import { useEffect, useMemo, useState } from "react";
import type { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import type { EmployeeFormValues } from "../types/employee";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";

type Props = {
  register: UseFormRegister<EmployeeFormValues>;
  errors: FieldErrors<EmployeeFormValues>;
  watch: UseFormWatch<EmployeeFormValues>;
};

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-6 md:grid-cols-2">{children}</div>;
}

function SectionTitle({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="pt-2">
      <div className="flex items-start gap-3">
        <span className="mt-1 h-8 w-1.5 rounded-full bg-teal-600/80" />
        <div>
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          {desc ? <p className="mt-1 text-sm text-slate-500">{desc}</p> : null}
        </div>
      </div>
      <div className="mt-5 border-b border-slate-100" />
    </div>
  );
}

function FileUploadBox({
  label,
  required,
  helper,
  accept,
  registerProps,
  error,
  preview,
  previewMeta,
}: {
  label: string;
  required?: boolean;
  helper: string;
  accept: string;
  registerProps: any;
  error?: string;
  preview?: string | null;
  previewMeta?: { name: string; sizeMb: string } | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <label className="text-base font-semibold text-slate-800">
        {label} {required ? <span className="text-rose-500">*</span> : null}
      </label>
      <p className="mt-1 text-sm text-slate-500">{helper}</p>

      <input
        type="file"
        accept={accept}
        className="mt-4 block w-full cursor-pointer rounded-xl border border-slate-300 bg-white text-base
                   file:mr-4 file:rounded-lg file:border-0 file:bg-teal-600 file:px-5 file:py-3
                   file:text-base file:font-semibold file:text-white hover:file:bg-teal-700"
        {...registerProps}
      />

      {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}

      {preview && previewMeta ? (
        <div className="mt-5 flex items-start gap-4">
          <img
            src={preview}
            alt="Preview"
            className="h-28 w-44 rounded-xl border border-slate-200 bg-white object-cover"
          />
          <div className="text-sm text-slate-600">
            <p className="font-semibold text-slate-800">{previewMeta.name}</p>
            <p>Size: {previewMeta.sizeMb} MB</p>
            <p className="mt-2 text-slate-500">Make sure details are clearly visible.</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function EmployeeFormFields({ register, errors, watch }: Props) {
  // ✅ Cancelled cheque preview
  const chequeFiles = watch("bankCancelledCheque");
  const chequeFile = chequeFiles?.[0];

  const [chequePreview, setChequePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!chequeFile) {
      setChequePreview(null);
      return;
    }
    const url = URL.createObjectURL(chequeFile);
    setChequePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [chequeFile]);

  const chequeMeta = useMemo(() => {
    if (!chequeFile) return null;
    return {
      name: chequeFile.name,
      sizeMb: (chequeFile.size / (1024 * 1024)).toFixed(2),
    };
  }, [chequeFile]);

  // ✅ Police & Medical conditional flags
  const policeVerification = watch("policeVerification");
  const medicalReportRecent = watch("medicalReportRecent");

  return (
    <div className="space-y-8">
      <SectionTitle title="Basic Details" desc="Personal and education details" />

      <Grid>
        <Input
          label="Full Name"
          requiredMark
          placeholder="Enter your answer"
          error={errors.fullName?.message as string | undefined}
          {...register("fullName")}
        />
        <Input
          label="Latest Qualification (10th, 12th, Graduation, PG if any)"
          requiredMark
          placeholder="Enter your answer"
          error={errors.latestQualification?.message as string | undefined}
          {...register("latestQualification")}
        />
      </Grid>

      <FileUploadBox
        label="Relieving/Experience letter"
        required
        helper="Upload PDF / DOC / DOCX. Max size 5MB."
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        registerProps={register("documentsFile")}
        error={errors.documentsFile?.message ? String(errors.documentsFile.message) : undefined}
      />

      <SectionTitle title="Contact Details" desc="How we can reach you" />

      <Grid>
        <Input
          label="Email Address"
          requiredMark
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message as string | undefined}
          {...register("email")}
        />
        <Input
          label="Phone Number"
          requiredMark
          placeholder="Enter phone number"
          inputMode="tel"
          error={errors.phoneNumber?.message as string | undefined}
          {...register("phoneNumber")}
        />
      </Grid>

      <Textarea
        label="Address"
        requiredMark
        placeholder="House no, street, area"
        rows={3}
        error={errors.address?.message as string | undefined}
        {...register("address")}
      />

      <Grid>
        <Input
          label="City"
          requiredMark
          placeholder="Enter city"
          error={errors.city?.message as string | undefined}
          {...register("city")}
        />
        <Input
          label="State"
          requiredMark
          placeholder="Enter state"
          error={errors.state?.message as string | undefined}
          {...register("state")}
        />
      </Grid>

      <Grid>
        <Input
          label="Postal Code"
          requiredMark
          placeholder="Enter postal code"
          error={errors.postalCode?.message as string | undefined}
          {...register("postalCode")}
        />
        <div />
      </Grid>

      <SectionTitle title="Bank Details" desc="Salary account information" />

      <Grid>
        <Input
          label="Account Holder Name"
          requiredMark
          placeholder="Enter account holder name"
          error={errors.bankAccountHolderName?.message as string | undefined}
          {...register("bankAccountHolderName")}
        />
        <Input
          label="Account Number"
          requiredMark
          placeholder="Enter account number"
          inputMode="numeric"
          error={errors.bankAccountNumber?.message as string | undefined}
          {...register("bankAccountNumber")}
        />
      </Grid>

      <Grid>
        <Input
          label="IFSC Code"
          requiredMark
          placeholder="Example: HDFC0001234"
          hint="Format: XXXX0XXXXXX"
          error={errors.bankIfscCode?.message as string | undefined}
          {...register("bankIfscCode")}
        />
        <Input
          label="Branch Name"
          requiredMark
          placeholder="Enter branch name"
          error={errors.bankBranchName?.message as string | undefined}
          {...register("bankBranchName")}
        />
      </Grid>

      <FileUploadBox
        label="Upload Cancelled Cheque"
        required
        helper="JPG / PNG / WebP only. Max size 3MB."
        accept="image/png,image/jpeg,image/webp"
        registerProps={register("bankCancelledCheque")}
        error={errors.bankCancelledCheque?.message ? String(errors.bankCancelledCheque.message) : undefined}
        preview={chequePreview}
        previewMeta={chequeMeta}
      />

      <SectionTitle title="ID Details" desc="Government ID information" />

      <Grid>
        <Input
          label="Name on the Aadhar card"
          requiredMark
          placeholder="Enter your answer"
          error={errors.aadharName?.message as string | undefined}
          {...register("aadharName")}
        />
        <Input
          label="Aadhar Card Number"
          requiredMark
          placeholder="12 digits"
          inputMode="numeric"
          hint="We store this securely."
          error={errors.aadharNumber?.message as string | undefined}
          {...register("aadharNumber")}
        />
      </Grid>

      <Grid>
        <Input
          label="Passport Number"
          placeholder="Enter your answer"
          error={errors.passportNumber?.message as string | undefined}
          {...register("passportNumber")}
        />
        <Input
          label="Passport Validity"
          type="date"
          error={errors.passportValidity?.message as string | undefined}
          {...register("passportValidity")}
        />
      </Grid>

      <Grid>
        <Input
          label="PAN Card Number"
          requiredMark
          placeholder="ABCDE1234F"
          hint="Example format: ABCDE1234F"
          error={errors.panNumber?.message as string | undefined}
          {...register("panNumber")}
        />
        <div />
      </Grid>

      <SectionTitle title="Family Details" desc="Parent + guardian information" />

      <Grid>
        <Input
          label="Father's Name"
          requiredMark
          placeholder="Enter father name"
          error={errors.fatherName?.message as string | undefined}
          {...register("fatherName")}
        />
        <Input
          label="Mother's Name"
          requiredMark
          placeholder="Enter mother name"
          error={errors.motherName?.message as string | undefined}
          {...register("motherName")}
        />
      </Grid>

      {/* ✅ New fields */}
      <Grid>
        <Input
          label="Siblings"
          requiredMark
          placeholder="Number or names"
          error={errors.siblings?.message as string | undefined}
          {...register("siblings")}
        />
        <Input
          label="Local Guardian"
          // requiredMark
          placeholder="Enter guardian name"
          error={errors.localGuardian?.message as string | undefined}
          {...register("localGuardian")}
        />
      </Grid>

      <SectionTitle title="Emergency Contact" desc="In case we need to reach someone quickly" />

      <Grid>
        <Input
          label="Emergency Contact Name"
          requiredMark
          placeholder="Enter name"
          error={errors.emergencyContactName?.message as string | undefined}
          {...register("emergencyContactName")}
        />
        <Input
          label="Relation"
          requiredMark
          placeholder="Father / Mother / Spouse"
          error={errors.emergencyContactRelation?.message as string | undefined}
          {...register("emergencyContactRelation")}
        />
      </Grid>

      <Grid>
        <Input
          label="Emergency Phone"
          requiredMark
          placeholder="Enter phone"
          inputMode="tel"
          error={errors.emergencyContactPhone?.message as string | undefined}
          {...register("emergencyContactPhone")}
        />
        <Input
          label="Emergency Email"
          requiredMark
          type="email"
          placeholder="name@example.com"
          error={errors.emergencyContactEmail?.message as string | undefined}
          {...register("emergencyContactEmail")}
        />
      </Grid>

      <SectionTitle title="Other Details" desc="Additional information" />

      <Grid>
        <Input
          label="Hobbies"
          requiredMark
          placeholder="Example: Reading, Gym, Music"
          error={errors.hobbies?.message as string | undefined}
          {...register("hobbies")}
        />
        <Input
          label="What kind of books you like to read?"
          requiredMark
          placeholder="Enter your answer"
          error={errors.booksLikeToRead?.message as string | undefined}
          {...register("booksLikeToRead")}
        />
      </Grid>

      <Grid>
        <Input
          label="What sports you play?"
          requiredMark
          placeholder="Enter your answer"
          error={errors.sportsYouPlay?.message as string | undefined}
          {...register("sportsYouPlay")}
        />
        <Input
          label="Your favourite artist?"
          requiredMark
          placeholder="Enter your answer"
          error={errors.favouriteArtist?.message as string | undefined}
          {...register("favouriteArtist")}
        />
      </Grid>

      <Grid>
        <Input
          label="Your favourite cuisine?"
          requiredMark
          placeholder="Enter your answer"
          error={errors.favouriteCuisine?.message as string | undefined}
          {...register("favouriteCuisine")}
        />
        <Input
          label="Your favourite movies? (Bollywood)"
          requiredMark
          placeholder="Enter your answer"
          error={errors.favouriteMoviesBollywood?.message as string | undefined}
          {...register("favouriteMoviesBollywood")}
        />
      </Grid>

      <Grid>
        <div>
          <label className="text-base font-semibold text-slate-800">
            T-shirt Size <span className="text-rose-500">*</span>
          </label>

          <select
            className={[
              "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900",
              "shadow-sm outline-none transition",
              "focus:border-teal-500 focus:ring-4 focus:ring-teal-100",
            ].join(" ")}
            {...register("tshirtSize")}
          >
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>

          {errors.tshirtSize?.message ? (
            <p className="mt-2 text-sm font-medium text-rose-600">
              {String(errors.tshirtSize.message)}
            </p>
          ) : null}
        </div>

        <Input
          label="Shoe Size"
          requiredMark
          placeholder="Example: 8 / 8.5 / 42"
          error={errors.shoeSize?.message as string | undefined}
          {...register("shoeSize")}
        />
      </Grid>

      <SectionTitle title="Police Verification" desc="Security compliance details" />

      <Grid>
        <div>
          <label className="text-base font-semibold text-slate-800">
            Police Verification Done? <span className="text-rose-500">*</span>
          </label>

          <select
            className={[
              "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900",
              "shadow-sm outline-none transition",
              "focus:border-teal-500 focus:ring-4 focus:ring-teal-100",
            ].join(" ")}
            {...register("policeVerification")}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>

          {errors.policeVerification?.message ? (
            <p className="mt-2 text-sm font-medium text-rose-600">
              {String(errors.policeVerification.message)}
            </p>
          ) : null}
        </div>

        <Input
          label="Which Police Station?"
          placeholder="Enter police station name"
          error={errors.policeStation?.message as string | undefined}
          {...register("policeStation")}
        />
      </Grid>

      {policeVerification === "yes" && (
        <FileUploadBox
          label="Upload Police Verification Report"
          required
          helper="Upload PDF / JPG / PNG. Max size 5MB."
          accept="application/pdf,image/png,image/jpeg"
          registerProps={register("policeReportFile")}
          error={errors.policeReportFile?.message ? String(errors.policeReportFile.message) : undefined}
        />
      )}

      <SectionTitle title="Medical Details" desc="For safety and support" />

      <Grid>
        <div>
          <label className="text-base font-semibold text-slate-800">
            Do you have a medical insurance? <span className="text-rose-500">*</span>
          </label>

          <select
            className={[
              "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900",
              "shadow-sm outline-none transition",
              "focus:border-teal-500 focus:ring-4 focus:ring-teal-100",
            ].join(" ")}
            {...register("hasMedicalInsurance")}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>

          {errors.hasMedicalInsurance?.message ? (
            <p className="mt-2 text-sm font-medium text-rose-600">
              {String(errors.hasMedicalInsurance.message)}
            </p>
          ) : null}
        </div>

        <Textarea
          label="Any medical issues"
          placeholder="Mention if any (or write 'None')"
          rows={3}
          error={errors.medicalIssues?.message as string | undefined}
          {...register("medicalIssues")}
        />
      </Grid>

      <Grid>
        <div>
          <label className="text-base font-semibold text-slate-800">
            Medical Report Within Last 2 Months? <span className="text-rose-500">*</span>
          </label>

          <select
            className={[
              "mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900",
              "shadow-sm outline-none transition",
              "focus:border-teal-500 focus:ring-4 focus:ring-teal-100",
            ].join(" ")}
            {...register("medicalReportRecent")}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>

          {errors.medicalReportRecent?.message ? (
            <p className="mt-2 text-sm font-medium text-rose-600">
              {String(errors.medicalReportRecent.message)}
            </p>
          ) : null}
        </div>

        <div />
      </Grid>

      {medicalReportRecent === "yes" && (
        <FileUploadBox
          label="Upload Medical Report"
          required
          helper="Upload PDF / JPG / PNG. Max size 5MB."
          accept="application/pdf,image/png,image/jpeg"
          registerProps={register("medicalReportFile")}
          error={errors.medicalReportFile?.message ? String(errors.medicalReportFile.message) : undefined}
        />
      )}
    </div>
  );
}