import { useCallback, useEffect, useRef, useState } from "react";
import AgoraRTC, {
  type IAgoraRTCClient,
  type ICameraVideoTrack,
  type IMicrophoneAudioTrack,
  type IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";

type VideoCallRoomProps = {
  enabled?: boolean;
  showLeaveButton?: boolean;
  onLeave?: () => void;
};

const APP_ID = import.meta.env.VITE_AGORA_APP_ID as string | undefined;
const CHANNEL = import.meta.env.VITE_AGORA_CHANNEL as string | undefined;
const TOKEN = import.meta.env.VITE_AGORA_TOKEN as string | undefined;

function VideoCallRoom({
  enabled = true,
  showLeaveButton = true,
  onLeave,
}: VideoCallRoomProps) {
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const microphoneRef = useRef<IMicrophoneAudioTrack | null>(null);
  const cameraRef = useRef<ICameraVideoTrack | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [remoteUserJoined, setRemoteUserJoined] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setIsConnected(false);
      setRemoteUserJoined(false);
      return;
    }

    let mounted = true;
    let joined = false;
    let tracksClosed = false;

    let localMicrophone: IMicrophoneAudioTrack | null = null;
    let localCamera: ICameraVideoTrack | null = null;

    setLoading(true);
    setError("");
    setIsConnected(false);
    setRemoteUserJoined(false);
    setIsMicOn(true);
    setIsCameraOn(true);

    const client = AgoraRTC.createClient({
      mode: "rtc",
      codec: "vp8",
    });

    clientRef.current = client;

    const stopAndCloseLocalTracks = () => {
      if (tracksClosed) return;

      tracksClosed = true;

      if (localMicrophone) {
        localMicrophone.stop();
        localMicrophone.close();

        if (microphoneRef.current === localMicrophone) {
          microphoneRef.current = null;
        }

        localMicrophone = null;
      }

      if (localCamera) {
        localCamera.stop();
        localCamera.close();

        if (cameraRef.current === localCamera) {
          cameraRef.current = null;
        }

        localCamera = null;
      }
    };

    const leaveChannel = async () => {
      if (!joined) return;

      try {
        await client.leave();
      } catch (leaveError) {
        console.error("Agora leave error:", leaveError);
      } finally {
        joined = false;
      }
    };

    const handleUserPublished = async (
      user: IAgoraRTCRemoteUser,
      mediaType: "audio" | "video",
    ) => {
      try {
        await client.subscribe(user, mediaType);

        if (!mounted) return;

        if (mediaType === "video") {
          if (remoteVideoRef.current && user.videoTrack) {
            user.videoTrack.play(remoteVideoRef.current);
          }

          setRemoteUserJoined(true);
        }

        if (mediaType === "audio" && user.audioTrack) {
          user.audioTrack.play();
        }
      } catch (err) {
        console.error("Remote participant subscription error:", err);

        if (mounted) {
          setError(
            "Unable to connect to the other participant's media. Please check your connection.",
          );
        }
      }
    };

    const handleUserUnpublished = (
      user: IAgoraRTCRemoteUser,
      mediaType: "audio" | "video",
    ) => {
      if (mediaType === "video") {
        user.videoTrack?.stop();

        if (mounted) {
          setRemoteUserJoined(false);
        }
      }

      if (mediaType === "audio") {
        user.audioTrack?.stop();
      }
    };

    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      user.videoTrack?.stop();
      user.audioTrack?.stop();

      if (mounted) {
        setRemoteUserJoined(false);
      }
    };

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);
    client.on("user-left", handleUserLeft);

    async function startCall() {
      try {
        if (!APP_ID || !CHANNEL) {
          throw new Error(
            "Agora App ID or Channel is missing. Please check your .env file.",
          );
        }

        // Join the same channel used by the other participant.
        await client.join(APP_ID, CHANNEL, TOKEN || null, null);
        joined = true;

        // Component may have unmounted while joining.
        if (!mounted) {
          await leaveChannel();
          return;
        }

        // Request camera and microphone access.
        const [microphone, camera] =
          await AgoraRTC.createMicrophoneAndCameraTracks();

        localMicrophone = microphone;
        localCamera = camera;

        microphoneRef.current = microphone;
        cameraRef.current = camera;

        // Component may have unmounted while requesting media.
        if (!mounted) {
          stopAndCloseLocalTracks();
          await leaveChannel();
          return;
        }

        // Show local camera preview.
        if (localVideoRef.current) {
          camera.play(localVideoRef.current);
        }

        // Publish media to the other participant.
        await client.publish([microphone, camera]);

        // Component may have unmounted while publishing.
        if (!mounted) {
          stopAndCloseLocalTracks();
          await leaveChannel();
          return;
        }

        setIsConnected(true);
      } catch (err) {
        console.error("Agora call error:", err);

        if (mounted) {
          let message =
            err instanceof Error
              ? err.message
              : "An unknown error occurred.";

          if (
            err instanceof Error &&
            (err.name === "NotAllowedError" ||
              err.name === "PermissionDeniedError")
          ) {
            message =
              "Camera or microphone permission was denied. Please allow access in your browser settings.";
          }

          setError(`Unable to start the video call: ${message}`);
          setIsConnected(false);
        }

        stopAndCloseLocalTracks();
        await leaveChannel();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void startCall();

    return () => {
      mounted = false;

      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
      client.off("user-left", handleUserLeft);

      stopAndCloseLocalTracks();

      client.remoteUsers.forEach((user) => {
        user.videoTrack?.stop();
        user.audioTrack?.stop();
      });

      if (clientRef.current === client) {
        clientRef.current = null;
      }

      // Leave the channel without blocking React cleanup.
      void leaveChannel();
    };
  }, [enabled]);

  const toggleMicrophone = useCallback(async () => {
    const microphone = microphoneRef.current;

    if (!microphone || !isConnected) return;

    const nextState = !isMicOn;

    try {
      await microphone.setEnabled(nextState);
      setIsMicOn(nextState);
      setError("");
    } catch (err) {
      console.error("Microphone toggle error:", err);
      setError("Unable to change microphone settings.");
    }
  }, [isConnected, isMicOn]);

  const toggleCamera = useCallback(async () => {
    const camera = cameraRef.current;

    if (!camera || !isConnected) return;

    const nextState = !isCameraOn;

    try {
      await camera.setEnabled(nextState);
      setIsCameraOn(nextState);
      setError("");
    } catch (err) {
      console.error("Camera toggle error:", err);
      setError("Unable to change camera settings.");
    }
  }, [isConnected, isCameraOn]);

  const handleLeaveCall = () => {
    if (!isConnected || !onLeave) return;

    onLeave();
  };

  return (
    <div className="w-full space-y-4">
      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Connection status */}
      {loading && (
        <div
          role="status"
          className="rounded-lg bg-gray-100 p-4 text-center text-sm text-gray-600"
        >
          Connecting to video consultation...
        </div>
      )}

      {!enabled && (
        <div className="rounded-lg bg-gray-100 p-4 text-center text-sm text-gray-600">
          Waiting for the consultation to start...
        </div>
      )}

      {enabled && !loading && !error && !isConnected && (
        <div className="rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-700">
          Establishing a secure connection...
        </div>
      )}

      {/* Video screens */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Remote participant */}
        <div className="relative min-h-[240px] overflow-hidden rounded-xl bg-gray-900">
          <div
            ref={remoteVideoRef}
            className="absolute inset-0 h-full w-full"
          />

          {!remoteUserJoined && (
            <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-white">
              <div>
                <p className="text-lg font-semibold">
                  Waiting for the other participant
                </p>

                <p className="mt-2 text-sm text-gray-300">
                  The other participant's video will appear here when they
                  join and enable their camera.
                </p>
              </div>
            </div>
          )}

          <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-3 py-1 text-sm text-white">
            Other participant
          </span>
        </div>

        {/* Local participant */}
        <div className="relative min-h-[240px] overflow-hidden rounded-xl bg-gray-900">
          <div
            ref={localVideoRef}
            className="absolute inset-0 h-full w-full"
          />

          {!isCameraOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
              Camera is off
            </div>
          )}

          <span className="absolute bottom-3 left-3 rounded-md bg-black/60 px-3 py-1 text-sm text-white">
            You
          </span>
        </div>
      </div>

      {/* Call controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => void toggleMicrophone()}
          disabled={!isConnected}
          aria-pressed={!isMicOn}
          className={`rounded-full px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
            isMicOn
              ? "btn-dark"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isMicOn ? "Mute Microphone" : "Unmute Microphone"}
        </button>

        <button
          type="button"
          onClick={() => void toggleCamera()}
          disabled={!isConnected}
          aria-pressed={!isCameraOn}
          className={`rounded-full px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
            isCameraOn
              ? "btn-dark "
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isCameraOn ? "Turn Camera Off" : "Turn Camera On"}
        </button>

        {showLeaveButton && (
          <button
            type="button"
            onClick={handleLeaveCall}
            disabled={!isConnected || !onLeave}
            className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Leave Call
          </button>
        )}
      </div>
    </div>
  );
}

export default VideoCallRoom;
