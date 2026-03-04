import axios from "axios";
import type { EmployeeCreateResponse, EmployeeFormValues } from "../types/employee";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "https://fathom-financier-backend.onrender.com",
});

export async function createEmployee(
  formValues: EmployeeFormValues
): Promise<EmployeeCreateResponse> {
  const fd = new FormData();

  const payload = {
    ...formValues,
    documentsFile: undefined,
    bankCancelledCheque: undefined,
    policeReportFile: undefined,
    medicalReportFile: undefined,
  };

  fd.append("data", JSON.stringify(payload));

  // ✅ Required files (guard)
  const doc = formValues.documentsFile?.[0];
  if (!doc) throw new Error("documentsFile is missing");
  fd.append("documentsFile", doc);

  const cheque = formValues.bankCancelledCheque?.[0];
  if (!cheque) throw new Error("bankCancelledCheque is missing");
  fd.append("bankCancelledCheque", cheque);

  // ✅ Optional files
  if (formValues.policeReportFile?.length) {
    fd.append("policeReportFile", formValues.policeReportFile[0]);
  }
  if (formValues.medicalReportFile?.length) {
    fd.append("medicalReportFile", formValues.medicalReportFile[0]);
  }

  const res = await api.post("/employees/create", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}