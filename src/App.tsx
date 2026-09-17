import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { useSOCStore } from './app/store/useSOCStore';
import DashboardReference, { ReferenceShell } from './v2/DashboardReference';
import { ThreatMapReferenceContent } from './v2/ThreatMapReference';
import { BootEntryScreen, DDoSMitigationScreenV2, InitialBootScreenV2, ServerUnavailableV2 } from './v2/SpecialScreens';
import { IncidentDetail, Incidents } from './pages/Incidents';
import { Analytics, Assets, Automation, Intelligence, Reports, Settings, Simulations } from './pages/OtherPages';
import { mitigationFixture } from './data/fixtures/mitigation.fixture';
import { useDocumentVisible } from './hooks/useAnimationActivity';
import { useVisualTestMode } from './config/visualTest';

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
  const documentVisible = useDocumentVisible();
  const [progress,setProgress] = useState(visualTest ? mitigationFixture.progress : 0);
  const [paused,setPaused] = useState(false);
  useEffect(() => {
    if (visualTest || paused || !documentVisible) return;
    const timer = window.setInterval(() => setProgress(value => Math.min(100,value+1)), 95);
    return () => window.clearInterval(timer);
  }, [paused, visualTest, documentVisible]);
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
  const visualTest = useVisualTestMode();
  const systemStatus = useSOCStore(s=>s.systemStatus);
  const setSystemStatus = useSOCStore(s=>s.setSystemStatus);
  const [entryVisible,setEntryVisible] = useState(() => !visualTest && sessionStorage.getItem('cyb3r_soc_initialized') !== 'true');
  const [booting,setBooting] = useState(false);
  const documentVisible = useDocumentVisible();

  useEffect(() => {
    if (visualTest) document.documentElement.dataset.visualTest = 'true';
    else delete document.documentElement.dataset.visualTest;
    return () => { delete document.documentElement.dataset.visualTest; };
  }, [visualTest]);

  useEffect(() => {
    document.documentElement.dataset.pageHidden = String(!documentVisible);
    return () => { delete document.documentElement.dataset.pageHidden; };
  }, [documentVisible]);

  const finishBoot = () => {
    sessionStorage.setItem('cyb3r_soc_initialized','true');
    setBooting(false);
  };

  const startBoot = () => {
    setEntryVisible(false);
    setBooting(true);
  };

  const handleStartSystem = () => {
    try {
      const fullscreen = document.documentElement.requestFullscreen();
      void Promise.resolve(fullscreen).then(startBoot, startBoot);
    } catch {
      startBoot();
    }
  };

  if (entryVisible) return <BootEntryScreen onStart={handleStartSystem}/>;
  if (booting) return <InitialBootScreenV2 onSkip={finishBoot} onComplete={finishBoot}/>;
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
