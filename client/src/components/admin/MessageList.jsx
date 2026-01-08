// src/components/admin/MessageList.jsx
import React from "react";

const dummyMessages = [
  { id: 1, name: "Alice", text: "Hi, loved your portfolio!" },
  { id: 2, name: "Bob", text: "Can we work together?" },
  { id: 3, name: "Charlie", text: "Great projects!" },
];

const MessageList = () => {
  return (
    <div className="space-y-4">
      {dummyMessages.map((msg) => (
        <div
          key={msg.id}
          className="rounded bg-white p-4 shadow dark:bg-gray-800"
        >
          <p className="font-semibold">{msg.name}</p>
          <p>{msg.text}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
