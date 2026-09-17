import { useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode, type SVGProps } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Bot,
  ChartNoAxesColumnIncreasing,
  Check,
  CirclePause,
  Clock3,
  Database,
  FileChartColumn,
  Globe2,
  Info,
  LayoutDashboard,
  Moon,
  Network,
  Radar,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  Square,
  TriangleAlert,
  UsersRound,
  WifiOff,
} from 'lucide-react';
import ExactBackground from '../components/referenceExact/ExactBackground';
import EntrySystemShader from '../components/backgrounds/EntrySystemShader';
import { CyberAI } from '../components/ai/CyberAI';
import { Cyb3r_SocMark } from '../components/brand/Cyb3r_SocLogo';
import { AmbientField } from '../components/brand/AmbientField';
import { mitigationFixture } from '../data/fixtures/mitigation.fixture';
import { offlineFixture } from '../data/fixtures/offline.fixture';
import { DDoSInterceptor } from '../components/assets/DDoSInterceptor';
import { ServerStatusCube } from '../components/assets/ServerStatusCube';
import crystalCluster from '../assets/decorations/crystal-cluster-static.webp';
import { isVisualTestSearch } from '../config/visualTest';
import './special-screens.css';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export interface InitialBootScreenV2Props {
  progress?: number;
  onSkip?: () => void;
  onComplete?: () => void;
}

export function BootEntryScreen({ onStart }: { onStart: () => void }) {
  return <section className="ss-boot-entry" aria-label="Inicio del sistema">
    <EntrySystemShader />
    <div className="ss-boot-entry-hud" aria-hidden="true">
      <span className="ss-entry-ring ss-entry-ring--outer" />
      <span className="ss-entry-ring ss-entry-ring--inner" />
      <span className="ss-entry-core" />
      <span className="ss-entry-node ss-entry-node--a" />
      <span className="ss-entry-node ss-entry-node--b" />
      <span className="ss-entry-node ss-entry-node--c" />
    </div>

    <div className="ss-boot-entry-content">
      <div className="ss-boot-entry-brand" aria-label="CyberSOC brand">
        <span className="ss-boot-entry-mark"><Cyb3r_SocMark size={58} /></span>
        <div className="ss-boot-entry-copy">
          <small>SISTEMA DE OPERACIONES DE SEGURIDAD</small>
          <span>SECURE CONNECTION · CORE ONLINE</span>
        </div>
      </div>

      <p className="ss-boot-entry-title">CYBER<span>_</span>SOC</p>

      <div className="ss-boot-entry-status" aria-hidden="true">
        <span>SYSTEM READY</span>
        <span>SECURE CONNECTION</span>
        <span>CORE ONLINE</span>
      </div>

      <button type="button" onClick={onStart}>INICIAR SISTEMA</button>
    </div>
  </section>;
}

export interface DDoSMitigationScreenV2Props {
  progress: number;
  paused?: boolean;
  onPause?: () => void;
  onCancel?: () => void;
}

export interface ServerUnavailableV2Props {
  onRetry: () => void;
  onBack: () => void;
}

const navigation: Array<{ label: string; Icon: Icon; badge?: string }> = [
  { label: 'Dashboard', Icon: LayoutDashboard },
  { label: 'Mapa de amenazas', Icon: Shield },
  { label: 'Incidentes', Icon: ShieldAlert, badge: '12' },
  { label: 'Inteligencia', Icon: Bot },
  { label: 'Activos', Icon: Server },
  { label: 'Simulaciones', Icon: Radar },
  { label: 'Analítica', Icon: ChartNoAxesColumnIncreasing },
  { label: 'Reportes', Icon: FileChartColumn },
];

const utilityNavigation: Array<{ label: string; Icon: Icon }> = [
  { label: 'Automatización', Icon: Settings },
  { label: 'Configuración', Icon: Settings },
];

const mitigationStages = [
  ['Analizando patrones de tráfico', '00:12'],
  ['Desplegando reglas de mitigación', '00:26'],
  ['Filtrando tráfico en tiempo real', 'En proceso'],
  ['Estabilizando servicios', 'Pendiente'],
  ['Verificando retorno a la normalidad', 'Pendiente'],
] as const;

