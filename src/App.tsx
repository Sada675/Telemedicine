import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
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
    </Routes>
  );
}

export default App;