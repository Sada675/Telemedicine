import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DoctorLogin from "./pages/DoctorLogin";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PatientDashboard from "./pages/PatientDashboard";
import BookAppointment from "./pages/BookAppointment";
import ReviewAppointment from "./pages/ReviewAppointment";
import Payment from "./pages/Payment";
import AppointmentConfirmation from "./pages/AppointmentConfirmation";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescriptions";
import Consultation from "./pages/Consultation";
import MyProfile from "./pages/MyProfile";
import Notifications from "./pages/Notifications";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPrescriptions from "./pages/DoctorPrescriptions";
import DoctorAvailability from "./pages/DoctorAvailability";
import OnlineConsultation from "./pages/OnlineConsultation";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ManageDoctors from "./pages/ManageDoctors";
import ManagePatients from "./pages/ManagePatients";
import ManageAppointments from "./pages/ManageAppointments";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/patient-login" element={<Login />} />
      <Route path="/doctor-login" element={<DoctorLogin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/patient-dashboard" element={<PatientDashboard />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/review-appointment" element={<ReviewAppointment />}/>
      <Route path="/payment" element={<Payment />} />
      <Route path="/appointment-confirmation" element={<AppointmentConfirmation />}/>
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/prescriptions" element={<Prescriptions />} />
      <Route path="/consultation" element={<Consultation />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/doctor-dashboard" element={<DoctorDashboard />}/>
      <Route path="/doctor-appointments" element={<DoctorAppointments />}/>
      <Route path="/doctor-prescriptions" element={<DoctorPrescriptions />}/>
      <Route path="/doctor-availability" element={<DoctorAvailability />}/>
      <Route path="/online-consultation" element={<OnlineConsultation />}/>
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/manage-doctors" element={<ManageDoctors />} />
      <Route path="/manage-patients" element={<ManagePatients />} />
      <Route path="/manage-appointments" element={<ManageAppointments />}/>
      </Route>
      

    </Routes>
  );
}

export default App;