const securityLogs = [
  ['18:24:01', '[INFO]', 'Detección de tráfico anómalo\ndesde 203.0.113.0/24'],
  ['18:24:03', '[INFO]', 'Clasificando vectores de ataque...'],
  ['18:24:07', '[WARN]', '(SYN, UDP, HTTP Flood)'],
  ['18:24:08', '[INFO]', 'Pico de 12.4 Gbps detectado'],
  ['18:24:08', '[INFO]', 'Desplegando reglas en el firewall\nperimetral...'],
  ['18:24:11', '[INFO]', 'Activando scrubbing centers (3/3)'],
  ['18:24:15', '[INFO]', 'Bloqueando 1,258,432 IPs maliciosas'],
  ['18:24:18', '[INFO]', 'Filtrando tráfico en tiempo real...'],
  ['18:24:18', '[INFO]', 'Tráfico legítimo normalizándose'],
  ['18:24:24', '[INFO]', 'Monitoreo continuo activo'],
] as const;

const trafficBars = [
  22, 43, 64, 91, 112, 128, 117, 131, 119, 109, 101, 89, 77, 64, 54, 43, 35,
  31, 28, 25, 23, 21, 19, 17, 15, 14, 12, 11, 10, 9, 8, 8, 7, 6,
];

function clampProgress(value: number | undefined) {
  return Math.max(0, Math.min(100, value ?? 68));
}

const primaryThresholds = [0, 20, 40, 65, 90];
const lowerThresholds = [5, 30, 55, 80];

function getActiveThresholdIndex(value: number, thresholds: number[]) {
  const nextIndex = thresholds.findIndex(threshold => value < threshold);
  if (nextIndex === -1) return thresholds.length - 1;
  return Math.max(0, nextIndex - 1);
}

function CrystalMark({ className = '', compact = false }: { className?: string; compact?: boolean }) {
  return <span className={`ss-crystal-mark ${compact ? 'ss-crystal-mark--compact' : ''} ${className}`} aria-hidden="true">
    <Cyb3r_SocMark size={compact ? 27 : 65}/>
  </span>;
}

function BrandLockup({ compact = false }: { compact?: boolean }) {
  return <div className={`ss-brand ${compact ? 'ss-brand--compact' : ''}`}>
    <CrystalMark compact={compact}/>
    <div><strong>CYBER_SOC</strong><small>DETECTAR · ANALIZAR · PROTEGER</small></div>
  </div>;
}

