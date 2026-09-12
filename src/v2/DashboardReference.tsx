import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Bell,
  Box,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  Clock3,
  Crosshair,
  FileText,
  Gauge,
  Globe2,
  LocateFixed,
  Map,
  Menu,
  MessageSquareWarning,
  Minus,
  Monitor,
  Moon,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Workflow,
  X,
} from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Line,
  Marker,
  Sphere,
} from 'react-simple-maps';
import geography from 'world-atlas/countries-110m.json';
import ExactAttackSwitch from '../components/referenceExact/ExactAttackSwitch';
import ExactBackground from '../components/referenceExact/ExactBackground';
import { Cyb3r_SocMark } from '../components/brand/Cyb3r_SocLogo';
import { AmbientField } from '../components/brand/AmbientField';
import { CyberAI } from '../components/ai/CyberAI';
import crystalCluster from '../assets/decorations/crystal-cluster-static.webp';
import { dashboardFixture } from '../data/fixtures/dashboard.fixture';
import { useSOCStore } from '../app/store/useSOCStore';
import './reference-dashboard.css';

type SystemState = 'online' | 'offline';

type ReferenceShellProps = {
  children: ReactNode;
  activePath?: string;
  status?: SystemState;
};

type ReferenceSidebarProps = {
  activePath?: string;
  open?: boolean;
  onClose?: () => void;
  status?: SystemState;
};

type ReferenceTopbarProps = {
  onMenu?: () => void;
  status?: SystemState;
};

const primaryNavigation = [
  { href: '/dashboard', label: 'Dashboard', icon: Gauge },
  { href: '/threat-map', label: 'Mapa de amenazas', icon: Map },
  { href: '/incidents', label: 'Incidentes', icon: MessageSquareWarning, badge: '12' },
  { href: '/intelligence', label: 'Inteligencia', icon: BrainCircuit },
  { href: '/assets', label: 'Activos', icon: Box },
  { href: '/simulations', label: 'Simulaciones', icon: Crosshair },
  { href: '/analytics', label: 'Analítica', icon: BarChart3 },
  { href: '/reports', label: 'Reportes', icon: FileText },
] as const;

const secondaryNavigation = [
  { href: '/automation', label: 'Automatización', icon: Workflow },
  { href: '/settings', label: 'Configuración', icon: Settings },
] as const;

const incidentRows = [
  { severity: 'Crítica', tone: 'critical', time: '10:24', title: 'Intento de exfiltración de datos', origin: '185.199.110.23', asset: 'DB-PROD-01', status: 'En análisis', state: 'review' },
  { severity: 'Alta', tone: 'high', time: '09:58', title: 'Movimiento lateral detectado', origin: '103.24.56.188', asset: 'SRV-APP-03', status: 'Contenida', state: 'contained' },
  { severity: 'Media', tone: 'medium', time: '09:12', title: 'Escaneo de puertos', origin: '45.77.12.91', asset: 'FW-EDGE-01', status: 'Resuelta', state: 'resolved' },
  { severity: 'Alta', tone: 'high', time: '08:47', title: 'Malware detectado (C2)', origin: '198.51.100.42', asset: 'WS-USER-109', status: 'En análisis', state: 'review' },
  { severity: 'Media', tone: 'medium', time: '07:21', title: 'Intento de acceso fallido', origin: '203.0.113.76', asset: 'VPN-GW-01', status: 'Resuelta', state: 'resolved' },
] as const;

const intelligenceItems = [
  { tone: 'red', title: 'Nuevo malware en campaña', detail: 'LunacyC2 detectado en múltiples regiones', time: '10:24' },
  { tone: 'red', title: 'Actividad inusual desde Rusia', detail: 'Aumento del 300% en escaneos de puertos', time: '09:47' },
  { tone: 'orange', title: 'Vulnerabilidad crítica en VPN', detail: 'CVE-2024-3400 · Explotación activa', time: '08:12' },
  { tone: 'purple', title: 'Phishing dirigido a sector financiero', detail: 'Campaña detectada en LATAM', time: '07:56' },
  { tone: 'purple', title: 'Nuevo IOC en circulación', detail: 'Hash asociado a ransomware', time: '06:31' },
] as const;

