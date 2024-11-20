import React, { useState } from "react";

const ChatBox = ({ socket, myData }) => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (socket && message) {
      socket.emit("sendMessage", { message });
      setMessage("");
    }
  };

  return (
    <div id="chatBox">
      <ul id="messages"></ul>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;
