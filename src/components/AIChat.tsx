import { useState, useEffect, useRef, FormEvent } from "react";
import { Send, Sparkles, Bot, User, Stethoscope, AlertCircle, HelpCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  symptomPreload: string;
  setSymptomPreload: (msg: string) => void;
  setView: (view: string) => void;
}

export default function AIChat({ symptomPreload, setSymptomPreload, setView }: AIChatProps) {
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Olá! Sou a Assistente Virtual do Instituto SerClin. Estou aqui para ajudar você a entender seus sintomas, direcioná-lo para a especialidade correta (Psicologia, Psiquiatria, Fonoaudiologia, Nutrição ou Fisioterapia) ou tirar dúvidas sobre agendamentos de consulta. \n\nComo posso ajudar você hoje?"
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Suggested quick trigger chips
  const suggestionChips = [
    { label: "Sinto dores nas costas", text: "Tenho sentido dores frequentes na coluna e nas costas ao trabalhar. Qual profissional devo agendar?" },
    { label: "Dúvidas sobre Reembolso", text: "Como funciona o reembolso de consultas para planos como Unimed ou Bradesco no Instituto SerClin?" },
    { label: "Manejo de Estresse & Ansiedade", text: "Estou enfrentando muito estresse no trabalho e crises leves de ansiedade. Vocês oferecem psicoterapia?" },
    { label: "Reeducação Alimentar", text: "Quero começar um plano nutricional realista para emagrecimento consciente. Quais especialistas atendem nessa área?" }
  ];

  // If symptomPreload was populated (from physical triage logging), trigger it automatically
  useEffect(() => {
    if (symptomPreload) {
      const userMsg = symptomPreload;
      // Clear preload parent state so it doesn't loop
      setSymptomPreload("");
      handleSendMessage(userMsg);
    }
  }, [symptomPreload]);

  // Scroll details to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setApiError("");
    const newMessages: Message[] = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro no servidor de IA.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (err: any) {
      console.error("AI Error:", err);
      setApiError(err.message || "Erro de conexão com o robô.");
      
      // Fallback response so user isn't stuck if credentials are missing
      const fallbackReply = "A chave do assistente (GEMINI_API_KEY) não pôde ser ativada no momento.\n\n" +
                            "**No entanto, com base no seu relato, recomendamos verificar nossas especialidades:**\n" +
                            "- Se for muscular, agende com **Fisioterapia**.\n" +
                            "- Se for estresse ou desenvolvimento, agende com **Psicologia** ou **Psiquiatria**.\n" +
                            "- Se for linguagem ou voz, agende com **Fonoaudiologia**.\n" +
                            "- Se for físico ou dieta, agende com **Nutrição**.\n\n" +
                            "Você pode clicar na aba 'Agendar Consulta' para marcar um horário livre diretamente!";
                            
      setMessages((prev) => [...prev, { role: "assistant", content: fallbackReply }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  return (
    <div className="flex-grow max-w-4xl mx-auto px-4 py-6 sm:py-10 w-full flex flex-col h-[700px]" id="ai-chat-view-container">
      
      {/* Clinic Chat Title Panel */}
      <div className="bg-white p-4 rounded-t-2xl border-t border-x border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center relative">
            <Bot className="w-5.5 h-5.5" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h2 className="font-bold text-slate-850 text-slate-800 text-sm sm:text-base leading-snug">Assistente SerClin IA</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold font-mono px-1.5 py-0.5 rounded leading-none">Online</span>
              <span className="text-[10px] text-slate-400 font-medium">Powered by Gemini 3.5</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setView("booking")}
          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100/50"
        >
          Agendar Consulta
        </button>
      </div>

      {/* Messages Feed Feed Body */}
      <div className="flex-grow bg-slate-50 border-x border-b border-slate-205 border-slate-200 p-4 sm:p-6 overflow-y-auto space-y-4 flex flex-col">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 max-w-2xl ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
          >
            {/* Avatar block */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              msg.role === "user" ? "bg-emerald-600 text-white" : "bg-slate-850 bg-slate-800 text-white"
            }`}>
              {msg.role === "user" ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
            </div>

            {/* Bubble */}
            <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-line shadow-sm border ${
              msg.role === "user"
                ? "bg-emerald-600 text-white border-emerald-600 rounded-tr-none"
                : "bg-white text-slate-700 border-slate-100 rounded-tl-none"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading typing state */}
        {isLoading && (
          <div className="flex gap-3 max-w-xl self-start">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div className="bg-white text-slate-400 border border-slate-100 p-4 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-350 bg-slate-450 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-350 bg-slate-450 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-slate-350 bg-slate-450 bg-slate-400 rounded-full animate-bounce delay-200"></span>
              </div>
              <span className="font-mono text-slate-400">SerClin IA está processando seu relato medicinal...</span>
            </div>
          </div>
        )}

        {/* Warning Error Banner */}
        {apiError && (
          <div className="bg-amber-50 text-amber-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border border-amber-100 max-w-xl self-center">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Usando assistente informativo offline. Consulte nossa equipe médica.</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 1 && (
        <div className="p-3 bg-white border-x border-slate-200" id="chat-suggestions">
          <p className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-2">Sugestões de Perguntas:</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.text)}
                className="px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-600 rounded-lg transition-all text-left"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Message Form */}
      <form onSubmit={handleInputSubmit} className="bg-white p-3.5 border-x border-b border-slate-200 rounded-b-2xl shadow-sm flex gap-2">
        <input
          type="text"
          placeholder="Fale com nosso assistente virtual sobre seus sintomas, fonoaudiologia, exames, etc..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          className="flex-grow px-4 py-3 text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-xl transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          id="chat-send-btn"
          className="px-5 py-3 bg-slate-800 hover:bg-slate-900 active:bg-black disabled:bg-slate-200 text-white rounded-xl shadow-md transition-all flex items-center justify-center flex-shrink-0"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>

      {/* Footer warning */}
      <div className="text-center text-[10px] font-mono text-slate-400 mt-3.5 flex items-center justify-center gap-1">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Importante: As orientações da Inteligência Artificial têm caráter meramente pedagógico/informativo e não substituem tratamento oficial.</span>
      </div>

    </div>
  );
}
