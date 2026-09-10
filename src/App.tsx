import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { useSOCStore } from './app/store/useSOCStore';
import DashboardReference, { ReferenceShell } from './v2/DashboardReference';
import { ThreatMapReferenceContent } from './v2/ThreatMapReference';
import { DDoSMitigationScreenV2, InitialBootScreenV2, ServerUnavailableV2 } from './v2/SpecialScreens';
import { IncidentDetail, Incidents } from './pages/Incidents';
import { Analytics, Assets, Automation, Intelligence, Reports, Settings, Simulations } from './pages/OtherPages';
import { mitigationFixture } from './data/fixtures/mitigation.fixture';

function Framed({ children }: { children: ReactNode }) {
  const location = useLocation();
  return <ReferenceShell activePath={location.pathname}>{children}</ReferenceShell>;
}

function MitigationRoute({ visualTest = false }: { visualTest?: boolean }) {
  const navigate = useNavigate();
  const { id: incidentId } = useParams();
  const attacks = useSOCStore(state => state.attacks);
  const resolveAttack = useSOCStore(state => state.resolveAttack);
  const attack = attacks.find(item => item.incidentId === incidentId) ?? attacks.at(-1);
  const resolved = useRef(false);
  const [progress,setProgress] = useState(visualTest ? mitigationFixture.progress : 0);
  const [paused,setPaused] = useState(false);
  useEffect(() => {
    if (visualTest || paused) return;
    const timer = window.setInterval(() => setProgress(value => Math.min(100,value+1)), 95);
    return () => window.clearInterval(timer);
  }, [paused, visualTest]);
  useEffect(() => {
    if (visualTest || progress < 100 || !attack || resolved.current) return;
    resolved.current = true;
    resolveAttack(attack.id);
    toast.success('Amenaza neutralizada', { description: `${attack.incidentId} fue resuelto y los servicios están estables.` });
  }, [attack, progress, resolveAttack, visualTest]);
  return <DDoSMitigationScreenV2 progress={progress} paused={paused} onPause={()=>setPaused(value => !value)} onCancel={()=>navigate('/threat-map')}/>;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const visualTest = new URLSearchParams(location.search).get('visualTest') === 'true';
  const systemStatus = useSOCStore(s=>s.systemStatus);
  const setSystemStatus = useSOCStore(s=>s.setSystemStatus);
  const [booting,setBooting] = useState(() => !visualTest && sessionStorage.getItem('cyb3r_soc_initialized') !== 'true');
  const [bootProgress,setBootProgress] = useState(3);

  useEffect(() => {
    if (visualTest) document.documentElement.dataset.visualTest = 'true';
    else delete document.documentElement.dataset.visualTest;
    return () => { delete document.documentElement.dataset.visualTest; };
  }, [visualTest]);

  useEffect(() => {
    if (!booting) return;
    const timer = window.setInterval(() => setBootProgress(value => {
      const next = Math.min(100,value+1);
      if (next === 100) {
        window.clearInterval(timer);
        window.setTimeout(() => {
          sessionStorage.setItem('cyb3r_soc_initialized','true');
          setBooting(false);
        }, 350);
      }
      return next;
    }), 36);
    return () => window.clearInterval(timer);
  }, [booting]);

  if (booting) return <InitialBootScreenV2 progress={bootProgress} onSkip={()=>{sessionStorage.setItem('cyb3r_soc_initialized','true');setBooting(false)}}/>;
  if (systemStatus === 'OFFLINE') return <ServerUnavailableV2 onRetry={()=>setSystemStatus('ONLINE')} onBack={()=>{setSystemStatus('ONLINE');navigate('/dashboard')}}/>;

  return <>
    <Routes>
      <Route index element={<Navigate to="/dashboard" replace/>}/>
      <Route path="/dashboard" element={<DashboardReference/>}/>
      <Route path="/threat-map" element={<Framed><ThreatMapReferenceContent visualTest={visualTest}/></Framed>}/>
      <Route path="/mitigation" element={<MitigationRoute visualTest={visualTest}/>}/>
      <Route path="/incidents/:id/mitigation" element={<MitigationRoute visualTest={visualTest}/>}/>
      <Route path="/offline" element={<ServerUnavailableV2 onRetry={()=>navigate('/dashboard')} onBack={()=>navigate('/dashboard')}/>}/>
      <Route path="/boot-preview" element={<InitialBootScreenV2 progress={68} onSkip={()=>navigate('/dashboard')}/>}/>
      <Route path="/incidents" element={<Framed><Incidents/></Framed>}/>
      <Route path="/incidents/:id" element={<Framed><IncidentDetail/></Framed>}/>
      <Route path="/intelligence" element={<Framed><Intelligence/></Framed>}/>
      <Route path="/assets" element={<Framed><Assets/></Framed>}/>
      <Route path="/simulations" element={<Framed><Simulations/></Framed>}/>
      <Route path="/analytics" element={<Framed><Analytics/></Framed>}/>
      <Route path="/reports" element={<Framed><Reports/></Framed>}/>
      <Route path="/automation" element={<Framed><Automation/></Framed>}/>
      <Route path="/settings" element={<Framed><Settings/></Framed>}/>
      <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
    </Routes>
    <Toaster theme="dark" position="top-right" richColors/>
  </>;
}
