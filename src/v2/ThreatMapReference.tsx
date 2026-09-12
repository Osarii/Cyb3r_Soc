import { Activity, Crosshair, Globe2, Shield, TriangleAlert, Zap } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { ThreatMap } from '../components/map/ThreatMap';
import ExactAttackSwitch from '../components/referenceExact/ExactAttackSwitch';
import { useSOCStore } from '../app/store/useSOCStore';
import { CyberAssistant } from './DashboardReference';
import { Link } from 'react-router-dom';
import { threatMapFixture } from '../data/fixtures/threatMap.fixture';
import './threat-map-reference.css';
import radarDecoration from '../assets/decorations/radar-static.webp';
import shieldDecoration from '../assets/decorations/security-shield-static.webp';

const events = [
  ['10:24:12','DDoS','185.199.110.23','203.0.113.10','Tráfico anómalo','En curso'],
  ['10:23:45','Escaneo','45.67.231.12','192.168.1.5','Escaneo de puertos','Detectado'],
  ['10:22:31','Explotación','103.21.244.9','10.0.0.23','CVE-2023-3519','Bloqueado'],
  ['10:21:18','Fuerza bruta','91.198.45.77','172.16.0.8','Múltiples intentos','En curso'],
  ['10:20:03','Exfiltración','203.0.113.66','10.0.5.12','Transferencia de datos','Detectado'],
];
const origins = [['🇨🇳','China','124','1,024','28%'],['🇷🇺','Rusia','87','643','18%'],['🇺🇸','Estados Unidos','66','521','14%'],['🇧🇷','Brasil','42','318','9%'],['🇩🇪','Alemania','38','287','8%']];
const chart = [{name:'DDoS',value:34,color:'#ff3f6c'},{name:'Fuerza bruta',value:18,color:'#d52ee9'},{name:'Explotación',value:16,color:'#7135eb'},{name:'Escaneo',value:12,color:'#8b5cf6'},{name:'Exfiltración',value:11,color:'#b09aea'},{name:'Otros',value:9,color:'#716680'}];

