import { useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function ThreatHuntChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/hunt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();
      const assistantMessage = { role: "assistant", text: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Error fetching CTI report:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Threat Hunting Chatbot</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-col space-y-3 max-h-[500px] overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-[75%] whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-green-100 text-green-900 self-start text-left"
                  : "bg-sky-100 text-sky-900 self-end text-right"
              }`}
            >
              <strong>
                {msg.role === "user" ? "You" : "Cybersecurity Assistant"}
              </strong>
              <div className="mt-1">
                {msg.role === "assistant" ? (
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          className="flex-grow border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ask about threats, IOCs, TTPs..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>
    </div>
  );
}