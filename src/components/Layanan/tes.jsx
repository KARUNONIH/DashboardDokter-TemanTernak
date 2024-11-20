import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const VideoChat = ({ authToken }) => {
  const [peers, setPeers] = useState(new Map());
  const [localStream, setLocalStream] = useState(null);
  const [localIsMuted, setLocalIsMuted] = useState(false);
  const [localIsVideoOn, setLocalIsVideoOn] = useState(true);
  const [socket, setSocket] = useState(null);
  const [myData, setMyData] = useState(null);
  const [consultation, setConsultation] = useState(null);
  const [lastReceivedMessageId, setLastReceivedMessageId] = useState("");
  const [messages, setMessages] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [timerText, setTimerText] = useState("00:00:00");
  const [timerClass, setTimerClass] = useState("bg-danger");

  const query = new URLSearchParams(window.location.search);
  const videoContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);

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
    const response = await fetch("https://api.temanternak.h14.my.id/users/my", {
      headers: {
        Authorization: `Bearer ${query.get("token") || authToken}`,
      },
    });
    const data = await response.json();
    setMyData(data.data);
  };

  const getConsultation = async () => {
    const response = await fetch(
      `https://api.temanternak.h14.my.id/bookings/${query.get("id")}/consultations`,
      {
        headers: {
          Authorization: `Bearer ${query.get("token") || authToken}`,
          accept: "application/json",
        },
      }
    );
    const data = await response.json();
    setConsultation(data.data);
    return data.data;
  };

  const createPeerConnection = (socketId, userId, isMuted, isVideoOn) => {
    const peerConnection = new RTCPeerConnection(configuration);

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });
    }

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("ice-candidate", event.candidate, consultation?.id, socketId);
      }
    };

    peerConnection.ontrack = (event) => {
      createVideoElement(
        socketId,
        `${
          myData?.role === "veterinarian"
            ? consultation?.bookerName
            : consultation?.veterinarianNameAndTitle
        }`,
        isMuted,
        isVideoOn,
        event.streams[0]
      );
    };

    setPeers(new Map(peers.set(socketId, peerConnection)));
    return peerConnection;
  };

  const createVideoElement = (socketId, userName, isMuted, isVideoOn, stream) => {
    const existingVideo = document.getElementById(`video-${socketId}`);
    if (existingVideo) {
      existingVideo.srcObject = stream;
      return existingVideo;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "video-wrapper";

    const video = document.createElement("video");
    video.id = `video-${socketId}`;
    video.autoplay = true;
    video.playsInline = true;
    if (stream) video.srcObject = stream;

    const label = document.createElement("div");
    label.className = "username";
    label.textContent = userName;

    const statusMic = document.createElement("div");
    statusMic.className = "status-mic";
    statusMic.textContent = isMuted ? "Muted" : "Unmuted";

    const statusVid = document.createElement("div");
    statusVid.className = "status-vid";
    statusVid.textContent = isVideoOn ? "Video On" : "Video Off";

    wrapper.appendChild(video);
    wrapper.appendChild(statusMic);
    wrapper.appendChild(statusVid);
    wrapper.appendChild(label);
    videoContainerRef.current?.appendChild(wrapper);
    return video;
  };

  const joinRoom = async () => {
    try {
      const newSocket = io("https://realtime.temanternak.h14.my.id/", {
        extraHeaders: {
          authorization: `bearer ${consultation.token}`,
        },
      });

      newSocket.on("user-connected", async (socketId, userId) => {
        const peerConnection = createPeerConnection(socketId, userId);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        newSocket.emit(
          "offer",
          offer,
          consultation.id,
          socketId,
          localIsMuted,
          localIsVideoOn,
          query.get("token") || authToken
        );
      });

      newSocket.on("offer", async (offer, socketId, userId, isMuted, isVideoOn) => {
        const peerConnection = createPeerConnection(socketId, userId, isMuted, isVideoOn);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        newSocket.emit("answer", answer, consultation.id, socketId, localIsMuted, localIsVideoOn);
      });

      // Add other socket event handlers...
      
      newSocket.emit("join-room", query.get("token"), query.get("id"));
      setSocket(newSocket);
      setIsJoined(true);
    } catch (err) {
      console.error("Error joining room:", err);
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    peers.forEach((peerConnection) => {
      peerConnection.close();
    });
    setPeers(new Map());

    document.querySelectorAll(".video-wrapper").forEach((video) => {
      if (!video.querySelector("#video-local")) video.remove();
    });

    setIsJoined(false);
  };

  const toggleMute = () => {
    setLocalIsMuted(!localIsMuted);
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = localIsMuted;
      });
    }
    peers.forEach((_, socketId) => {
      socket?.emit("user-muted", socketId, !localIsMuted);
    });
  };

  const toggleVideo = () => {
    setLocalIsVideoOn(!localIsVideoOn);
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !localIsVideoOn;
      });
    }
    socket?.emit("user-video-toggled", !localIsVideoOn);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files[0];
    const message = messageInputRef.current?.value;

    if (file && file.size > 0) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("document_type", "message-media");

      try {
        const uploadResponse = await fetch(
          "https://api.temanternak.h14.my.id/users/my/files",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${query.get("token") || authToken}`,
            },
            body: formData,
          }
        );

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          socket?.emit(
            "sendMessage",
            { message: `WITHFILE:${uploadResult.data.pathname}END;${message}` }
          );
        }
      } catch (error) {
        console.error("File upload failed:", error);
      }
    } else {
      socket?.emit("sendMessage", { message });
    }

    if (messageInputRef.current) messageInputRef.current.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    const init = async () => {
      await getMe();
      const consultationData = await getConsultation();
      
      // Set up timer
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const startTime = new Date(consultationData.startTime).getTime();
        const endTime = new Date(consultationData.endTime).getTime();
        
        let distance;
        if (startTime > now) {
          distance = startTime - now;
          setTimerClass("bg-success");
        } else {
          distance = endTime - now;
          setTimerClass("bg-danger");
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimerText(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );

        if (distance < -10) {
          clearInterval(interval);
          leaveRoom();
        }
      }, 1000);

      return () => clearInterval(interval);
    };

    init();
  }, []);

  return (
    <div className="video-chat-container">
      <div id="meeting-info">
        {consultation && (
          <>
            <h1>{consultation.serviceName}</h1>
            <p>Dokter: {consultation.veterinarianNameAndTitle}</p>
            <p>Pelanggan: {consultation.bookerName}</p>
            <p>Waktu Mulai: {new Date(consultation.startTime).toLocaleString()}</p>
            <p>Waktu Selesai: {new Date(consultation.endTime).toLocaleString()}</p>
            <span id="timer" className={`p-1 ${timerClass}`}>
              {timerText}
            </span>
          </>
        )}
      </div>

      <div className="controls">
        <button onClick={isJoined ? leaveRoom : joinRoom}>
          {isJoined ? "Leave Room" : "Join Room"}
        </button>
        <button onClick={toggleMute}>
          {localIsMuted ? "Unmute" : "Mute"}
        </button>
        <button onClick={toggleVideo}>
          {localIsVideoOn ? "Turn Off Video" : "Turn On Video"}
        </button>
        
        <select id="cameraSelect" onChange={() => changeCamera()}>
          {/* Camera options */}
        </select>
        
        <select id="microphoneSelect" onChange={() => changeMicrophone()}>
          {/* Microphone options */}
        </select>
      </div>

      <div ref={videoContainerRef} id="videoContainer" className="video-container" />

      <div className="chat-container">
        <ul id="messages" className="messages-list">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={`chat-bubble ${msg.userId === myData?.id ? "right" : "left"}`}
            >
              {/* Render message content */}
            </li>
          ))}
        </ul>

        <form id="chatForm" onSubmit={handleSendMessage}>
          <input
            type="text"
            ref={messageInputRef}
            id="messageInput"
            placeholder="Type a message..."
          />
          <input
            type="file"
            ref={fileInputRef}
            id="fileInput"
            accept="image/*"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default VideoChat;