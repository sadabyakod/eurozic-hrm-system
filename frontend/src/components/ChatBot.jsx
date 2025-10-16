
import React, { useState } from "react";

export default function ChatBot(){
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock responses for demo purposes
  const mockResponses = [
    "Hello! I'm a demo chatbot. How can I help you today?",
    "That's an interesting question! In a real implementation, I would connect to an AI service.",
    "I'm currently running in demo mode with mock responses.",
    "For a fully functional chatbot, you would need to integrate with OpenAI or another AI service.",
    "Thanks for trying out the demo! The UI is working perfectly.",
    "In production, this would connect to a backend API for AI responses.",
    "This is a sample response to demonstrate the chat interface."
  ];

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setMessages(prev => [...prev, { sender: "bot", text: randomResponse }]);
      setLoading(false);
      setInput("");
    }, 1000);
  };

  return (
    <div style={{maxWidth: 700}}>
      <div style={{border:"1px solid #ddd", padding:10, height:300, overflowY:"auto", background:"#fafafa"}}>
        {messages.map((m,i)=>(
          <div key={i} style={{margin:8, textAlign: m.sender==="user" ? "right" : "left"}}>
            <div style={{display:"inline-block", padding:10, borderRadius:8, background: m.sender==="user" ? "#d1e7ff" : "#e9ecef"}}>
              <strong>{m.sender==="user" ? "You" : "Bot"}: </strong>{m.text}
            </div>
          </div>
        ))}
        {messages.length===0 && <div style={{color:"#666"}}>No messages yet. Ask anything! (Demo mode with mock responses)</div>}
      </div>

      <div style={{marginTop:10, display:"flex"}}>
        <input 
          value={input} 
          onChange={e=>setInput(e.target.value)} 
          onKeyPress={e => e.key === 'Enter' && send()}
          style={{flex:1, padding:8}} 
          placeholder="Type your question..." 
        />
        <button onClick={send} style={{marginLeft:8, padding:"8px 12px"}} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}
