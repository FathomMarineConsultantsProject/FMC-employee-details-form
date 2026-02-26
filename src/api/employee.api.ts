import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export async function createEmployee(formValues: any) {
  const fd = new FormData();

  // IMPORTANT: send all fields as JSON string
  fd.append("data", JSON.stringify(formValues));

  // IMPORTANT: file inputs are FileList in react-hook-form
  // adjust names below to exactly match your form fields
  fd.append("documentsFile", formValues.documentsFile?.[0]);
  fd.append("bankCancelledCheque", formValues.bankCancelledCheque?.[0]);
  fd.append("policeReportFile", values.policeReportFile?.[0]);
fd.append("medicalReportFile", values.medicalReportFile?.[0]);

  const res = await api.post("/employees/create", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}