export function ThreatMapReferenceContent({ visualTest = false }: { visualTest?: boolean }) {
  const attacks = useSOCStore(s => s.attacks);
  const addAttack = useSOCStore(s => s.addAttack);
  const setAttackStatus = useSOCStore(s => s.setAttackStatus);
  const activeAttack = attacks.at(-1);
  return <div className="ref-map-page">
    <header className="ref-map-title">
      <div><small>◉ &nbsp;OPERACIONES</small><h1>Mapa de amenazas en tiempo real</h1><p>Visualiza ataques, simula escenarios y fortalece tu defensa.</p></div>
      <div className="period-tabs"><button className="active">Últimas 24 horas</button><button>Últimos 7 días</button><button>Últimos 30 días</button><button>Todas las amenazas⌄</button></div>
    </header>
    <div className="ref-map-kpis">
      <MapKpi icon={<Shield/>} label="Ataques en curso" value={visualTest ? threatMapFixture.metrics[0] : String(247+attacks.length)} delta="↗ +12%" danger/>
      <MapKpi icon={<Globe2/>} label="Orígenes activos" value="36" delta="↗ +20%" danger/>
      <MapKpi icon={<Crosshair/>} label="Destinos afectados" value="52" delta="↗ +8%" danger/>
      <MapKpi icon={<Activity/>} label="Tráfico de ataque (Gbps)" value="18.4" delta="↘ -15%"/>
      <MapKpi icon={<TriangleAlert/>} label="Nivel de riesgo global" value="Alto" delta="▮▮▮▮▮▯▯▯" danger/>
    </div>
    <div className="ref-map-workspace">
      <section className="ref-panel ref-map-stage">
        <div className="ref-panel-head"><div className="mini-star">✦</div><div><b>Mapa de amenazas en tiempo real</b><small>Ataques y actividad global detectada por Cyb3r_Soc</small></div><div className="map-filters"><button>Últimas 24 horas⌄</button><button>Todas las amenazas⌄</button></div></div>
        <div className="world-stage"><ThreatMap/><img className="map-radar-decoration" src={radarDecoration} alt="" aria-hidden="true"/><div className="place-label sf">San Francisco, US<small>Origen de ataque</small></div><div className="place-label london">Londres, UK<small>Destino</small></div><div className="place-label moscow">Moscú, RU<small>Origen de ataque</small></div><div className="place-label bogota">Bogotá, CO<small>Origen de ataque</small></div><div className="place-label shanghai">Shanghái, CN<small>Origen de ataque</small></div><div className="place-label sydney">Sidney, AU<small>Destino</small></div><div className="map-controls"><button>＋</button><button>−</button><button>⌾</button></div><div className="type-legend"><b>✹ &nbsp; Tipos de ataque</b>{chart.slice(0,5).map(x=><span key={x.name}><i style={{background:x.color}}/>{x.name}</span>)}</div><div className="view-tabs">Vista: <b>Ataques</b><span>Tráfico</span><span>Riesgo</span></div></div>
      </section>
      <aside className="ref-map-console ref-panel">
        <div className="ref-panel-head"><div className="mini-star">✦</div><div><b>Simulación de ataque</b><small>Prueba la preparación de tu entorno</small></div></div>
        <div className="console-slot"><div className="map-exact-attack"><ExactAttackSwitch onLaunch={() => addAttack('DDoS')}/></div></div>
        <div className="quick-actions"><button disabled={!activeAttack} onClick={() => activeAttack && setAttackStatus(activeAttack.id, 'CONTAINED')}><Crosshair/> <b>Neutralizar</b><small>Contiene el ataque simulado</small></button><Link aria-disabled={!activeAttack} to={activeAttack ? `/incidents/${activeAttack.incidentId}/mitigation` : '/threat-map'} onClick={() => activeAttack && setAttackStatus(activeAttack.id, 'CONTAINED')}><Zap/><b>Limpieza</b><small>Elimina rastros del escenario</small></Link><button disabled={!activeAttack} onClick={() => activeAttack && setAttackStatus(activeAttack.id, 'CONTAINED')}><Shield/><b>Modo aislado</b><small>Aísla sistemas en prueba</small></button></div>
        <div className="scenario-info"><b>Escenario de simulación</b><button>DDoS a infraestructura crítica⌄</button><dl><div><dt>Objetivo</dt><dd>Servidores web (DMZ)</dd></div><div><dt>Intensidad</dt><dd>Alta</dd></div><div><dt>Duración</dt><dd>10 minutos</dd></div><div><dt>Vectores</dt><dd>Múltiples (L3/L7)</dd></div></dl></div>
      </aside>
    </div>
    <div className="ref-map-bottom">
      <MiniTable title="Actividad en tiempo real" rows={events}/>
      <section className="ref-panel origin-table"><div className="small-head"><b>Top orígenes de ataque</b><span>Ver todos ›</span></div>{origins.map(r=><div className="origin-row" key={r[1]}><span>{r[0]} {r[1]}</span><span>{r[2]}</span><span>{r[3]}</span><span>{r[4]} <i/></span></div>)}</section>
      <section className="ref-panel type-chart"><div className="small-head"><b>Tipos de ataque</b><span>Últimas 24 horas⌄</span></div><div className="donut"><ResponsiveContainer><PieChart><Pie isAnimationActive={false} data={chart} dataKey="value" innerRadius={43} outerRadius={66} paddingAngle={0}>{chart.map(x=><Cell key={x.name} fill={x.color}/>)}</Pie></PieChart></ResponsiveContainer><strong>2,843<small>Total</small></strong></div><div className="donut-legend">{chart.map(x=><span key={x.name}><i style={{background:x.color}}/>{x.name}<b>{x.value}%</b></span>)}</div></section>
    </div>
    <footer className="safe-footer"><i/> Simulación controlada <span/> Entorno de pruebas <span/> Sin impacto en producción</footer><CyberAssistant/>
  </div>;
}

function MapKpi({icon,label,value,delta,danger}:{icon:React.ReactNode;label:string;value:string;delta:string;danger?:boolean}){return <div className="map-kpi ref-panel"><div>{icon}</div><span><small>{label}</small><b>{value}</b></span><em className={danger?'red':''}>{delta}</em></div>}

function MiniTable({title,rows}:{title:string;rows:string[][]}){return <section className="ref-panel activity-table"><div className="small-head"><b>{title}</b><span>Ver todas ›</span></div><div className="mini-th"><span>HORA</span><span>TIPO</span><span>ORIGEN</span><span>DESTINO</span><span>DETALLE</span><span>ESTADO</span></div>{rows.map((r,i)=><div className="mini-tr" key={r[0]}>{r.map((c,j)=><span key={j} className={j===1?'event-type':''}>{j===0&&<i className={i%2?'purple':'red'}/>} {c}</span>)}</div>)}</section>}