const mapLocations = [
  { id: 'san-francisco', coordinates: [-122.42, 37.77] as [number, number], label: 'San Francisco, US', role: 'Origen de ataque', tone: 'danger', labelX: -122, labelY: -13 },
  { id: 'berlin', coordinates: [13.4, 52.52] as [number, number], label: 'Berlin, DE', role: 'Destino', tone: 'purple', labelX: 10, labelY: -20 },
  { id: 'shanghai', coordinates: [121.47, 31.23] as [number, number], label: 'Shanghái, CN', role: 'Origen de ataque', tone: 'danger', labelX: 13, labelY: 0 },
  { id: 'sao-paulo', coordinates: [-46.63, -23.55] as [number, number], label: 'São Paulo, BR', role: 'Destino', tone: 'purple', labelX: 13, labelY: 7 },
] as const;

const attackRoutes: Array<{ from: [number, number]; to: [number, number]; tone: 'danger' | 'purple'; delay: number }> = [
  { from: [-122.42, 37.77], to: [13.4, 52.52], tone: 'danger', delay: 0 },
  { from: [-122.42, 37.77], to: [-46.63, -23.55], tone: 'danger', delay: 0.45 },
  { from: [-122.42, 37.77], to: [37.61, 19.8], tone: 'danger', delay: 0.8 },
  { from: [121.47, 31.23], to: [13.4, 52.52], tone: 'purple', delay: 0.2 },
  { from: [121.47, 31.23], to: [-46.63, -23.55], tone: 'purple', delay: 1.1 },
  { from: [82.9, 21.1], to: [-46.63, -23.55], tone: 'danger', delay: 1.5 },
];

export function ReferenceBrandMark({ size = 52 }: { size?: number }) {
  return (
    <span className="rd-exact-brand" style={{ '--mark-size': `${size}px` } as CSSProperties} aria-hidden="true">
      <Cyb3r_SocMark size={size} />
    </span>
  );
}

