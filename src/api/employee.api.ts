import axios from "axios";
import type { EmployeeFormValues } from "../types/employee";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
});

export async function createEmployee(values: EmployeeFormValues) {
  const fd = new FormData();

  // ✅ Required files
  fd.append("documentsFile", values.documentsFile?.[0]);
  fd.append("bankCancelledCheque", values.bankCancelledCheque?.[0]);

  // ✅ Optional files (only attach if provided)
  if (values.policeReportFile?.length) {
    fd.append("policeReportFile", values.policeReportFile[0]);
  }
  if (values.medicalReportFile?.length) {
    fd.append("medicalReportFile", values.medicalReportFile[0]);
  }

  // ✅ JSON should NOT include FileList fields
  const {
    documentsFile,
    bankCancelledCheque,
    policeReportFile,
    medicalReportFile,
    ...jsonData
  } = values;

  fd.append("data", JSON.stringify(jsonData));

  const res = await api.post("/employees/create", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}