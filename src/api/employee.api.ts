// src/api/employee.api.ts
import axios from "axios";
import type { EmployeeFormValues, EmployeeCreateResponse } from "../types/employee";

// ✅ IMPORTANT: change this when deploying
// local: "http://127.0.0.1:8000"
// production: your backend url
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://fathom-financier-backend.onrender.com" ||
});

export async function createEmployee(
  formValues: EmployeeFormValues
): Promise<EmployeeCreateResponse> {
  const fd = new FormData();

  // ✅ Send JSON (without files)
  const payload = {
    ...formValues,
    documentsFile: undefined,
    bankCancelledCheque: undefined,
    policeReportFile: undefined,
    medicalReportFile: undefined,
  };

  fd.append("data", JSON.stringify(payload));

  // ✅ Required files
  fd.append("documentsFile", formValues.documentsFile[0]);
fd.append("bankCancelledCheque", formValues.bankCancelledCheque[0]);

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