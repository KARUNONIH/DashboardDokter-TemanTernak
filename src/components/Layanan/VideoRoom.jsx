import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import ReactQuill from "react-quill"; // Impor ReactQuill
import "react-quill/dist/quill.snow.css"; // Impor styling Quill
import { Link } from "react-router-dom";

const Videoroom = () => {
  const [peers, setPeers] = useState(new Map());
  const [localStream, setLocalStream] = useState(null);
  const [localIsMuted, setLocalIsMuted] = useState(false);
  const [localIsVideoOn, setLocalIsVideoOn] = useState(true);
  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [myData, setMyData] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [editorValue, setEditorValue] = useState(""); // State untuk value editor
  const socketRef = useRef(null);

  const authToken = JSON.parse(localStorage.getItem("token"));

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      {
        urls: "turn:sip.temanternak.h14.my.id:3478",
        username: "temanternak",
        credential: "123123",
      },
    ],
  };

  const getMe = async () => {
    const query = new URLSearchParams(window.location.search);
    console.log("Fetching user data...");
    const myData = await fetch("https://api.temanternak.h14.my.id/users/my", {
      headers: {
        Authorization: `Bearer ${query.get("token") || authToken}`,
      },
    });
    const data = await myData.json();
    console.log("User data fetched:", data);
    return data.data;
  };

  const getConsultation = async () => {
    const query = new URLSearchParams(window.location.search);
    console.log("Fetching consultation data...");
    const consultation = await fetch(`https://api.temanternak.h14.my.id/bookings/${query.get("id")}/consultations`, {
      headers: {
        Authorization: `Bearer ${query.get("token") || authToken}`,
        accept: "application/json",
      },
    });
    const data = await consultation.json();
    console.log("Consultation data fetched:", data);
    return data.data;
  };

  const getLocalStream = async (cameraId, microphoneId) => {
    console.log("Requesting local media stream...");
    const constraints = {
      video: {
        deviceId: cameraId ? { exact: cameraId } : undefined,
        width: { exact: 320 },
        height: { exact: 240 },
      },
      audio: {
        deviceId: microphoneId ? { exact: microphoneId } : undefined,
      },
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream); // Update local stream
      console.log("Local stream obtained:", stream);
      // Find the video element and set the stream to it
      const localVideoElement = document.getElementById("video-local");
      if (localVideoElement) {
        localVideoElement.srcObject = stream; // Set the stream to the local video element
      }
      return stream;
    } catch (error) {
      console.error("Error getting local stream:", error);
    }
  };

  const createVideoElement = (socketId, userName, isMuted, isVideoOn) => (
    <div key={socketId} className="relative pt-[75%]">
      <video id={`video-${socketId}`} autoPlay playsInline className="absolute left-0 top-0 h-full w-full rounded-lg object-cover" />
      <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-sm text-white">{userName}</div>
      <div className="absolute left-2 top-2 rounded bg-red-500/50 px-2 py-1 text-sm text-white">{isMuted ? "Muted" : "Unmuted"}</div>
      <div className="absolute right-2 top-2 rounded bg-red-500/50 px-2 py-1 text-sm text-white">{isVideoOn ? "Video On" : "Video Off"}</div>
    </div>
  );

  const createPeerConnection = (socketId, userId, isMuted, isVideoOn) => {
    console.log("Creating peer connection for:", socketId);
    const peerConnection = new RTCPeerConnection(configuration);

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice-candidate", event.candidate, consultation?.id, socketId);
      }
    };

    peerConnection.ontrack = (event) => {
      const videoElement = document.getElementById(`video-${socketId}`);
      if (videoElement) {
        videoElement.srcObject = event.streams[0];
      }
    };

    setPeers(new Map(peers.set(socketId, peerConnection)));
    return peerConnection;
  };

  const joinRoom = async () => {
    if (!consultation?.token) return;
    console.log("Joining room...");
    socketRef.current = io("https://vcall.temanternak.h14.my.id/", {
      extraHeaders: {
        authorization: `bearer ${consultation.token}`,
      },
    });

    socketRef.current.on("user-connected", async (socketId, userId) => {
      console.log(`User connected: ${socketId}`);
      const peerConnection = createPeerConnection(socketId, userId);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socketRef.current.emit("offer", offer, consultation.id, socketId, localIsMuted, localIsVideoOn);
    });

    // Add other socket event handlers here...

    socketRef.current.emit("join-room");
  };

  const toggleMute = () => {
    setLocalIsMuted(!localIsMuted);
    console.log(localIsMuted ? "Unmuting..." : "Muting...");
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = localIsMuted;
      });
    }
    peers.forEach((_, socketId) => {
      socketRef.current?.emit("user-muted", socketId, !localIsMuted);
    });
  };

  const toggleVideo = () => {
    setLocalIsVideoOn(!localIsVideoOn);
    console.log(localIsVideoOn ? "Turning off video..." : "Turning on video...");
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !localIsVideoOn;
      });
    }
    socketRef.current?.emit("user-video-toggled", !localIsVideoOn);
  };

  useEffect(() => {
    const init = async () => {
      try {
        console.log("Initializing user data and consultation...");
        const userData = await getMe();
        setMyData(userData);
        const consultationData = await getConsultation();
        console.log("consultation data", consultationData);
        setConsultation(consultationData);

        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log("Available devices:", devices);
        setCameras(devices.filter((device) => device.kind === "videoinput"));
        setMicrophones(devices.filter((device) => device.kind === "audioinput"));

        const stream = await getLocalStream();
        setLocalStream(stream);
      } catch (error) {
        console.error("Initialization error:", error);
      }
    };

    init();

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
      socketRef.current?.disconnect();
      peers.forEach((peer) => peer.close());
    };
  }, []);

  return (
    <div className="fixed top-0 bg-slate-50 z-[9999] w-screen h-screen left-0">
      <div className="p-4">
        <div className="mb-4 space-x-2">
          <button onClick={joinRoom} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Join Room
          </button>

          <select onChange={(e) => getLocalStream(e.target.value)} className="rounded border px-4 py-2">
            <option value="">Select Camera</option>
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${camera.deviceId}`}
              </option>
            ))}
          </select>

          <select onChange={(e) => getLocalStream(undefined, e.target.value)} className="rounded border px-4 py-2">
            <option value="">Select Microphone</option>
            {microphones.map((mic) => (
              <option key={mic.deviceId} value={mic.deviceId}>
                {mic.label || `Microphone ${mic.deviceId}`}
              </option>
            ))}
          </select>

          <button onClick={toggleMute} className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
            {localIsMuted ? "Unmute" : "Mute"}
          </button>

          <button onClick={toggleVideo} className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
            {localIsVideoOn ? "Turn Off Video" : "Turn On Video"}
          </button>
          
          <Link to={"/layanan"}>Kembali</Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {localStream && (
            <div className="relative w-[600px] aspect-video bg-slate-200">
              <video
                id="video-local" // Ensure the local video has this ID
                autoPlay
                playsInline
                className="absolute left-0 top-0 h-full w-full rounded-lg object-cover"
              />
              <div className="absolute bottom-2 left-2 rounded bg-black/50 px-2 py-1 text-sm text-white">You ({myData?.name})</div>
              <div className="absolute left-2 top-2 rounded bg-red-500/50 px-2 py-1 text-sm text-white">{localIsMuted ? "Muted" : "Unmuted"}</div>
              <div className="absolute right-2 top-2 rounded bg-red-500/50 px-2 py-1 text-sm text-white">{localIsVideoOn ? "Video On" : "Video Off"}</div>
            </div>
          )}
          {Array.from(peers.keys()).map((socketId) => {
            const userName = myData?.role === "veterinarian" ? consultation?.bookerName : consultation?.veterinarianNameAndTitle;
            return createVideoElement(socketId, userName, false, true);
          })}
        </div>

        {/* Add Quill Text Editor below video */}
        <div className="mt-4">
          <ReactQuill value={editorValue} onChange={setEditorValue} placeholder="Write your message here..." />
        </div>
      </div>
    </div>
  );
};

export default Videoroom;
