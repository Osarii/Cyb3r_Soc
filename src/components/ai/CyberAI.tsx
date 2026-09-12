import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Mic, Send, Volume2, VolumeX, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSOCStore } from '../../app/store/useSOCStore';
import { CyberAIOrb } from '../assets/CyberAIOrb';
import { CyberButton, CyberIconButton, CyberInput } from '../ui';
import { useVisualTestMode } from '../../config/visualTest';

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => any;
    SpeechRecognition?: new () => any;
  }
}

export function CyberAI() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [answer, setAnswer] = useState('Centro de operaciones estable. ¿En qué puedo ayudarte?');
  const [muted, setMuted] = useState(false);
  const navigate = useNavigate();
  const aiState = useSOCStore(state => state.aiState);
  const setAIState = useSOCStore(state => state.setAIState);
  const responseTimer = useRef<number | undefined>(undefined);
  const visualTest = useVisualTestMode();

  useEffect(() => {
    if (visualTest && aiState !== 'IDLE') setAIState('IDLE');
  }, [aiState, setAIState, visualTest]);

  useEffect(() => () => {
    if (responseTimer.current) window.clearTimeout(responseTimer.current);
    window.speechSynthesis?.cancel();
  }, []);

  const speak = (message: string) => {
    if (visualTest) {
      setAIState('IDLE');
      return;
    }
    if (muted || !('speechSynthesis' in window)) {
      window.setTimeout(() => setAIState('IDLE'), 220);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-CR';
    utterance.onend = () => setAIState('IDLE');
    utterance.onerror = () => setAIState('ERROR');
    window.speechSynthesis.speak(utterance);
  };

  const respond = (query: string) => {
    if (visualTest) return;
    const normalized = query.toLowerCase();
    setAIState('THINKING');

    if (responseTimer.current) window.clearTimeout(responseTimer.current);
    responseTimer.current = window.setTimeout(() => {
      const current = useSOCStore.getState();
      let message = 'Puedo consultar el estado del SOC, incidentes, activos y navegación interna.';
      if (normalized.includes('mapa')) {
        navigate('/threat-map');
        message = 'Abriendo el mapa global de amenazas.';
      } else if (normalized.includes('crític')) {
        const critical = current.incidents.filter(item => item.severity === 'Critical' && item.status !== 'Resolved').length;
        message = `Hay ${critical} incidentes críticos abiertos.`;
      } else if (normalized.includes('activo')) {
        const active = current.incidents.filter(item => item.status === 'Active').length;
        message = `Se monitorean mil cuatrocientos veintiocho activos y hay ${active} incidentes activos.`;
      } else if (normalized.includes('ddos') && normalized.includes('inicia')) {
        message = 'La simulación DDoS se inicia únicamente desde la consola de ataque controlado.';
      } else if (normalized.includes('resume') || normalized.includes('estado')) {
        const openIncidents = current.incidents.filter(item => item.status !== 'Resolved').length;
        message = `El SOC está estable. Hay ${openIncidents} incidentes abiertos y ${current.attacks.length} simulaciones en curso.`;
      }

      setAnswer(message);
      setAIState('SPEAKING');
      speak(message);
    }, 600);
  };

  const listen = () => {
    if (visualTest) return;
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setAnswer('El reconocimiento de voz no está disponible en este navegador. Usa el campo de texto.');
      setAIState('ERROR');
      return;
    }

    const recognition = new Recognition();
    recognition.lang = 'es-CR';
    recognition.interimResults = false;
    recognition.continuous = false;
    setAIState('LISTENING');
    recognition.onresult = (event: any) => {
      const query = event.results[0][0].transcript as string;
      setText(query);
      respond(query);
    };
    recognition.onerror = () => setAIState('ERROR');
    recognition.onend = () => {
      if (useSOCStore.getState().aiState === 'LISTENING') setAIState('IDLE');
    };
    recognition.start();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const query = text.trim();
    if (!query) return;
    respond(query);
    setText('');
  };

  return <div className={`cyber-ai ${aiState.toLowerCase()}`}>
    <div className={`ai-panel ${open ? 'open' : ''}`} aria-hidden={!open}>
      <header>
        <div><b>CYBERAI</b><span><i/> {aiState}</span></div>
        <CyberIconButton onClick={() => setOpen(false)} aria-label="Cerrar asistente"><X size={16}/></CyberIconButton>
      </header>
      <div className="ai-message" aria-live="polite">{answer}</div>
      <div className="ai-prompts">
        <button type="button" onClick={() => respond('Resume el estado del SOC')}>Resumen del SOC</button>
        <button type="button" onClick={() => respond('Incidentes críticos')}>Incidentes críticos</button>
      </div>
      <form onSubmit={submit}>
        <CyberInput value={text} onChange={event => setText(event.target.value)} placeholder="Pregunta a CyberAI…" aria-label="Pregunta a CyberAI"/>
        <CyberIconButton type="submit" aria-label="Enviar"><Send size={16}/></CyberIconButton>
      </form>
      <div className="voice-row">
        <CyberButton onClick={listen}><Mic size={14}/> Escuchar</CyberButton>
        <CyberIconButton onClick={() => setMuted(value => !value)} aria-label={muted ? 'Activar voz' : 'Silenciar voz'}>{muted ? <VolumeX size={15}/> : <Volume2 size={15}/>}</CyberIconButton>
      </div>
    </div>
    <span className="cyber-ai-tooltip">¿En qué puedo<br/>ayudarte hoy?</span>
    <button className="ai-orb" type="button" onClick={() => setOpen(value => !value)} aria-label="Abrir CyberAI" aria-expanded={open}>
      <CyberAIOrb state={aiState.toLowerCase() as 'idle' | 'listening' | 'thinking' | 'speaking' | 'error'}/>
    </button>
  </div>;
}
