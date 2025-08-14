// ======Chat bot Implementation======//
import { useState } from "react";
import { FaComments, FaPaperPlane } from "react-icons/fa";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there 👋\nHow can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`, // <-- Replace with your OpenAI API key
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...messages.map((m) => ({
              role: m.sender === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: input },
          ],
        }),
      });

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || "Sorry, I didn't get that.";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong. Please try again." },
      ]);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 shadow-xl flex items-center justify-center transform hover:scale-110 transition duration-300 z-50"
        aria-label="Chat"
      >
        <FaComments className="text-2xl" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 max-h-[70vh] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          <div className="bg-purple-600 text-white text-lg font-semibold px-4 py-3 rounded-t-lg">
            Chatbot
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white self-end ml-auto"
                    : "bg-gray-100 text-gray-900 self-start mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex items-center border-t px-2 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a message..."
              className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
