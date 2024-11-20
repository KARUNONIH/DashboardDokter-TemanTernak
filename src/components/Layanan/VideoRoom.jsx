import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const VideoRoom = () => {
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
  const [videoDevices, setVideoDevices] = useState([]);
    const [audioDevices, setAudioDevices] = useState([]);
    const [idSocket, setIdSocket] = useState([]);

  const query = new URLSearchParams(window.location.search);
  const videoContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const localVideoRef = useRef(null);

  const authToken = query.get("token");

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
    try {
      const response = await fetch("https://api.temanternak.h14.my.id/users/my", {
        headers: {
          Authorization: `Bearer ${query.get("token") || authToken}`,
        },
      });
      const data = await response.json();
      setMyData(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getConsultation = async () => {
    try {
      const response = await fetch(`https://api.temanternak.h14.my.id/bookings/${query.get("id")}/consultations`, {
        headers: {
          Authorization: `Bearer ${query.get("token") || authToken}`,
          accept: "application/json",
        },
      });
      const data = await response.json();
      setConsultation(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching consultation:", error);
    }
  };

  const getLocalStream = async (videoDeviceId, audioDeviceId) => {
    try {
      const constraints = {
        video: videoDeviceId ? { deviceId: { exact: videoDeviceId } } : true,
        audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
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
    //   if (!idSocket.includes(socketId)) {
        const videoElement = document.createElement("video");
        videoElement.id = `video-${socketId}`;
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.srcObject = event.streams[0];

        const wrapper = document.createElement("div");
        wrapper.className = "video-wrapper";
        wrapper.appendChild(videoElement);

        const label = document.createElement("div");
        label.className = "username";
        label.textContent = `${myData?.role === "veterinarian" ? consultation?.bookerName : consultation?.veterinarianNameAndTitle}`;

        const statusMic = document.createElement("div");
        statusMic.className = "status-mic";
        statusMic.textContent = isMuted ? "Muted" : "Unmuted";

        const statusVid = document.createElement("div");
        statusVid.className = "status-vid";
        statusVid.textContent = isVideoOn ? "Video On" : "Video Off";

        wrapper.appendChild(statusMic);
        wrapper.appendChild(statusVid);
        wrapper.appendChild(label);
        videoContainerRef.current?.appendChild(wrapper);
        // setIdSocket(idSocket.push(socketId));
    //   }
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === "disconnected" || peerConnection.connectionState === "failed" || peerConnection.connectionState === "closed") {
        const videoElement = document.getElementById(`video-${socketId}`);
        videoElement?.parentElement?.remove();
      }
    };

    setPeers(new Map(peers.set(socketId, peerConnection)));
    return peerConnection;
  };

  const displayMessage = (msg) => {
    if (msg.id > lastReceivedMessageId) {
      setMessages((prev) => [...prev, msg]);
      setLastReceivedMessageId(msg.id);
      localStorage.setItem("lastReceivedMessageId", msg.id);
    }
  };

  const joinRoom = async () => {
    console.log("data Consultation", consultation);
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
        newSocket.emit("offer", offer, consultation.id, socketId, localIsMuted, localIsVideoOn, query.get("token") || authToken);
      });

      newSocket.on("offer", async (offer, socketId, userId, isMuted, isVideoOn) => {
        const peerConnection = createPeerConnection(socketId, userId, isMuted, isVideoOn);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        newSocket.emit("answer", answer, consultation.id, socketId, localIsMuted, localIsVideoOn);
      });

      newSocket.on("answer", async (answer, socketId, isMuted, isVideoOn) => {
        const peerConnection = peers.get(socketId);
        if (peerConnection) {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          const videoElement = document.querySelector(`#video-${socketId}`);
          if (videoElement) {
            videoElement.nextElementSibling.textContent = isMuted ? "Muted" : "Unmuted";
            videoElement.nextElementSibling.nextElementSibling.textContent = isVideoOn ? "Video On" : "Video Off";
          }
        }
      });

      newSocket.on("ice-candidate", async (candidate, socketId) => {
        const peerConnection = peers.get(socketId);
        if (peerConnection) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      newSocket.on("user-disconnected", (socketId, userId) => {
        const videoElement = document.getElementById(`video-${socketId}`);
        if (videoElement) {
          videoElement.parentElement.remove();
        }
        if (peers.has(socketId)) {
          peers.get(socketId).close();
          peers.delete(socketId);
          setPeers(new Map(peers));
        }
      });

      newSocket.on("user-muted", (socketId, isMuted) => {
        const videoElement = document.getElementById(`video-${socketId}`);
        if (videoElement) {
          videoElement.nextElementSibling.textContent = isMuted ? "Muted" : "Unmuted";
        }
      });

      newSocket.on("user-video-toggled", (socketId, isVideoOn) => {
        const videoElement = document.getElementById(`video-${socketId}`);
        if (videoElement) {
          videoElement.nextElementSibling.nextElementSibling.textContent = isVideoOn ? "Video On" : "Video Off";
        }
      });

      newSocket.on("receiveMessage", (message) => {
        console.log("Pesan diterima dari server:", message); // Log pesan yang diterima
        displayMessage(message); // Memproses pesan dengan fungsi displayMessage
      });

      newSocket.on("previousMessages", (messages) => {
        messages.forEach(displayMessage);
      });
      newSocket.on("receiveNewMessages", (messages) => {
        messages.forEach(displayMessage);
      });

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

  const handleCameraChange = async (event) => {
    const newDeviceId = event.target.value;
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => track.stop());
    }
    await getLocalStream(newDeviceId, null);

    peers.forEach((peerConnection) => {
      const videoTrack = localStream.getVideoTracks()[0];
      const sender = peerConnection.getSenders().find((s) => s.track?.kind === "video");
      if (sender) {
        sender.replaceTrack(videoTrack);
      }
    });
  };

  const handleMicrophoneChange = async (event) => {
    const newDeviceId = event.target.value;
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => track.stop());
    }
    await getLocalStream(null, newDeviceId);

    peers.forEach((peerConnection) => {
      const audioTrack = localStream.getAudioTracks()[0];
      const sender = peerConnection.getSenders().find((s) => s.track?.kind === "audio");
      if (sender) {
        sender.replaceTrack(audioTrack);
      }
    });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files[0];
    const message = messageInputRef.current?.value;
    console.log("Fsafd");

    if (!message.trim() && (!file || file.size === 0)) return;

    if (file && file.size > 0) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("document_type", "message-media");

      try {
        const uploadResponse = await fetch("https://api.temanternak.h14.my.id/users/my/files", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${query.get("token") || authToken}`,
          },
          body: formData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          console.log(uploadResult);
          socket?.emit("sendMessage", { message: `WITHFILE:${uploadResult.data.pathname}END;${message}` });
        }
      } catch (error) {
        console.error("File upload failed:", error);
      }
    } else {
      console.log("Mengirim pesan:", message);
      socket?.emit("sendMessage", { message });
    }

    if (messageInputRef.current) messageInputRef.current.value = "";
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videos = devices.filter((device) => device.kind === "videoinput");
      const audios = devices.filter((device) => device.kind === "audioinput");
      setVideoDevices(videos);
      setAudioDevices(audios);
    } catch (error) {
      console.error("Error getting devices:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([getMe(), getConsultation(), getDevices(), getLocalStream()]);
    };
    init();
  }, []);

  useEffect(() => {
    if (!consultation) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const startTime = new Date(consultation.startTime).getTime();
      const endTime = new Date(consultation.endTime).getTime();

      let distance;
      if (startTime > now) {
        distance = startTime - now;
        setTimerClass("bg-success"); // Indikator waktu menuju mulai
      } else {
        distance = endTime - now;
        setTimerClass("bg-danger"); // Indikator waktu menuju selesai
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24)); // Hitung hari
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Format teks timer dengan hari
      setTimerText(`${days}d ${hours.toString().padStart(2, "0")}h:${minutes.toString().padStart(2, "0")}m:${seconds.toString().padStart(2, "0")}s`);

      // Jika waktu sudah lewat
      if (distance < -10) {
        clearInterval(interval);
        leaveRoom();
      }
    }, 1000);

    return () => clearInterval(interval); // Bersihkan interval saat komponen di-unmount
  }, [consultation]);
  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-slate-50 p-8">
      <Link to={"/layanan"}>Kembali</Link>
      <div id="meeting-info">
        {consultation && (
          <div className="flex">
            <h1>{consultation.serviceName}</h1>
            <p>Dokter: {consultation.veterinarianNameAndTitle}</p>
            <p>Pelanggan: {consultation.bookerName}</p>
            <p>Waktu Mulai: {new Date(consultation.startTime).toLocaleString()}</p>
            <p>Waktu Selesai: {new Date(consultation.endTime).toLocaleString()}</p>
            <span id="timer" className={`p-1 ${timerClass}`}>
              {timerText}
            </span>
          </div>
        )}
      </div>

      <div className="controls">
        <button onClick={isJoined ? leaveRoom : joinRoom}>{isJoined ? "Leave Room" : "Join Room"}</button>
        <button onClick={toggleMute}>{localIsMuted ? "Unmute" : "Mute"}</button>
        <button onClick={toggleVideo}>{localIsVideoOn ? "Turn Off Video" : "Turn On Video"}</button>

        <select id="cameraSelect" onChange={handleCameraChange}>
          {videoDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
            </option>
          ))}
        </select>

        <select id="microphoneSelect" onChange={handleMicrophoneChange}>
          {audioDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
            </option>
          ))}
        </select>
      </div>

      <div ref={videoContainerRef} id="videoContainer" className="video-container flex items-center">
        <div className="video-wrapper">
          <video id="video-local" ref={localVideoRef} autoPlay playsInline muted />
          <div className="username">You ({consultation?.veterinarianNameAndTitle})</div>
          <div className="status-mic">{localIsMuted ? "Muted" : "Unmuted"}</div>
          <div className="status-vid">{localIsVideoOn ? "Video On" : "Video Off"}</div>
        </div>
      </div>

      <div className="chat-container">
        <ul id="messages" className="messages-list">
          <li>PEsan pertama</li>
          {messages.map((msg, index) => (
            <li key={index} className={`chat-bubble ${msg.sender === myData?.id ? "right" : "left"}`}>
              {msg.message.startsWith("WITHFILE:") ? (
                <div>
                  <a href={`https://api.temanternak.h14.my.id/files/${msg.message.split("WITHFILE:")[1].split("END;")[0]}`} target="_blank" rel="noopener noreferrer" className="file-link">
                    View Attachment
                  </a>
                  <p>{msg.message.split("END;")[1]}</p>
                </div>
              ) : (
                <p>{msg.message}</p>
              )}
              <small className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </li>
          ))}
        </ul>

        <form id="chatForm" onSubmit={handleSendMessage}>
          <input type="text" ref={messageInputRef} id="messageInput" placeholder="Type a message..." />
          <input type="file" ref={fileInputRef} id="fileInput" accept="image/*" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};
export default VideoRoom;
