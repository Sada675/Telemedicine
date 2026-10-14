import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCheck,
  Clock3,
  FileText,
  Maximize2,
  MessageCircle,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Video,
  VideoOff,
} from "lucide-react";

import Navbar from "../components/Navbar";

type ChatMessage = {
  id: number;
  sender: "doctor" | "patient";
  message: string;
  time: string;
};

function OnlineConsultation() {
  const navigate = useNavigate();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [callStarted, setCallStarted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);

  const [callSeconds, setCallSeconds] = useState(0);
  const [cameraError, setCameraError] = useState("");

  const [activeTab, setActiveTab] = useState<
    "patient" | "notes" | "chat"
  >("patient");

  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  const [messageInput, setMessageInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: "patient",
      message: "Hello doctor, can you hear me?",
      time: "04:00 PM",
    },
    {
      id: 2,
      sender: "doctor",
      message: "Hello! Yes, I can hear you. How are you feeling today?",
      time: "04:01 PM",
    },
  ]);

  // Demo patient information.
  // Later, load these details from your appointment/database.
  const patient = {
    name: "Ayesha Khan",
    age: 28,
    gender: "Female",
    appointmentDate: "Today",
    appointmentTime: "04:00 PM",
    reason: "Recurring headaches and dizziness",
    appointmentId: "APT-1024",
  };

  const doctor = {
    name: "Dr. Munib",
    specialty: "Medical Specialist",
    qualifications: "MBBS, FCPS",
  };

  // Attach the local camera stream to the video element.
  useEffect(() => {
    if (localVideoRef.current && streamRef.current) {
      localVideoRef.current.srcObject = streamRef.current;
    }
  }, [cameraEnabled, callStarted]);

  // Consultation timer.
  useEffect(() => {
    if (!callStarted || callEnded) return;

    const interval = window.setInterval(() => {
      setCallSeconds((previous) => previous + 1);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [callStarted, callEnded]);

  // Automatically scroll chat to the latest message.
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, activeTab]);

  // Stop camera and microphone when leaving the page.
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const formattedTimer = `${String(
    Math.floor(callSeconds / 3600),
  ).padStart(2, "0")}:${String(
    Math.floor((callSeconds % 3600) / 60),
  ).padStart(2, "0")}:${String(callSeconds % 60).padStart(2, "0")}`;

  // Start immediately without a confirmation popup.
  const startConsultation = () => {
    setCallStarted(true);
    setCallEnded(false);
    setCameraError("");
    setCallSeconds(0);
  };

  const toggleCamera = async () => {
    setCameraError("");

    try {
      if (cameraEnabled && streamRef.current) {
        streamRef.current.getVideoTracks().forEach((track) => {
          track.stop();
          streamRef.current?.removeTrack(track);
        });

        setCameraEnabled(false);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = null;
        }

        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: micEnabled,
      });

      streamRef.current?.getTracks().forEach((track) => track.stop());

      streamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setCameraEnabled(stream.getVideoTracks().length > 0);
      setMicEnabled(stream.getAudioTracks().length > 0);
    } catch {
      setCameraError(
        "Camera access was denied or is unavailable. Please allow camera access in your browser settings.",
      );
    }
  };

  const toggleMicrophone = async () => {
    setCameraError("");

    try {
      if (micEnabled && streamRef.current) {
        streamRef.current.getAudioTracks().forEach((track) => {
          track.stop();
          streamRef.current?.removeTrack(track);
        });

        setMicEnabled(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: cameraEnabled,
      });

      streamRef.current?.getTracks().forEach((track) => track.stop());

      streamRef.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setMicEnabled(stream.getAudioTracks().length > 0);
      setCameraEnabled(stream.getVideoTracks().length > 0);
    } catch {
      setCameraError(
        "Microphone access was denied or is unavailable. Please allow microphone access in your browser settings.",
      );
    }
  };

  const endConsultation = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());

    streamRef.current = null;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    setCameraEnabled(false);
    setMicEnabled(false);
    setCallStarted(false);
    setCallEnded(true);
  };

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = messageInput.trim();

    if (!trimmedMessage) return;

    const newMessage: ChatMessage = {
      id: Date.now(),
      sender: "doctor",
      message: trimmedMessage,
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((previous) => [...previous, newMessage]);
    setMessageInput("");
  };

  const saveNotes = () => {
    localStorage.setItem(
      `consultationNotes-${patient.appointmentId}`,
      notes,
    );

    setNotesSaved(true);

    window.setTimeout(() => {
      setNotesSaved(false);
    }, 2500);
  };

  const openPrescriptionPage = () => {
    navigate("/doctor-prescriptions", {
      state: {
        patient,
        doctor,
        appointmentId: patient.appointmentId,
      },
    });
  };

  const toggleFullscreen = async () => {
  try {
    const videoSection = document.getElementById("consultation-video-section");

    if (!videoSection) return;

    if (!document.fullscreenElement) {
      await videoSection.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch {
    setCameraError("Fullscreen mode is not available in this browser.");
  }
};

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />

      <main className="px-3 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-[1500px]">
          {/* PAGE HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                to="/doctor-dashboard"
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0B63CE]"
              >
                <ArrowLeft size={17} />
                Back to Dashboard
              </Link>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-[#183b3b] sm:text-3xl">
                  Online Consultation
                </h1>

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    callEnded
                      ? "bg-slate-100 text-slate-600"
                      : callStarted
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      callEnded
                        ? "bg-slate-400"
                        : callStarted
                          ? "animate-pulse bg-emerald-500"
                          : "bg-amber-500"
                    }`}
                  />

                  {callEnded
                    ? "Consultation Ended"
                    : callStarted
                      ? "Consultation in Progress"
                      : "Waiting to Start"}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Secure online consultation with {patient.name}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e5f4f2] text-[#245b5b]">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#183b3b]">
                  Private Consultation
                </p>

                <p className="text-xs text-slate-500">
                  Appointment ID: {patient.appointmentId}
                </p>
              </div>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {cameraError && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {cameraError}
            </div>
          )}

          {/* MAIN LAYOUT */}
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">
            {/* LEFT: VIDEO AND CONTROLS */}
            <section
  id="consultation-video-section"
  className="min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
>
              {/* VIDEO HEADER */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f4f2] text-[#245b5b]">
                    <Video size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-[#183b3b]">
                      Video Consultation
                    </h2>

                    <p className="text-xs text-slate-500">
                      {callStarted
                        ? `Session time: ${formattedTimer}`
                        : "Your consultation room"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  title="Toggle fullscreen"
                  aria-label="Toggle fullscreen"
                  className="rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-[#0B63CE]"
                >
                  <Maximize2 size={18} />
                </button>
              </div>

              {/* VIDEO AREA */}
              <div className="bg-[#111827] p-3 sm:p-5 fullscreen:bg-[#111827] fullscreen:p-4">
                <div className="relative min-h-[300px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#183b3b] via-[#24364b] to-[#151b54] sm:min-h-[440px] fullscreen:min-h-0 fullscreen:h-[calc(100vh-120px)]">
                  {/* Patient video placeholder */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center text-white">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/15 bg-white/10 text-3xl font-bold shadow-xl sm:h-32 sm:w-32 sm:text-4xl">
                      AK
                    </div>

                    <h3 className="mt-5 text-xl font-bold">
                      {patient.name}
                    </h3>

                    <p className="mt-1 text-sm text-white/60">
                      {callEnded
                        ? "Consultation has ended"
                        : callStarted
                          ? "Waiting for patient video..."
                          : "Patient waiting room"}
                    </p>

                    {!callStarted && !callEnded && (
                      <div className="mt-6 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/80">
                        Start the consultation when you are ready.
                      </div>
                    )}

                    {callStarted && !callEnded && (
                      <div className="mt-5 flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-xs text-white/80">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                        Waiting for the patient to connect
                      </div>
                    )}
                  </div>

                  {/* Local camera preview */}
                  <div className="absolute bottom-4 right-4 h-28 w-24 overflow-hidden rounded-2xl border border-white/20 bg-[#273244] shadow-xl sm:h-40 sm:w-32">
                    {cameraEnabled ? (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-white">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                          <UserRound size={25} />
                        </div>

                        <p className="mt-2 text-xs font-semibold">You</p>

                        <p className="mt-1 text-[10px] text-white/60">
                          Camera off
                        </p>
                      </div>
                    )}

                    {micEnabled && (
                      <div className="absolute bottom-2 left-2 rounded-full bg-black/50 p-1.5 text-white">
                        <Mic size={12} />
                      </div>
                    )}
                  </div>

                  {/* Call timer */}
                  {callStarted && !callEnded && (
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                      {formattedTimer}
                    </div>
                  )}
                </div>

                {/* CALL CONTROLS */}
                <div className="flex flex-wrap items-center justify-center gap-3 py-5">
                  {/* Microphone */}
                  <button
                    type="button"
                    onClick={toggleMicrophone}
                    disabled={!callStarted || callEnded}
                    title={
                      micEnabled
                        ? "Turn microphone off"
                        : "Turn microphone on"
                    }
                    aria-label={
                      micEnabled
                        ? "Turn microphone off"
                        : "Turn microphone on"
                    }
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      micEnabled
                        ? "bg-white/15 text-white hover:bg-white/25"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>

                  {/* Camera */}
                  <button
                    type="button"
                    onClick={toggleCamera}
                    disabled={!callStarted || callEnded}
                    title={
                      cameraEnabled ? "Turn camera off" : "Turn camera on"
                    }
                    aria-label={
                      cameraEnabled ? "Turn camera off" : "Turn camera on"
                    }
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      cameraEnabled
                        ? "bg-white/15 text-white hover:bg-white/25"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {cameraEnabled ? (
                      <Video size={20} />
                    ) : (
                      <VideoOff size={20} />
                    )}
                  </button>

                  {/* Start, End or Finish */}
                  {!callStarted && !callEnded ? (
                    <button
                      type="button"
                      onClick={startConsultation}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
                    >
                      <Video size={18} />
                      Start Consultation
                    </button>
                  ) : callStarted ? (
                    <button
                      type="button"
                      onClick={endConsultation}
                      className="inline-flex items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-600"
                    >
                      <PhoneOff size={18} />
                      End Call
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate("/doctor-appointments")}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0B63CE] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0955AE]"
                    >
                      <Check size={18} />
                      Finish
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 pb-2 text-center text-xs text-white/50">
                  <ShieldCheck size={14} />
                  Keep patient information confidential.
                </div>
              </div>
            </section>

            {/* RIGHT: PATIENT INFO / NOTES / CHAT */}
            <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* PANEL HEADER */}
              <div className="border-b border-slate-100 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e5f4f2] text-[#245b5b]">
                    <UserRound size={23} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-bold text-[#183b3b]">
                      {patient.name}
                    </h2>

                    <p className="text-xs text-slate-500">
                      Patient · {patient.age} years old
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-[#f8faf9] p-3">
                    <p className="text-xs text-slate-500">Appointment</p>
                    <p className="mt-1 text-sm font-bold text-[#183b3b]">
                      {patient.appointmentId}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#f8faf9] p-3">
                    <p className="text-xs text-slate-500">Session Time</p>
                    <p className="mt-1 text-sm font-bold text-[#183b3b]">
                      {formattedTimer}
                    </p>
                  </div>
                </div>
              </div>

              {/* TABS */}
              <div className="grid grid-cols-3 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab("patient")}
                  className={`flex items-center justify-center gap-2 border-b-2 px-2 py-4 text-xs font-semibold transition sm:text-sm ${
                    activeTab === "patient"
                      ? "border-[#0B63CE] text-[#0B63CE]"
                      : "border-transparent text-slate-500 hover:text-[#183b3b]"
                  }`}
                >
                  <UserRound size={16} />
                  Patient
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("notes")}
                  className={`flex items-center justify-center gap-2 border-b-2 px-2 py-4 text-xs font-semibold transition sm:text-sm ${
                    activeTab === "notes"
                      ? "border-[#0B63CE] text-[#0B63CE]"
                      : "border-transparent text-slate-500 hover:text-[#183b3b]"
                  }`}
                >
                  <FileText size={16} />
                  Notes
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("chat")}
                  className={`flex items-center justify-center gap-2 border-b-2 px-2 py-4 text-xs font-semibold transition sm:text-sm ${
                    activeTab === "chat"
                      ? "border-[#0B63CE] text-[#0B63CE]"
                      : "border-transparent text-slate-500 hover:text-[#183b3b]"
                  }`}
                >
                  <MessageCircle size={16} />
                  Chat
                </button>
              </div>

              {/* PATIENT TAB */}
              {activeTab === "patient" && (
                <div className="space-y-5 p-5">
                  <div>
                    <h3 className="text-sm font-bold text-[#183b3b]">
                      Consultation Details
                    </h3>

                    <div className="mt-3 space-y-3">
                      <div className="flex items-start gap-3">
                        <CalendarDays
                          size={17}
                          className="mt-0.5 text-[#0B63CE]"
                        />

                        <div>
                          <p className="text-xs text-slate-500">Date & Time</p>
                          <p className="mt-1 text-sm font-semibold text-[#183b3b]">
                            {patient.appointmentDate},{" "}
                            {patient.appointmentTime}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock3
                          size={17}
                          className="mt-0.5 text-[#0B63CE]"
                        />

                        <div>
                          <p className="text-xs text-slate-500">Duration</p>
                          <p className="mt-1 text-sm font-semibold text-[#183b3b]">
                            {formattedTimer}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Stethoscope
                          size={17}
                          className="mt-0.5 text-[#0B63CE]"
                        />

                        <div>
                          <p className="text-xs text-slate-500">
                            Assigned Doctor
                          </p>
                          <p className="mt-1 text-sm font-semibold text-[#183b3b]">
                            {doctor.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {doctor.qualifications} · {doctor.specialty}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  <div>
                    <h3 className="text-sm font-bold text-[#183b3b]">
                      Reason for Consultation
                    </h3>

                    <p className="mt-2 rounded-xl bg-[#f8faf9] p-4 text-sm leading-6 text-slate-600">
                      {patient.reason}
                    </p>
                  </div>

                  <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                    <p className="text-xs font-semibold text-amber-800">
                      Privacy Reminder
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700">
                      Review only the patient information required for this
                      consultation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openPrescriptionPage}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                  >
                    <FileText size={17} />
                    Create Prescription
                  </button>
                </div>
              )}

              {/* NOTES TAB */}
              {activeTab === "notes" && (
                <div className="p-5">
                  <div className="mb-4">
                    <h3 className="font-bold text-[#183b3b]">
                      Consultation Notes
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Record relevant observations for this consultation.
                    </p>
                  </div>

                  <textarea
                    value={notes}
                    onChange={(event) => {
                      setNotes(event.target.value);
                      setNotesSaved(false);
                    }}
                    rows={9}
                    placeholder="Enter consultation notes..."
                    className="w-full resize-y rounded-xl border border-slate-200 bg-[#fbfdfc] p-4 text-sm leading-6 text-slate-700 outline-none transition focus:border-[#0B63CE] focus:ring-2 focus:ring-[#0B63CE]/10"
                  />

                  <button
                    type="button"
                    onClick={saveNotes}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0B63CE] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0955AE]"
                  >
                    <Check size={17} />
                    {notesSaved ? "Notes Saved" : "Save Notes"}
                  </button>

                  {notesSaved && (
                    <p className="mt-3 flex items-center gap-2 text-xs text-emerald-700">
                      <CheckCheck size={15} />
                      Notes saved in this browser.
                    </p>
                  )}

                  <p className="mt-3 text-xs leading-5 text-slate-400">
                    Demo only: notes are stored in localStorage. Do not use
                    real patient data until secure backend storage is
                    implemented.
                  </p>
                </div>
              )}

              {/* CHAT TAB */}
              {activeTab === "chat" && (
                <div className="flex h-[520px] flex-col">
                  <div className="flex-1 space-y-4 overflow-y-auto p-4">
                    <div className="rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-700">
                      Demo chat. Messages are not sent to another device yet.
                    </div>

                    {messages.map((message) => {
                      const isDoctor = message.sender === "doctor";

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isDoctor ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                              isDoctor
                                ? "rounded-br-md bg-[#0B63CE] text-white"
                                : "rounded-bl-md bg-[#f1f5f9] text-[#183b3b]"
                            }`}
                          >
                            <p className="break-words text-sm leading-5">
                              {message.message}
                            </p>

                            <div
                              className={`mt-2 flex items-center justify-end gap-1 text-[10px] ${
                                isDoctor
                                  ? "text-white/70"
                                  : "text-slate-400"
                              }`}
                            >
                              {message.time}

                              {isDoctor && <CheckCheck size={12} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    <div ref={chatEndRef} />
                  </div>

                  <form
                    onSubmit={sendMessage}
                    className="border-t border-slate-100 p-4"
                  >
                    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-[#fbfdfc] p-2 focus-within:border-[#0B63CE]">
                      <input
                        value={messageInput}
                        onChange={(event) =>
                          setMessageInput(event.target.value)
                        }
                        placeholder="Type a message..."
                        className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-700 outline-none"
                      />

                      <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        aria-label="Send message"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0B63CE] text-white transition hover:bg-[#0955AE] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send size={17} />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </aside>
          </div>

          {/* FOOTER INFO */}
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5f4f2] text-[#245b5b]">
                <ShieldCheck size={20} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#183b3b]">
                  Secure Healthcare Experience
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Protect patient confidentiality throughout the consultation.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/doctor-appointments")}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#183b3b] transition hover:border-[#0B63CE] hover:text-[#0B63CE]"
            >
              View Appointments
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OnlineConsultation;