function CyberButton({ children, onClick, primary = false, className = '', disabled = false }: {
  children: ReactNode;
  onClick?: () => void;
  primary?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  return <button type="button" className={`ss-button ${primary ? 'ss-button--primary' : ''} ${className}`} onClick={onClick} disabled={disabled}>{children}</button>;
}

function TopBar({ offline = false }: { offline?: boolean }) {
  return <header className="ss-topbar">
    <label className="ss-search"><Search/><input aria-label="Buscar" placeholder="Buscar indicadores, activos, incidentes..."/><kbd>⌘ K</kbd></label>
    <div className="ss-top-actions">
      <button type="button" aria-label="Cambiar tema"><Moon/></button>
      <button type="button" className="ss-notification" aria-label="Notificaciones"><Bell/><i/></button>
      <span className="ss-top-divider"/>
      <button type="button" className="ss-ops-selector">
        <i className={offline ? 'is-offline' : ''}/>
        <span><b>Centro de Operaciones</b><small>{offline ? 'Sin conexión' : 'En tiempo real'}</small></span>
        <span aria-hidden>⌄</span>
      </button>
      <button type="button" className="ss-avatar" aria-label="Perfil CS">CS</button>
    </div>
  </header>;
}

function Sidebar() {
  return <aside className="ss-sidebar">
    <BrandLockup/>
    <nav aria-label="Navegación principal">
      {navigation.map(({ label, Icon, badge }) => <button type="button" className={label === 'Dashboard' ? 'active' : ''} key={label}>
        <Icon/><span>{label}</span>{badge ? <b>{badge}</b> : null}
      </button>)}
      <hr/>
      {utilityNavigation.map(({ label, Icon }) => <button type="button" key={label}><Icon/><span>{label}</span></button>)}
    </nav>
    <div className="ss-soc-online"><i/><span><b>SOC Online</b><small>Todos los sistemas operativos</small></span></div>
    <img className="ss-sidebar-crystal" src={crystalCluster} alt="" aria-hidden="true" />
    <div className="ss-sidebar-motto">UN MUNDO<br/>MÁS SEGURO<br/>ES POSIBLE</div>
    <small className="ss-version">CYBER_SOC v1.0.0</small>
  </aside>;
}

function CyberAIOrb() {
  return <CyberAI/>;
}

function SpecialChrome({ children, offline = false }: { children: ReactNode; offline?: boolean }) {
  return <div className="ss-shell">
    <AmbientField/>
    <div className="ss-exact-background"><ExactBackground/></div>
    <Sidebar/>
    <TopBar offline={offline}/>
    <div className="ss-ambient" aria-hidden="true"/>
    <div className="ss-quote">“La mejor defensa es una operación más inteligente.”<small>— CYBER_SOC</small></div>
    <main className="ss-shell-main">{children}</main>
    <CyberAIOrb/>
  </div>;
}

export function InitialBootScreenV2({ progress = 68, onSkip, onComplete }: InitialBootScreenV2Props) {
  const location = useLocation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const completionFrameRef = useRef<number | null>(null);
  const finalizedRef = useRef(false);
  const visualTest = isVisualTestSearch(location.search);
  const [displayProgress, setDisplayProgress] = useState(() => clampProgress(visualTest ? progress : 0));

  const completeBoot = useCallback(() => {
    if (visualTest || finalizedRef.current) return;
    finalizedRef.current = true;
    setDisplayProgress(100);
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    completionFrameRef.current = window.requestAnimationFrame(() => onComplete?.());
  }, [onComplete, visualTest]);

  useEffect(() => {
    if (visualTest) {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      setDisplayProgress(clampProgress(progress));
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    let isActive = true;

    const syncProgress = () => {
      if (!isActive) return;
      const duration = video.duration;
      if (Number.isFinite(duration) && duration > 0) {
        setDisplayProgress(clampProgress((video.currentTime / duration) * 100));
      }
      if (isActive && !video.paused && !video.ended) rafRef.current = window.requestAnimationFrame(syncProgress);
      else rafRef.current = null;
    };
    const startTracking = () => {
      if (isActive && rafRef.current === null) rafRef.current = window.requestAnimationFrame(syncProgress);
    };
    const handleMetadata = () => startTracking();
    const handlePlay = () => startTracking();

    finalizedRef.current = false;
    setDisplayProgress(0);
    video.currentTime = 0;
    video.addEventListener('loadedmetadata', handleMetadata);
    video.addEventListener('durationchange', handleMetadata);
    video.addEventListener('play', handlePlay);
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) startTracking();
    video.play().catch(error => console.warn('Boot video playback failed.', error));

    return () => {
      isActive = false;
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (completionFrameRef.current !== null) {
        window.cancelAnimationFrame(completionFrameRef.current);
        completionFrameRef.current = null;
      }
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('durationchange', handleMetadata);
      video.removeEventListener('play', handlePlay);
      video.pause();
      finalizedRef.current = false;
    };
  }, [progress, visualTest]);

  const safeProgress = clampProgress(displayProgress);
  const labels = ['Verificando entorno', 'Cargando módulos\nde monitoreo', 'Conectando fuentes\nde datos', 'Inicializando\ninteligencia'];
  const activePrimaryIndex = getActiveThresholdIndex(safeProgress, primaryThresholds);
  const activeLowerIndex = getActiveThresholdIndex(safeProgress, lowerThresholds);

  return <section className="ss-boot-screen" aria-label="Inicializando CYBER_SOC">
    <video ref={videoRef} className="ss-boot-video" autoPlay={!visualTest} muted playsInline preload="auto" aria-hidden="true" onEnded={completeBoot} src="/media/cybersoc-boot-ambient.mp4" />
    <span className="ss-boot-status">Inicializando CYBER_SOC</span>
    <div className="ss-boot-center ss-boot-dynamic">
      <div className="ss-boot-progress-row">
        <div className="ss-boot-progress"><i style={{ width: `${safeProgress}%` }}/></div><strong>{Math.round(safeProgress)}%</strong>
      </div>
      <div className="ss-boot-checkpoints">
        {labels.map((label, index) => <span className={safeProgress >= lowerThresholds[index] ? 'active' : ''} key={label}><i/>{label.split('\n').map(part => <b key={part}>{part}</b>)}</span>)}
      </div>
    </div>
    <div className="ss-boot-rail">
      {['INICIALIZANDO', 'MÓDULOS', 'DATOS', 'INTELIGENCIA', 'LISTO'].map((label, index) => <span className={safeProgress >= primaryThresholds[index] ? 'active' : ''} key={label}><i/>{label}</span>)}
    </div>
    {onSkip ? <button type="button" className="ss-boot-skip" aria-label="Omitir intro" onClick={onSkip}/>: null}
  </section>;
}

function SpeederCore() {
  return <div className="ss-speeder ss-exact-speeder" aria-hidden="true">
    <DDoSInterceptor className="ss-interceptor" />
  </div>;
}

function MitigationMetric({ icon: IconComponent, label, value, note, positive = true }: {
  icon: Icon;
  label: string;
  value: string;
  note?: string;
  positive?: boolean;
}) {
  return <article className="ss-metric-panel">
    <div><IconComponent/></div><span><small>{label}</small><strong>{value}</strong>{note ? <em className={positive ? '' : 'muted'}>{note}</em> : null}</span>
  </article>;
}

export function DDoSMitigationScreenV2({ progress, paused = false, onPause, onCancel }: DDoSMitigationScreenV2Props) {
  const safeProgress = clampProgress(progress);
  const activeStage = safeProgress >= 100 ? 4 : Math.min(4, Math.floor(safeProgress / 30));
  return <SpecialChrome>
    <div className="ss-mitigation-page" data-paused={paused}>
      <a className="ss-back-link" href="#/dashboard"><ArrowLeft/> Volver al dashboard</a>
      <h1>Mitigando ataque <span>DDoS</span></h1>
      <p className="ss-mitigation-subtitle">Respuesta automática en ejecución. Limpiando tráfico malicioso en tiempo real.</p>
      <div className="ss-incident-pills">
        <span><Shield/>Incidente #{mitigationFixture.incidentId}</span><span className="danger"><TriangleAlert/>Ataque DDoS</span><span><Globe2/>203.0.113.0/24</span><span><Clock3/>Iniciado hace 3 min</span>
      </div>
      <section className="ss-mitigation-focus">
        <div className="ss-speeder-stage"><div className="ss-speeder-rings"/><SpeederCore/></div>
        <div className="ss-mitigation-progress">
          <strong>{Math.round(safeProgress)}<span>%</span></strong>
          <div className="ss-progress-track"><i style={{ width: `${safeProgress}%` }}/></div>
          <p>Filtrando y bloqueando tráfico malicioso...</p>
          <ol>{mitigationStages.map(([label, meta], index) => {
            const state = index < activeStage ? 'done' : index === activeStage ? 'active' : '';
            return <li className={state} key={label}><i>{state === 'done' ? <Check/> : null}</i><span>{label}</span><b>{meta}</b></li>;
          })}</ol>
        </div>
      </section>
      <div className="ss-mitigation-metrics">
        <MitigationMetric icon={Network} label="Tráfico malicioso bloqueado" value={`${(safeProgress * .159).toFixed(1)} Gbps`} note="↗ 98%"/>
        <MitigationMetric icon={UsersRound} label="Solicitudes bloqueadas" value={`${(safeProgress * .624).toFixed(1)} M`} note="↗ 97%"/>
        <MitigationMetric icon={Server} label="Servicios protegidos" value={String(Math.max(1, Math.round(safeProgress * .154)))} note="●  En línea"/>
        <MitigationMetric icon={Clock3} label="Tiempo transcurrido" value="03:12" note="↗ 76%  vs. pico"/>
      </div>
      <div className="ss-mitigation-footer">
        <Info/><span><b>Las acciones manuales están deshabilitadas mientras se ejecuta la mitigación.</b><small>Una vez completado el proceso, podrás realizar nuevas acciones sobre el incidente.</small></span>
        <CyberButton primary onClick={onPause} disabled={!onPause}><CirclePause/>{paused ? 'Reanudar mitigación' : 'Pausar mitigación'}</CyberButton>
        <CyberButton onClick={onCancel} disabled={!onCancel}><Square/>Cancelar proceso</CyberButton>
      </div>
      <aside className="ss-live-column">
        <section className="ss-live-log ss-faceted-panel">
          <header><CrystalMark compact/><b>Registro en tiempo real</b><span><i/>En vivo</span></header>
          <div className="ss-log-lines">{securityLogs.map(([time, level, message]) => <div className={time === '18:24:18' && message.startsWith('Filtrando') ? 'active' : ''} key={`${time}-${message}`}><time>{time}</time><b className={level === '[WARN]' ? 'warn' : ''}>{level}</b><span>{message.split('\n').map(part => <i key={part}>{part}</i>)}</span></div>)}</div>
        </section>
        <section className="ss-traffic-panel ss-faceted-panel">
          <header><Network/><b>Tráfico entrante <small>(Últimos 5 min)</small></b><span><i className="bad"/>Malicioso <i/>Legítimo</span></header>
          <div className="ss-traffic-chart">
            <div className="ss-y-axis"><span>14 Gbps</span><span>7 Gbps</span><span>0</span></div>
            <div className="ss-bars">{trafficBars.map((height, index) => <i key={index} style={{ height: `${height}px` }}><b style={{ height: `${Math.max(3, 132 - height)}px` }}/></i>)}</div>
            <div className="ss-chart-marker first"><span>Mitigación<br/>iniciada</span></div><div className="ss-chart-marker second"><span>Tráfico bajo<br/>control</span></div>
          </div>
        </section>
      </aside>
    </div>
  </SpecialChrome>;
}

function OfflineCube() {
  return <div className="ss-offline-loader ss-exact-offline"><ServerStatusCube/></div>;
}

export function ServerUnavailableV2({ onRetry, onBack }: ServerUnavailableV2Props) {
  return <SpecialChrome offline>
    <section className="ss-offline-page">
      <div className="ss-offline-kicker">CENTRO DE OPERACIONES<br/>FUERA DE LÍNEA</div>
      <div className="ss-offline-right-motto">DETECTAR<br/>ANALIZAR<br/>PROTEGER<br/>SIEMPRE</div>
      <OfflineCube/>
      <div className="ss-offline-copy">
        <h1>Servidor <span>{offlineFixture.title.replace('Servidor ', '')}</span></h1>
        <h2>{offlineFixture.subtitle}</h2>
        <p>El servicio de CYBER_SOC está temporalmente fuera de línea. Verifica tu conexión<br/>o inténtalo de nuevo en unos momentos.</p>
        <div><CyberButton primary onClick={onRetry}><RefreshCw/>Reintentar</CyberButton><CyberButton onClick={onBack}><ArrowLeft/>Volver al panel</CyberButton></div>
      </div>
      <div className="ss-offline-cards">
        <article className="ss-faceted-panel"><div className="danger"><Database/></div><span><small>Estado del servicio</small><strong>Sin conexión</strong><p>No se puede alcanzar el centro de operaciones.</p></span></article>
        <article className="ss-faceted-panel"><div><Clock3/></div><span><small>Último intento</small><strong>{offlineFixture.lastAttempt}</strong><p>Hace unos segundos</p></span></article>
        <article className="ss-faceted-panel"><div className="danger"><WifiOff/></div><span><small>Causa probable</small><strong>{offlineFixture.probableCause}</strong><p>Verifica tu red o contacta al equipo de TI.</p></span></article>
      </div>
      <footer><i/>RESILIENCIA HOY. OPERACIONES MÁS FUERTES MAÑANA.<i/></footer>
    </section>
  </SpecialChrome>;
}
