import { Outlet } from "react-router-dom";
import PatientSidebar from "./PatientSidebar";
import PatientTopbar from "./PatientTopbar";

export default function PatientLayout() {
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <PatientSidebar />
      <main className="flex-1 p-4 md:p-6">
        <PatientTopbar />
        <Outlet />
      </main>
    </div>
  );
}
