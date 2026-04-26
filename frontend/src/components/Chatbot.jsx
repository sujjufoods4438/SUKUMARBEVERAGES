import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Chatbot() {
  const { user, API } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hello! I am your AW Assistant. How can I help you today?', lang: 'en' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const translations = {
    en: { placeholder: 'Type a message...', bot: 'AW Assistant' },
    te: { placeholder: 'సందేశాన్ని టైప్ చేయండి...', bot: 'AW అసిస్టెంట్' },
    hi: { placeholder: 'संदेश टाइप करें...', bot: 'AW सहायक' }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const config = user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
      const { data } = await axios.post(`${API}/chatbot/message`, 
        { message: userMsg, lang },
        config
      );
      setMessages(prev => [...prev, { type: 'bot', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { type: 'bot', text: 'Sorry, I am having trouble connecting. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: 24, right: 24, width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
          color: '#fff', border: 'none', boxShadow: '0 8px 32px rgba(0,180,216,0.4)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {isOpen ? <X size={28}/> : <MessageSquare size={28}/>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 100, right: 24, width: 360, height: 500,
          background: 'var(--bg)', border: '1px solid var(--glass-border)', borderRadius: 20,
          boxShadow: '0 12px 48px rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', flexDirection: 'column',
          overflow: 'hidden', animation: 'slideUp 0.3s ease'
        }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, var(--bg2), var(--bg))', padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--primary)15', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={24}/>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{translations[lang].bot}</div>
                <div style={{ fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }}/> Online
                </div>
              </div>
            </div>
            {/* Lang Switcher */}
            <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.05)', padding: 4, borderRadius: 8 }}>
              {['en', 'te', 'hi'].map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  style={{
                    padding: '4px 8px', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 700,
                    background: lang === l ? 'var(--primary)' : 'transparent',
                    color: lang === l ? '#fff' : 'var(--text-muted)', cursor: 'pointer'
                  }}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ alignSelf: m.type === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div style={{
                  padding: '12px 16px', borderRadius: 16, fontSize: 14, lineHeight: 1.5,
                  background: m.type === 'user' ? 'var(--primary)' : 'var(--bg2)',
                  color: m.type === 'user' ? '#fff' : 'var(--text)',
                  borderBottomRightRadius: m.type === 'user' ? 4 : 16,
                  borderBottomLeftRadius: m.type === 'bot' ? 4 : 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && <div style={{ alignSelf: 'flex-start', background: 'var(--bg2)', padding: '12px 16px', borderRadius: 16, display: 'flex', gap: 4 }}>
              <div className="dot-pulse" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)' }}/>
              <div className="dot-pulse" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)', animationDelay: '0.2s' }}/>
              <div className="dot-pulse" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)', animationDelay: '0.4s' }}/>
            </div>}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg2)', display: 'flex', gap: 12 }}>
            <input
              className="form-input"
              placeholder={translations[lang].placeholder}
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{ marginBottom: 0, borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--glass-border)' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: 0, width: 44, height: 44, minWidth: 44, borderRadius: 12, justifyContent: 'center' }}>
              <Send size={20}/>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
