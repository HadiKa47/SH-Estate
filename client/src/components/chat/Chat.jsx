import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";
import UsersList from "../UsersList/UsersList";

function Chat() {
  const [chats, setChats] = useState([]);
  const [chat, setChat] = useState(null);
  const [isUsersListVisible, setIsUsersListVisible] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();

  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await apiRequest("/chats");
        setChats(res.data);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleOpenChat = async (receiverId) => {
    try {
      const res = await apiRequest.post("/chats", { receiverId });
      const chatId = res.data.id;
      const chatRes = await apiRequest.get(`/chats/${chatId}`);
      if (!chatRes.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...chatRes.data, receiverId });
      setIsUsersListVisible(false); // Hide user list when a chat is opened
    } catch (err) {
      console.error("Failed to open chat:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;
    try {
      const res = await apiRequest.post(`/messages/${chat.id}`, { text });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put(`/chats/read/${chat.id}`);
      } catch (err) {
        console.error("Failed to mark chat as read:", err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
          read();
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="chat">
      {isUsersListVisible ? (
        <UsersList onUserSelect={handleOpenChat} />
      ) : (
        <>
          <div className="messages">
            <h1>Messages</h1>
            {chats.map((c) => (
              <div
                className="message"
                key={c.id}
                style={{
                  backgroundColor:
                    c.seenBy.includes(currentUser.id) || chat?.id === c.id
                      ? "white"
                      : "#fecd514e",
                }}
                onClick={() => handleOpenChat(c.receiver.id)}
              >
                <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
                <span>{c.receiver.username}</span>
                <p>{c.lastMessage?.text || "No messages yet"}</p>
              </div>
            ))}
          </div>
          {chat && (
            <div className="chatBox">
              <div className="top">
                <div className="user">
                  <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="" />
                  {chat.receiver.username}
                </div>
                <span className="close" onClick={() => setChat(null)}>
                  X
                </span>
              </div>
              <div className="center">
                {chat.messages.map((message) => (
                  <div
                    className="chatMessage"
                    style={{
                      alignSelf:
                        message.userId === currentUser.id
                          ? "flex-end"
                          : "flex-start",
                      textAlign:
                        message.userId === currentUser.id ? "right" : "left",
                    }}
                    key={message.id}
                  >
                    <p>{message.text}</p>
                    <span>{format(message.createdAt)}</span>
                  </div>
                ))}
                <div ref={messageEndRef}></div>
              </div>
              <form onSubmit={handleSubmit} className="bottom">
                <textarea
                  name="text"
                  placeholder="Type a message..."
                ></textarea>
                <button type="submit">Send</button>
              </form>
            </div>
          )}
          <button
            className="showUsersList"
            onClick={() => setIsUsersListVisible(true)}
          >
            Show Users List
          </button>
        </>
      )}
    </div>
  );
}

export default Chat;