export function ReferenceSidebar({
  activePath = '/dashboard',
  open = false,
  onClose,
  status = 'online',
}: ReferenceSidebarProps) {
  const isActive = (href: string) => activePath === href || (href !== '/dashboard' && activePath.startsWith(`${href}/`));

  return (
    <aside className={`reference-sidebar ${open ? 'is-open' : ''}`} aria-label="Navegación principal">
      <button className="rd-sidebar-close" type="button" onClick={onClose} aria-label="Cerrar navegación">
        <X size={20} />
      </button>

      <Link className="rd-brand" to="/dashboard" onClick={onClose} aria-label="Cyb3r_Soc, ir al dashboard">
        <ReferenceBrandMark size={57} />
        <span className="rd-brand-copy">
          <strong>Cyb3r_<span>Soc</span></strong>
          <small>DETECTAR · ANALIZAR · PROTEGER</small>
        </span>
      </Link>

      <nav className="rd-nav rd-nav-primary">
        {primaryNavigation.map(({ href, label, icon: Icon, ...item }) => (
          <Link
            className={isActive(href) ? 'is-active' : ''}
            to={href}
            key={href}
            onClick={onClose}
            aria-current={isActive(href) ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={1.75} />
            <span>{label}</span>
            {'badge' in item && item.badge ? <em>{item.badge}</em> : null}
          </Link>
        ))}
      </nav>

      <div className="rd-nav-divider" />

      <nav className="rd-nav rd-nav-secondary">
        {secondaryNavigation.map(({ href, label, icon: Icon }) => (
          <Link
            className={isActive(href) ? 'is-active' : ''}
            to={href}
            key={href}
            onClick={onClose}
            aria-current={isActive(href) ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={1.75} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="rd-sidebar-spacer" />

      <div className={`rd-soc-status ${status === 'offline' ? 'is-offline' : ''}`}>
        <i />
        <span>
          <strong>{status === 'online' ? 'SOC Online' : 'Cyb3r_Soc Offline'}</strong>
          <small>{status === 'online' ? 'Todos los sistemas operativos' : 'No hay conexión con el servidor'}</small>
        </span>
      </div>

      <img className="rd-sidebar-crystal" src={crystalCluster} alt="" aria-hidden="true" />
      <p className="rd-sidebar-motto">UN MUNDO<br />MÁS SEGURO<br />ES POSIBLE</p>
      <small className="rd-version">Cyb3r_Soc v1.0.0</small>
    </aside>
  );
}

export function ReferenceTopbar({ onMenu, status = 'online' }: ReferenceTopbarProps) {
  return (
    <header className="reference-topbar">
      <button className="rd-mobile-menu" type="button" onClick={onMenu} aria-label="Abrir navegación">
        <Menu size={21} />
      </button>

      <label className="rd-global-search">
        <Search size={18} strokeWidth={1.8} />
        <input aria-label="Búsqueda global" placeholder="Buscar indicadores, activos, incidentes..." />
        <kbd>⌘ K</kbd>
      </label>

      <div className="rd-top-actions">
        <button type="button" aria-label="Cambiar tema"><Moon size={19} strokeWidth={1.8} /></button>
        <button className="rd-notification" type="button" aria-label="Notificaciones">
          <Bell size={19} strokeWidth={1.8} />
          <i />
        </button>
        <span className="rd-top-divider" />
        <button className="rd-operations-state" type="button">
          <i className={status === 'offline' ? 'is-offline' : ''} />
          <span>
            <strong>Centro de Operaciones</strong>
            <small>{status === 'online' ? 'En tiempo real' : 'Sin conexión'}</small>
          </span>
          <ChevronDown size={15} />
        </button>
        <span className="rd-user-avatar">CS</span>
      </div>
    </header>
  );
}

export function ReferenceShell({ children, activePath = '/dashboard', status = 'online' }: ReferenceShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="reference-shell">
      <div className="rd-space-background" aria-hidden="true">
        <AmbientField/>
        <div className="rd-exact-background"><ExactBackground /></div>
        <i className="rd-bg-poly rd-bg-poly-one" />
        <i className="rd-bg-poly rd-bg-poly-two" />
      </div>
      <ReferenceSidebar
        activePath={activePath}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        status={status}
      />
      {sidebarOpen ? <button className="rd-sidebar-scrim" type="button" onClick={() => setSidebarOpen(false)} aria-label="Cerrar navegación" /> : null}
      <ReferenceTopbar onMenu={() => setSidebarOpen(true)} status={status} />
      <div className="reference-main">{children}</div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  delta,
  direction = 'up',
  chart,
  tone = 'purple',
}: {
  icon: ReactNode;
  label: string;
  value: string;
  delta: string;
  direction?: 'up' | 'down';
  chart: number[];
  tone?: 'purple' | 'red' | 'green';
}) {
  const points = chart.map((point, index) => `${index * (92 / (chart.length - 1))},${42 - point}`).join(' ');
  return (
    <section className={`rd-stat rd-panel rd-tone-${tone}`}>
      <span className="rd-stat-icon">{icon}</span>
      <span className="rd-stat-copy">
        <small>{label}</small>
        <span>
          <strong>{value}</strong>
          <em className={direction === 'down' ? 'is-down' : ''}>{direction === 'down' ? '↓' : '↗'} {delta}</em>
        </span>
      </span>
      <svg className="rd-sparkline" viewBox="0 0 94 44" role="img" aria-label={`Tendencia de ${label}`}>
        <defs>
          <linearGradient id={`rd-${tone}-spark`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity=".27" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,44 ${points} 92,44`} fill={`url(#rd-${tone}-spark)`} />
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </section>
  );
}

function ThreatMapPanel() {
  return (
    <section className="rd-map-panel rd-panel">
      <header className="rd-section-header rd-map-header">
        <span className="rd-section-symbol"><Crosshair size={18} /></span>
        <span className="rd-section-title">
          <strong>Mapa de amenazas en tiempo real</strong>
          <small>Ataques y actividad global detectada por Cyb3r_Soc</small>
        </span>
        <div className="rd-map-filters">
          <button type="button">Últimas 24 horas <ChevronDown size={13} /></button>
          <button type="button">Todas las amenazas <ChevronDown size={13} /></button>
        </div>
      </header>

      <div className="rd-map-canvas">
        <ComposableMap
          width={960}
          height={382}
          projection="geoNaturalEarth1"
          projectionConfig={{ center: [0, 12], scale: 174 }}
          aria-label="Mapa mundial con rutas de ataques activos"
        >
          <defs><pattern id="dashboard-land" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#29183d"/><circle cx="1" cy="2" r=".65" fill="#9155ca" opacity=".6"/><circle cx="5" cy="6" r=".4" fill="#ae81dc" opacity=".55"/></pattern></defs>
          <Sphere id="rd-world-sphere" fill="transparent" stroke="rgba(150,120,205,.1)" strokeWidth={0.45} />
          <Graticule stroke="rgba(135,104,183,.14)" strokeWidth={0.42} />
          <Geographies geography={geography as unknown as string}>
            {({ geographies }) => geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="url(#dashboard-land)"
                stroke="#5b3d7b"
                strokeWidth={0.32}
              />
            ))}
          </Geographies>

          {attackRoutes.map((route, index) => (
            <Line
              key={`${route.from.join('-')}-${route.to.join('-')}`}
              from={route.from}
              to={route.to}
              className={`rd-route rd-route-${route.tone}`}
              stroke={route.tone === 'danger' ? '#ff3d66' : '#9c55ff'}
              strokeWidth={1.35}
              strokeLinecap="round"
              style={{ animationDelay: `${-route.delay}s` }}
            />
          ))}

          {mapLocations.map((location) => (
            <Marker coordinates={location.coordinates} key={location.id}>
              <g className={`rd-map-node rd-map-node-${location.tone}`}>
                <circle r="12" className="rd-map-node-halo" />
                <circle r="7" className="rd-map-node-ring" />
                <circle r="3.4" className="rd-map-node-core" />
              </g>
              <g transform={`translate(${location.labelX} ${location.labelY})`} className="rd-map-label">
                <rect x="0" y="-18" width={location.id === 'san-francisco' ? 112 : 89} height="39" rx="4" />
                <text x="9" y="-3">{location.label}</text>
                <text className={location.tone === 'danger' ? 'is-danger' : ''} x="9" y="12">{location.role}</text>
              </g>
            </Marker>
          ))}
        </ComposableMap>

        <div className="rd-map-legend">
          <strong><Crosshair size={12} /> Ataque en curso</strong>
          <span><i className="is-danger" /> Ataque en curso</span>
          <span><i /> Tráfico sospechoso</span>
          <span><i className="is-soft" /> Destino</span>
          <span><i className="is-danger" /> Origen</span>
          <span><b /> Ruta de ataque</span>
        </div>

        <div className="rd-map-controls" aria-label="Controles de mapa">
          <button type="button" aria-label="Acercar"><Plus size={18} /></button>
          <button type="button" aria-label="Alejar"><Minus size={18} /></button>
          <button type="button" aria-label="Centrar mapa"><LocateFixed size={17} /></button>
        </div>
      </div>
    </section>
  );
}

function AttackSimulationCard() {
  const addAttack = useSOCStore(state => state.addAttack);
  return (
    <section className="rd-attack-card rd-panel">
      <header className="rd-section-header">
        <span className="rd-section-symbol"><Crosshair size={18} /></span>
        <span className="rd-section-title">
          <strong>Simulación de ataque</strong>
          <small>Prueba la preparación de tu entorno</small>
        </span>
      </header>

      <div className="rd-exact-attack"><ExactAttackSwitch buttonLabel="Iniciar simulación" onLaunch={() => addAttack('DDoS')} /></div>
    </section>
  );
}

function IntelligenceFeed() {
  return (
    <section className="rd-intel-card rd-panel">
      <header className="rd-section-header rd-compact-header">
        <span className="rd-section-symbol"><Sparkles size={17} /></span>
        <span className="rd-section-title"><strong>Inteligencia de amenazas</strong></span>
        <Link to="/intelligence">Ver todas <ChevronRight size={13} /></Link>
      </header>
      <div className="rd-intel-list">
        {intelligenceItems.map((item) => (
          <article key={item.title}>
            <i className={`rd-feed-dot is-${item.tone}`} />
            <span><strong>{item.title}</strong><small>{item.detail}</small></span>
            <time>{item.time}</time>
          </article>
        ))}
      </div>
    </section>
  );
}

function RecentIncidents() {
  return (
    <section className="rd-incidents rd-panel">
      <header className="rd-section-header rd-compact-header">
        <span className="rd-section-title"><strong>Incidentes recientes</strong></span>
        <Link to="/incidents">Ver todos <ChevronRight size={13} /></Link>
      </header>
      <div className="rd-incident-table" role="table" aria-label="Incidentes recientes">
        <div className="rd-incident-row rd-incident-head" role="row">
          <span>SEVERIDAD</span><span>HORA</span><span>TÍTULO</span><span>ORIGEN</span><span>ACTIVO</span><span>ESTADO</span><span />
        </div>
        {incidentRows.map((incident) => (
          <div className="rd-incident-row" role="row" key={`${incident.time}-${incident.title}`}>
            <span className={`rd-severity is-${incident.tone}`}><i />{incident.severity}</span>
            <time>{incident.time}</time>
            <strong>{incident.title}</strong>
            <code>{incident.origin}</code>
            <code>{incident.asset}</code>
            <span className={`rd-incident-state is-${incident.state}`}>{incident.status}</span>
            <button type="button" aria-label={`Opciones para ${incident.title}`}><MoreHorizontal size={15} /></button>
          </div>
        ))}
      </div>
    </section>
  );
}

function ThreatAnalytics() {
  const bars = [72, 94, 146, 104, 80, 164, 142];
  return (
    <section className="rd-analytics rd-panel">
      <header className="rd-section-header rd-compact-header">
        <span className="rd-section-title"><strong>Analítica de amenazas</strong></span>
        <button type="button">Últimos 7 días <ChevronDown size={13} /></button>
      </header>
      <div className="rd-analytics-body">
        <div className="rd-threat-types">
          <small>Tipos de amenazas</small>
          <div className="rd-donut-row">
            <div className="rd-donut"><span><strong>1,248</strong><small>Total</small></span></div>
            <ul>
              <li><i className="is-one" />Malware <b>32%</b></li>
              <li><i className="is-two" />Phishing <b>24%</b></li>
              <li><i className="is-three" />Intrusión <b>18%</b></li>
              <li><i className="is-four" />Escaneo <b>14%</b></li>
              <li><i className="is-five" />Otros <b>12%</b></li>
            </ul>
          </div>
        </div>
        <div className="rd-trend-chart">
          <small>Tendencia de incidentes</small>
          <div className="rd-chart-grid"><i /><i /><i /><i /></div>
          <div className="rd-bars">
            {bars.map((height, index) => (
              <span key={index}>
                <i style={{ height: `${height * 0.58}px` }} />
                <small>{17 + index}<em>Abr</em></small>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CyberAssistant() {
  return <CyberAI />;
}

export function DashboardReference({ withoutShell = false }: { withoutShell?: boolean }) {
  const [activeThreats, criticalIncidents, monitoredAssets, meanResponse] = dashboardFixture.metrics;
  const content = (
    <main className="reference-dashboard">
      <div className="rd-dashboard-heading">
        <div>
          <span>VISTA GLOBAL</span>
          <h1>Bienvenido a <b>Cyb3r_Soc</b></h1>
          <p>Visibilidad. Contexto. Acción. Un entorno más seguro comienza aquí.</p>
        </div>
        <blockquote>“La mejor defensa es una operación más inteligente.”<small>— Cyb3r_Soc</small></blockquote>
      </div>

      <div className="rd-stats-grid">
        <StatCard icon={<Shield size={29} />} {...activeThreats} chart={[12, 20, 18, 26, 28, 38, 27, 22, 32, 34]} tone="red" />
        <StatCard icon={<TriangleAlert size={29} />} {...criticalIncidents} chart={[11, 15, 14, 20, 18, 23, 22, 27, 31, 35]} tone="red" />
        <StatCard icon={<Monitor size={29} />} {...monitoredAssets} chart={[9, 15, 18, 24, 20, 19, 26, 22, 30, 34]} tone="purple" />
        <StatCard icon={<Clock3 size={29} />} {...meanResponse} direction="down" chart={[7, 20, 31, 23, 16, 13, 22, 30, 34, 33]} tone="green" />
      </div>

      <div className="rd-dashboard-grid">
        <ThreatMapPanel />
        <aside className="rd-dashboard-side">
          <AttackSimulationCard />
          <IntelligenceFeed />
        </aside>
        <div className="rd-dashboard-lower">
          <RecentIncidents />
          <ThreatAnalytics />
        </div>
      </div>
      <CyberAssistant />
    </main>
  );

  return withoutShell ? content : <ReferenceShell activePath="/dashboard">{content}</ReferenceShell>;
}

export default DashboardReference;
