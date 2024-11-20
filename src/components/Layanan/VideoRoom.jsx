import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { IoMdSend } from "react-icons/io";
import { FaVideo } from "react-icons/fa";
import { FaVideoSlash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa";
import { FaMicrophoneSlash } from "react-icons/fa";
import Quill from "quill";
import "quill/dist/quill.snow.css";

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
  const [showTimer, setShowTimer] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const messagesEndRef = useRef(null);
  const [isMessagesEndRef, setIsMessagesEndRef] = useState(false);
  const [typeTimer, setTypeTimer] = useState("before");

  const query = new URLSearchParams(window.location.search);
  const videoContainerRef = useRef(null);
  const messageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const localVideoRef = useRef(null);
  const editorRef = useRef(null);
  const quillInstance = useRef(null);

  const authToken = query.get("token");
  const idBooking = query.get("id");

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
      if (!idSocket.includes(socketId)) {
        // Buat elemen video
        const videoElement = document.createElement("video");
        videoElement.id = `video-${socketId}`;
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.srcObject = event.streams[0];
        videoElement.className = "w-[400px] rounded bg-blue-200";

        // Buat wrapper untuk video dan kontrol
        const wrapper = document.createElement("div");
        wrapper.className = "video-wrapper flex rounded bg-white p-4 shadow shadow-gray-300";

        // Tambahkan elemen kontrol untuk tampilan status
        const controls = document.createElement("div");
        controls.className = "mt-4 flex items-center gap-2";

        // Status video
        const statusVid = document.createElement("div");
        statusVid.className = "text-sm text-gray-600";
        statusVid.textContent = isVideoOn ? <FaVideo /> : <FaVideoSlash />;

        // Status mikrofon
        const statusMic = document.createElement("div");
        statusMic.className = "text-sm text-gray-600";
        statusMic.textContent = isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />;

        // Label nama pengguna
        const label = document.createElement("p");
        label.className = "username text-center text-base font-semibold";
        label.textContent = `${myData?.role === "veterinarian" ? consultation?.bookerName : consultation?.veterinarianNameAndTitle}`;

        // Susun elemen dalam wrapper
        controls.appendChild(statusVid);
        controls.appendChild(statusMic);
        controls.appendChild(label);
        wrapper.appendChild(videoElement);
        wrapper.appendChild(controls);

        // Tambahkan wrapper ke video container
        videoContainerRef.current?.appendChild(wrapper);
        setIdSocket([...idSocket, socketId]);
      }
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
      setIsMessagesEndRef(msg);
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
        setTypeTimer("before");
        setTimerClass("before"); // Indikator waktu menuju mulai
      } else {
        distance = endTime - now;
        setTypeTimer("after");
        setShowVideo(true);
        setShowTextEditor(true);
        setTimerClass("after"); // Indikator waktu menuju selesai
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24)); // Hitung hari
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Format teks timer dengan hari
      setTimerText(`${days}h ${hours.toString().padStart(2, "0")}j:${minutes.toString().padStart(2, "0")}m:${seconds.toString().padStart(2, "0")}d`);

      // Jika waktu sudah lewat
      if (typeTimer === "after") {
        setShowChat(true);
      } else if (distance <= 300 && typeTimer === "before") {
        setShowChat(true);
      }

      if (distance < -10) {
        clearInterval(interval);
        leaveRoom();
        Navigate("/layanan");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [consultation]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isMessagesEndRef]);

  useEffect(() => {
    if (!quillInstance.current && editorRef.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Mulai mengetik di sini...",
        modules: {
          toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"]],
        },
      });
    }

    const quill = quillInstance.current;

    const savedData = JSON.parse(localStorage.getItem("hasilKonsultasi")) || [];
    const currentData = savedData.find((item) => item.idBooking === idBooking);

    if (currentData && isJoined) {
      quill.root.innerHTML = currentData.content;
    }

    const handleTextChange = () => {
      const content = quill.root.innerHTML;

      const existingData = JSON.parse(localStorage.getItem("hasilKonsultasi")) || [];

      const updatedData = existingData.filter((item) => item.idBooking !== idBooking);

      updatedData.push({ idBooking, content });

      localStorage.setItem("hasilKonsultasi", JSON.stringify(updatedData));
    };

    if (isJoined) {
      quill.on("text-change", handleTextChange);
    }

    const placeholderStyle = `
      color: #888; 
      font-style: italic; 
      white-space: nowrap; 
      overflow: hidden; 
      text-overflow: ellipsis; 
      display: block;
    `;

    if (isJoined) {
      const quillEditorElement = editorRef.current.querySelector(".ql-editor::before");
      if (quillEditorElement) {
        quillEditorElement.style.cssText = placeholderStyle;
      }
    }

    return () => {
      if (isJoined) {
        quill.off("text-change", handleTextChange);
      }
    };
  }, [idBooking, isJoined]);

  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-slate-50 p-8">
      <div className="mx-auto flex w-[90%] justify-center gap-4">
        {isJoined ? (
          <>
            <section className="w-max min-w-[800px]">
              <div className="mb-4 flex justify-between">
                <section>
                  <h1 className="text-lg font-bold capitalize text-gray-800">
                    {consultation?.serviceName}
                    <span className="block text-sm font-medium text-gray-600">
                      {new Date(consultation?.startTime).toLocaleString()} - {new Date(consultation?.endTime).toLocaleString()}
                    </span>
                  </h1>
                  {!showVideo && <p className="font-medium italic">saat ini anda sudah bisa berkomunikasi Via chat, video akan ditampilkan saat waktu konsultasi dimulai</p>}
                </section>
                <div id="meeting-info">
                  <div className="flex items-center gap-2">
                    <button onClick={isJoined ? leaveRoom : joinRoom} className={`rounded px-2 py-1 text-sm font-medium transition duration-300 ${isJoined ? "bg-red-600 text-white hover:bg-red-700" : "bg-green-600 text-white hover:bg-green-700"}`}>
                      {isJoined ? "Leave Room" : "Join Room"}
                    </button>
                    {consultation && (
                      <div className="flex">
                        <span id="timer" className={`rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold text-white shadow ${timerClass}`}>
                          {timerText}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {showVideo && (
                <>
                  <div ref={videoContainerRef} id="videoContainer" className="video-container flex items-center gap-2">
                    <div className="video-wrapper flex rounded bg-white p-4 shadow shadow-gray-300">
                      <div className="">
                        <video id="video-local" ref={localVideoRef} autoPlay playsInline muted className="w-[400px] rounded bg-blue-200" />
                        <div className="mt-4 flex items-center gap-2">
                          <button onClick={toggleVideo} className="flex aspect-square h-8 items-center justify-center rounded border-2 border-gray-300">
                            {localIsVideoOn ? <FaVideo /> : <FaVideoSlash />}
                          </button>
                          <button onClick={toggleMute} className="flex aspect-square h-8 items-center justify-center rounded border-2 border-gray-300">
                            {localIsMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                          </button>
                          <p className="username text-center text-base font-semibold">{consultation?.veterinarianNameAndTitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="controls mt-4 flex gap-3">
                    <div className="flex-1">
                      <label htmlFor="cameraSelect" className="mb-1 block text-sm font-medium text-gray-700">
                        Pilih Kamera
                      </label>
                      <select id="cameraSelect" onChange={handleCameraChange} className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-blue-500">
                        {videoDevices.map((device) => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Camera ${device.deviceId.slice(0, 5)}`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1">
                      <label htmlFor="microphoneSelect" className="mb-1 block text-sm font-medium text-gray-700">
                        Pilih Mikrofon
                      </label>
                      <select id="microphoneSelect" onChange={handleMicrophoneChange} className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-blue-500">
                        {audioDevices.map((device) => (
                          <option key={device.deviceId} value={device.deviceId}>
                            {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-10 w-[800px]">
                    <div ref={editorRef} id="editor-container" className="border bg-white"></div>
                  </div>
                </>
              )}
            </section>
            {showChat && (
              <section className="max-w-[800px] flex-1">
                <div className="chat-container shadow-gray rounded bg-white p-4 shadow">
                  <ul id="messages" className="messages-list max-h-[500px] min-h-[400px] space-y-4 overflow-y-auto pr-2">
                    {messages.map((msg, index) => (
                      <li key={index} className={`flex ${msg.userId === myData?.id ? "justify-start" : "justify-end"}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${msg.userId === myData?.id ? "bg-gray-50 text-black" : "bg-blue-600 text-white"}`}>
                          {msg.message.startsWith("WITHFILE:") ? (
                            <div>
                              <p className="text-base font-semibold">{msg.userId === myData?.id ? `Anda (${myData.role === "veterinarian" ? consultation.veterinarianNameAndTitle : consultation.bookerName})` : myData.role === "veterinarian" ? consultation.bookerName : consultation.veterinarianNameAndTitle}</p>
                              <p className="text-sm">{msg.message.split("END;")[1]}</p>
                              <a href={`https://api.temanternak.h14.my.id/${msg.message.split("END;")[0].replace("WITHFILE:", "")}`} target="_blank" rel="noopener noreferrer" className={`${msg.userId === myData?.id ? "text-blue-600" : "text-white"} text-sm underline hover:text-blue-700`}>
                                View Attachment
                              </a>
                            </div>
                          ) : (
                            <>
                              <p className="text-base font-semibold">{msg.userId === myData?.id ? `Anda (${myData.role === "veterinarian" ? consultation.veterinarianNameAndTitle : consultation.bookerName})` : myData.role === "veterinarian" ? consultation.bookerName : consultation.veterinarianNameAndTitle}</p>
                              <p className="text-sm">{msg.message}</p>
                            </>
                          )}
                          <small className="timestamp mt-2 text-xs text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</small>
                        </div>
                      </li>
                    ))}
                    <div ref={messagesEndRef}></div>
                  </ul>

                  <form id="chatForm" onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
                    <section className="flex flex-1 flex-col gap-2">
                      <input type="text" ref={messageInputRef} id="messageInput" placeholder="Type a message..." className="rounded border border-gray-300 p-2 text-sm" />
                      <input type="file" ref={fileInputRef} id="fileInput" accept="image/*" className="rounded border border-gray-300 p-1 text-sm" />
                    </section>
                    <button type="submit" className="h-max rounded bg-blue-600 px-2 py-2 text-white">
                      <IoMdSend />
                    </button>
                  </form>
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            {showVideo ? (
              <div className="space-y-4 rounded-md bg-white p-6 text-center shadow-md">
                <section className="flex items-center">
                  <Link to="/layanan" className="text-blue-600 underline transition duration-200 hover:text-blue-800">
                    Kembali ke Layanan
                  </Link>
                  <button onClick={joinRoom} className="text-blue-600 underline transition duration-200 hover:text-blue-800">
                    Kembali kedalam room
                  </button>
                </section>
                <p className="text-sm text-gray-600">
                  Konsultasi sedang berlangsung <span className="font-bold">Jika anda keluar, konsultasi bisa dianggap tidak sah!</span>.
                </p>
              </div>
            ) : (
              <div className="space-y-4 rounded-md bg-white p-6 text-center shadow-md">
                <section>
                  <Link to="/layanan" className="text-blue-600 underline transition duration-200 hover:text-blue-800">
                    Kembali ke Layanan
                  </Link>
                  {showChat && (
                    <button onClick={joinRoom} className="text-blue-600 underline transition duration-200 hover:text-blue-800">
                      Masuk kedalam room
                    </button>
                  )}
                </section>
                <div className="text-lg font-semibold text-gray-800">
                  Konsultasi Baru Akan Dimulai Setelah <span className="text-blue-600">{timerText}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Anda baru bisa bergabung ke dalam room <span className="font-bold">5 menit sebelum mulai</span>.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default VideoRoom;
