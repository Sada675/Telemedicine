import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Mic,
  MicOff,
  PhoneOff,
  ShieldCheck,
  Video,
  VideoOff,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

function Consultation() {
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  const startingRef = useRef(false);

  

  // Get the current microphone track.
  const getAudioTrack = () =>
    streamRef.current?.getAudioTracks()[0];

  // Attach the combined stream to the video element.
  const attachStream = useCallback(async () => {
    const videoElement = videoRef.current;
    const stream = streamRef.current;

    if (!videoElement) return;

    videoElement.srcObject = stream;

    if (stream?.getVideoTracks().some((track) => track.readyState === "live")) {
      try {
        await videoElement.play();
      } catch (error) {
        console.error("Video preview error:", error);
      }
    }
  }, []);

  // Start the camera without enabling the microphone.
  const startCamera = async () => {
    if (startingRef.current || cameraOn) return;

    startingRef.current = true;
    setIsStarting(true);
    setCameraError("");

    let newCameraTrack: MediaStreamTrack | undefined;

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera access requires localhost or a secure HTTPS connection."
        );
      }

      const cameraStream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

      newCameraTrack = cameraStream.getVideoTracks()[0];

      if (!newCameraTrack) {
        cameraStream.getTracks().forEach((track) => track.stop());
        throw new Error("No camera was found.");
      }

      // If the component was unmounted while permission was pending,
      // immediately release the newly acquired camera.
      if (!mountedRef.current) {
        cameraStream.getTracks().forEach((track) => track.stop());
        return;
      }

      let currentStream = streamRef.current;

      if (!currentStream) {
        currentStream = new MediaStream();
        streamRef.current = currentStream;
      }

      // Remove any old camera track without touching the microphone.
      currentStream.getVideoTracks().forEach((track) => {
        currentStream?.removeTrack(track);
        track.stop();
      });

      // Add only the new video track to the existing stream.
      currentStream.addTrack(newCameraTrack);

      // The track has been moved to our combined stream.
      // Do not stop it by stopping the temporary camera stream.
      newCameraTrack = undefined;
      cameraStream.getTracks().forEach((track) => {
        if (track.kind !== "video") {
          track.stop();
        }
      });

      await attachStream();

      if (mountedRef.current) {
        setCameraOn(true);
      }
    } catch (error) {
      console.error("Camera error:", error);

      if (newCameraTrack) {
        newCameraTrack.stop();
      }

      if (mountedRef.current) {
        setCameraError(
          error instanceof Error &&
            error.message.includes("secure HTTPS")
            ? error.message
            : "Unable to start the camera. Please check your browser permissions and camera settings."
        );
        setCameraOn(false);
      }
    } finally {
      startingRef.current = false;

      if (mountedRef.current) {
        setIsStarting(false);
      }
    }
  };

  // Stop only the camera. Keep the microphone untouched.
  const stopCamera = () => {
    const stream = streamRef.current;

    stream?.getVideoTracks().forEach((track) => {
      stream.removeTrack(track);
      track.stop();
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream ?? null;
    }

    setCameraOn(false);
    setCameraError("");
  };

  // Start the microphone without enabling the camera.
  const startMicrophone = async () => {
    if (startingRef.current || micOn) return;

    startingRef.current = true;
    setIsStarting(true);
    setCameraError("");

    let newAudioTrack: MediaStreamTrack | undefined;

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Microphone access requires localhost or a secure HTTPS connection."
        );
      }

      const audioStream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

      newAudioTrack = audioStream.getAudioTracks()[0];

      if (!newAudioTrack) {
        audioStream.getTracks().forEach((track) => track.stop());
        throw new Error("No microphone was found.");
      }

      // Release the microphone if the page was closed while
      // the browser permission request was pending.
      if (!mountedRef.current) {
        audioStream.getTracks().forEach((track) => track.stop());
        return;
      }

      let currentStream = streamRef.current;

      if (!currentStream) {
        currentStream = new MediaStream();
        streamRef.current = currentStream;
      }

      // Remove any old audio track without touching the camera.
      currentStream.getAudioTracks().forEach((track) => {
        currentStream?.removeTrack(track);
        track.stop();
      });

      // Add only the new microphone track.
      currentStream.addTrack(newAudioTrack);
      newAudioTrack.enabled = true;
      newAudioTrack = undefined;

      // Do not stop the audio track now that it belongs to
      // the combined stream.
      audioStream.getTracks().forEach((track) => {
        if (track.kind !== "audio") {
          track.stop();
        }
      });

      if (mountedRef.current) {
        setMicOn(true);
      }
    } catch (error) {
      console.error("Microphone error:", error);

      if (newAudioTrack) {
        newAudioTrack.stop();
      }

      if (mountedRef.current) {
        setCameraError(
          error instanceof Error &&
            error.message.includes("secure HTTPS")
            ? error.message
            : "Unable to start the microphone. Please check your browser permissions and microphone settings."
        );
        setMicOn(false);
      }
    } finally {
      startingRef.current = false;

      if (mountedRef.current) {
        setIsStarting(false);
      }
    }
  };

  // Toggle only the microphone.
  const toggleMic = async () => {
    setCameraError("");

    const audioTrack = getAudioTrack();

    if (!audioTrack || audioTrack.readyState === "ended") {
      await startMicrophone();
      return;
    }

    const nextState = !micOn;

    // Disabling the audio track mutes the microphone while
    // keeping the camera and its track unchanged.
    audioTrack.enabled = nextState;
    setMicOn(nextState);
  };

  // Toggle only the camera.
  const toggleCamera = () => {
    if (cameraOn) {
      stopCamera();
    } else {
      void startCamera();
    }
  };

  // Stop both devices when the user leaves the consultation.
  const stopAllDevices = () => {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
    setMicOn(false);
  };

  // Release camera and microphone when the page unmounts.
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf9]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/patient-dashboard"
          onClick={stopAllDevices}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 no-underline transition hover:text-[#0B63CE]"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Page Heading */}
        <div className="mb-7">
          <p className="text-sm font-medium text-[#0B63CE]">
            Online Consultation
          </p>

          <h1 className="mt-2 text-2xl font-bold text-[#183b3b] sm:text-3xl">
            Join Your Consultation
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Get ready for your online appointment with your doctor.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Video Area */}
          <section className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {/* Live Camera Preview */}
              <div className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#183b3b] to-[#245b5b] px-5 py-12 text-center sm:min-h-[420px]">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`absolute inset-0 h-full w-full object-cover ${
                    cameraOn ? "block" : "hidden"
                  }`}
                />

                {!cameraOn && (
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 text-3xl font-bold text-white ring-4 ring-white/10">
                      DM
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-white">
                      Dr. Munib
                    </h2>

                    <p className="mt-2 text-sm text-white/75">
                      Medical Specialist
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white">
                      <Video size={15} />
                      Video consultation
                    </span>

                    <p className="mt-5 max-w-sm text-xs leading-5 text-white/75">
                      Turn on your camera to see your live camera preview.
                    </p>
                  </div>
                )}

                {cameraOn && (
                  <div className="absolute bottom-4 left-4 z-10 rounded-full bg-black/50 px-3 py-2 text-xs font-medium text-white">
                    Your camera preview
                  </div>
                )}

                {isStarting && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
                    <p className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-700">
                      Starting device...
                    </p>
                  </div>
                )}
              </div>

              {/* Camera and Microphone Error */}
              {cameraError && (
                <div
                  role="alert"
                  className="border-t border-red-100 bg-red-50 px-5 py-3 text-sm leading-6 text-red-700"
                >
                  {cameraError}
                </div>
              )}

              {/* Call Controls */}
              <div className="flex flex-wrap items-center justify-center gap-4 p-5 sm:gap-6">
                {/* Microphone Button */}
                <button
                  type="button"
                  onClick={() => void toggleMic()}
                  disabled={isStarting}
                  aria-label={
                    micOn ? "Turn microphone off" : "Turn microphone on"
                  }
                  title={
                    micOn ? "Turn microphone off" : "Turn microphone on"
                  }
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    micOn
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>

                {/* Camera Button */}
                <button
                  type="button"
                  onClick={toggleCamera}
                  disabled={isStarting}
                  aria-label={
                    cameraOn ? "Turn camera off" : "Turn camera on"
                  }
                  title={cameraOn ? "Turn camera off" : "Turn camera on"}
                  className={`flex h-12 w-12 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    cameraOn
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-red-50 text-red-600 hover:bg-red-100"
                  }`}
                >
                  {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
                </button>

                {/* Leave Consultation */}
                <Link
                  to="/appointments"
                  onClick={stopAllDevices}
                  className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-red-700"
                >
                  <PhoneOff size={17} />
                  Leave Consultation
                </Link>
              </div>

              <div className="border-t border-slate-100 px-5 pb-5 text-center text-xs text-slate-500">
                Microphone: {micOn ? "On" : "Off"}{" "}
                <span className="mx-2">•</span>
                Camera: {cameraOn ? "On" : "Off"}
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <ShieldCheck
                className="mt-0.5 shrink-0 text-[#0B63CE]"
                size={21}
              />

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Your privacy matters
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-600">
                  Keep your consultation details private and join from a
                  comfortable, secure location.
                </p>
              </div>
            </div>
          </section>

          {/* Appointment Details */}
          <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-[#183b3b]">
              Appointment Details
            </h2>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e5f4f2] text-lg font-bold text-[#245b5b]">
                DM
              </div>

              <div>
                <h3 className="font-bold text-slate-800">Dr. Munib</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Medical Specialist
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-[#f8faf9] p-4">
                <CalendarDays
                  size={19}
                  className="mt-0.5 shrink-0 text-[#245b5b]"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Appointment Date
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    October 10, 2026
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-[#f8faf9] p-4">
                <Clock3
                  size={19}
                  className="mt-0.5 shrink-0 text-[#245b5b]"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Appointment Time
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    04:00 PM
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs text-slate-500">
                  Appointment Status
                </p>

                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Confirmed
                </p>
              </div>
            </div>

            <Link
              to="/appointments"
              onClick={stopAllDevices}
              className="mt-6 flex w-full items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-50"
            >
              View All Appointments
            </Link>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Consultation;
