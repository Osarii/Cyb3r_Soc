import { useState, type FormEvent } from 'react';
import { Mic, Send, Volume2, VolumeX, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSOCStore } from '../../app/store/useSOCStore';
import ExactAIIcon from '../referenceExact/ExactAIIcon';
import { CyberButton, CyberIconButton, CyberInput } from '../ui';

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
  const state = useSOCStore();

  const speak = (message: string) => {
    if (muted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'es-CR';
    window.speechSynthesis.speak(utterance);
  };

  const respond = (query: string) => {
    const normalized = query.toLowerCase();
    state.setAIState('THINKING');

    window.setTimeout(() => {
      let message = 'Puedo consultar el estado del SOC, incidentes, activos y navegación interna.';
      if (normalized.includes('mapa')) {
        navigate('/threat-map');
        message = 'Abriendo el mapa global de amenazas.';
      } else if (normalized.includes('crític')) {
        const critical = state.incidents.filter(item => item.severity === 'Critical' && item.status !== 'Resolved').length;
        message = `Hay ${critical} incidentes críticos abiertos.`;
      } else if (normalized.includes('activo')) {
        const active = state.incidents.filter(item => item.status === 'Active').length;
        message = `Se monitorean mil cuatrocientos veintiocho activos y hay ${active} incidentes activos.`;
      } else if (normalized.includes('ddos') && normalized.includes('inicia')) {
        message = 'La simulación DDoS se inicia únicamente desde la consola de ataque controlado.';
      } else if (normalized.includes('resume') || normalized.includes('estado')) {
        const openIncidents = state.incidents.filter(item => item.status !== 'Resolved').length;
        message = `El SOC está estable. Hay ${openIncidents} incidentes abiertos y ${state.attacks.length} simulaciones en curso.`;
      }

      setAnswer(message);
      state.setAIState('SPEAKING');
      speak(message);
      window.setTimeout(() => state.setAIState('IDLE'), 2200);
    }, 600);
  };

  const listen = () => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setAnswer('El reconocimiento de voz no está disponible en este navegador. Usa el campo de texto.');
      return;
    }

    const recognition = new Recognition();
    recognition.lang = 'es-CR';
    recognition.interimResults = false;
    recognition.continuous = false;
    state.setAIState('LISTENING');
    recognition.onresult = (event: any) => {
      const query = event.results[0][0].transcript as string;
      setText(query);
      respond(query);
    };
    recognition.onerror = () => state.setAIState('ERROR');
    recognition.onend = () => {
      if (useSOCStore.getState().aiState === 'LISTENING') state.setAIState('IDLE');
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

  return <div className={`cyber-ai ${state.aiState.toLowerCase()}`}>
    <div className={`ai-panel ${open ? 'open' : ''}`} aria-hidden={!open}>
      <header>
        <div><b>CYBERAI</b><span><i/> {state.aiState}</span></div>
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
      <ExactAIIcon/>
    </button>
  </div>;
}
