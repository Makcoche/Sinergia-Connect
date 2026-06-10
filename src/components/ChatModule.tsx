import React, { useState, useEffect, useRef } from 'react';
import { ChatChannel, ChatMessage } from '../types';
import { MessageSquare, Send, CheckCheck, Smile, Phone, Video, ShieldAlert, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatModuleProps {
  channels: ChatChannel[];
  messages: ChatMessage[];
  onSendMessage: (channelId: string, text: string) => void;
  onSimulateIncomingMessage: (channelId: string, senderId: string, senderName: string, role: string, text: string) => void;
}

export default function ChatModule({ channels, messages, onSendMessage, onSimulateIncomingMessage }: ChatModuleProps) {
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-1');
  const [typeText, setTypeText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannelId]);

  const activeChannel = channels.find(c => c.id === activeChannelId);
  const activeChannelMessages = messages.filter(m => m.channelId === activeChannelId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeText.trim()) return;

    const textToSend = typeText.trim();
    onSendMessage(activeChannelId, textToSend);
    setTypeText('');

    // Trigger instant mock responder robot
    setTimeout(() => {
      let simulatedReply = '';
      let simulatedSenderName = 'Manuel Beltrán';
      let simulatedSenderId = 'usr-4';
      let simulatedSenderRole = 'driver';

      if (activeChannelId === 'chan-1') {
        simulatedReply = '¡Recibido! Estoy registrando la temperatura de la carga refrigerada justo ahora. Todo marcha sobre ruedas.';
      } else if (activeChannelId === 'chan-2') {
        simulatedReply = 'Hola. Su solicitud de soporte técnico para Sinergia Connect ha sido escalada. Un asesor lo atenderá en breve en Sandbox.';
        simulatedSenderName = 'Jose Gregorio Admin';
        simulatedSenderId = 'usr-1';
        simulatedSenderRole = 'super_admin';
      } else {
        simulatedReply = 'Entendido, muchas gracias por la información en Sinergia Connect.';
        simulatedSenderName = 'Comercio Afiliado';
        simulatedSenderId = 'usr-7';
        simulatedSenderRole = 'merchant';
      }

      onSimulateIncomingMessage(
        activeChannelId,
        simulatedSenderId,
        simulatedSenderName,
        simulatedSenderRole,
        simulatedReply
      );
    }, 1500);
  };

  return (
    <div id="chat-module" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[420px]">
      
      {/* Sidebar: Channels list */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col justify-between bg-slate-50/50">
        <div>
          <div className="p-4 border-b border-slate-200/80 bg-white">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5 uppercase">
              <MessageSquare className="w-4.5 h-4.5 text-indigo-600" />
              Bandeja de Entrada
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Chat Integrado Multiempresa</p>
          </div>

          <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
            {channels.map(chan => {
              const isSelected = chan.id === activeChannelId;
              const belongsToRoleColor = chan.participantRole === 'driver' ? 'border-l-4 border-emerald-500' : 'border-l-4 border-indigo-500';

              return (
                <button
                  id={`chat-chan-${chan.id}`}
                  key={chan.id}
                  onClick={() => setActiveChannelId(chan.id)}
                  className={`w-full text-left p-3.5 flex gap-3 transition-colors ${
                    isSelected ? 'bg-indigo-50 font-semibold' : 'bg-transparent hover:bg-slate-50'
                  } ${belongsToRoleColor}`}
                >
                  <img
                    src={chan.participantAvatar}
                    alt={chan.participantName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-150 flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-bold text-slate-800 truncate leading-relaxed">{chan.participantName}</p>
                      {chan.unreadCount > 0 && (
                        <span className="bg-rose-500 text-white font-extrabold px-1.5 py-0.5 rounded-full text-[9px]">
                          {chan.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 capitalize">{chan.participantRole}</p>
                    <p className="text-[10.5px] text-slate-500 truncate mt-1 leading-normal">{chan.lastMessage}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3.5 bg-slate-100/50 border-t border-slate-200 text-[10px] text-slate-500">
          <p className="font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Sinergia Messenger Service
          </p>
          <p className="text-[9px] text-slate-400 mt-0.5 leading-relaxed">Conexiones directas e inmediatas mediante WebSockets de Sandbox.</p>
        </div>
      </div>

      {/* Main Chat thread */}
      <div className="flex-grow flex flex-col justify-between h-full bg-slate-50 relative">
        {activeChannel ? (
          <>
            {/* Thread Header */}
            <div className="p-3.5 border-b border-slate-200/80 bg-white flex justify-between items-center px-4">
              <div className="flex items-center gap-3">
                <img
                  src={activeChannel.participantAvatar}
                  alt={activeChannel.participantName}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover border border-slate-150"
                />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">{activeChannel.participantName}</h4>
                  <p className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping"></span>
                    Activo ahora • Canal Directo
                  </p>
                </div>
              </div>

              {/* Action triggers */}
              <div className="flex items-center gap-3 text-slate-400">
                <button className="hover:text-slate-800 text-xs"> Llamar </button>
                <button className="hover:text-slate-800 text-xs"> Video </button>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3.5">
              {activeChannelMessages.map(msg => {
                const isMe = msg.senderRole === 'client';
                const containerClass = isMe ? 'justify-end' : 'justify-start';
                const bubbleClass = isMe 
                  ? 'bg-slate-800 text-white rounded-br-none rounded-2xl' 
                  : 'bg-white text-slate-800 rounded-bl-none rounded-2xl border border-slate-150';

                return (
                  <div key={msg.id} className={`flex ${containerClass}`}>
                    <div className="max-w-[75%] space-y-1">
                      {!isMe && (
                        <p className="text-[9px] text-slate-400 font-extrabold capitalize">{msg.senderName} ({msg.senderRole})</p>
                      )}
                      
                      <div className={`p-3 text-xs leading-relaxed ${bubbleClass}`}>
                        <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      <div className="flex items-center gap-1 justify-end text-[8px] text-slate-400">
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Typing bar form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200/80 flex gap-2 items-center px-4">
              <input
                type="text"
                placeholder="Escribe tu mensaje en Sinergia..."
                value={typeText}
                onChange={(e) => setTypeText(e.target.value)}
                className="flex-grow px-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />

              <button
                id="sumbit-chat-msg"
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all cursor-pointer flex items-center justify-center justify-self-center self-center justify-items-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-400 p-6">
            <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
            <p className="text-sm font-semibold">Selecciona una conversación a la izquierda</p>
            <p className="text-xs text-slate-400 text-center mt-1">Podrás chatear en tiempo real con conductores del transporte de carga o con soporte oficial.</p>
          </div>
        )}
      </div>

    </div>
  );
}
