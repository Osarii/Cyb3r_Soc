import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSOCStore } from '../app/store/useSOCStore';
import { CyberBadge, CyberButton, CyberCard, CyberPanel } from '../components/ui';
import { ThreatMap } from '../components/map/ThreatMap';
import { CardHead, Page, Severity } from './Dashboard';
import '../v2/incidents-v1.css';

const severityFilters = ['All', 'Critical', 'High', 'Medium', 'Low'] as const;

export function Incidents() {
  const incidents = useSOCStore((state) => state.incidents);
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState<(typeof severityFilters)[number]>('All');

  const filteredIncidents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return incidents.filter((incident) => {
      const matchesSeverity = severity === 'All' || incident.severity === severity;
      const matchesQuery = !normalizedQuery || [
        incident.id,
        incident.title,
        incident.attackType,
        incident.source,
        incident.target,
        incident.asset,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesSeverity && matchesQuery;
    });
  }, [incidents, query, severity]);

  const activeCount = incidents.filter((incident) => incident.status === 'Active').length;
  const criticalCount = incidents.filter((incident) => incident.severity === 'Critical').length;

  return (
    <main className="incidents-v1">
      <header className="incidents-v1__header">
        <div>
          <span className="incidents-v1__eyebrow">OPERACIONES / INCIDENTES</span>
          <h1>Gestión de incidentes</h1>
          <p>Prioriza, investiga y da seguimiento a los eventos detectados por el SOC.</p>
        </div>
        <div className="incidents-v1__summary" aria-label="Resumen de incidentes">
          <span><b>{incidents.length}</b> REGISTRADOS</span>
          <span><b>{activeCount}</b> ACTIVOS</span>
          <span className={criticalCount ? 'is-critical' : ''}><b>{criticalCount}</b> CRÍTICOS</span>
        </div>
      </header>

      <section className="incidents-v1__panel" aria-labelledby="incident-queue-title">
        <div className="incidents-v1__panel-head">
          <div>
            <i aria-hidden="true" />
            <div>
              <h2 id="incident-queue-title">Cola de incidentes</h2>
              <p>Se actualiza con las simulaciones y acciones del mapa de amenazas.</p>
            </div>
          </div>
          <strong>{filteredIncidents.length} RESULTADOS</strong>
        </div>

        <div className="incidents-v1__filters">
          <label>
            <span>Buscar</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ID, vector, IP, activo…"
              type="search"
            />
          </label>
          <label>
            <span>Severidad</span>
            <select value={severity} onChange={(event) => setSeverity(event.target.value as typeof severity)}>
              {severityFilters.map((value) => <option key={value}>{value}</option>)}
            </select>
          </label>
        </div>

        <div className="incidents-v1__table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Severidad</th>
                <th>Incidente</th>
                <th>Origen → destino</th>
                <th>Activo</th>
                <th>Estado</th>
                <th>Detectado</th>
                <th><span className="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map((incident) => (
                <tr key={incident.id}>
                  <td className="incidents-v1__mono">{incident.id}</td>
                  <td><Severity value={incident.severity} /></td>
                  <td><b>{incident.title}</b><small>{incident.attackType}</small></td>
                  <td className="incidents-v1__route"><span>{incident.source}</span><small>→</small><span>{incident.target}</span></td>
                  <td className="incidents-v1__mono">{incident.asset}</td>
                  <td><CyberBadge className={`incidents-v1__status incidents-v1__status--${incident.status.toLowerCase()}`}>{incident.status}</CyberBadge></td>
                  <td className="incidents-v1__mono">{incident.detectedAt}</td>
                  <td><Link to={`/incidents/${incident.id}`}>ANALIZAR <span aria-hidden="true">→</span></Link></td>
                </tr>
              ))}
              {!filteredIncidents.length ? (
                <tr><td className="incidents-v1__empty" colSpan={8}>No hay incidentes que coincidan con los filtros actuales.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export function IncidentDetail() {
  const { id } = useParams();
  const item = useSOCStore((state) => state.incidents.find((incident) => incident.id === id));
  const attack = useSOCStore((state) => state.attacks.find((entry) => entry.incidentId === id));

  if (!item) return <Page title="Incidente no encontrado"><CyberPanel>El registro solicitado no existe.</CyberPanel></Page>;
  return <Page title={item.id} subtitle={item.title} action={<Severity value={item.severity}/>}><div className="detail-grid"><CyberPanel><h3>Resumen del incidente</h3><dl>{[['Estado',item.status],['Vector',item.attackType],['Origen',item.source],['Destino',item.target],['Activo',item.asset],['Detectado',item.detectedAt]].map(([a,b])=><div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl></CyberPanel><CyberCard><CardHead title="Vector geográfico"/><ThreatMap compact routes={attack ? [attack] : undefined}/></CyberCard><CyberPanel className="timeline"><h3>Línea de tiempo</h3>{['Anomalía detectada por motor de correlación','Telemetría clasificada y enriquecida','Incidente asignado al SOC','Controles de contención preparados'].map((x,i)=><div key={x}><i/><span><small>+0{1+i*2}m</small><b>{x}</b></span></div>)}</CyberPanel><CyberPanel><h3>Recomendaciones simuladas</h3><p>Aislar temporalmente el activo, validar reglas de acceso y revisar telemetría asociada. Ninguna acción se ejecutará fuera de este entorno.</p><CyberButton>Marcar como investigando</CyberButton></CyberPanel></div></Page>;
}
