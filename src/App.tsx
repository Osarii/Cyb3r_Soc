import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useSOCStore } from './app/store/useSOCStore';
import DashboardReference, { ReferenceShell } from './v2/DashboardReference';
import { ThreatMapReferenceContent } from './v2/ThreatMapReference';
import { DDoSMitigationScreenV2, InitialBootScreenV2, ServerUnavailableV2 } from './v2/SpecialScreens';
import { IncidentDetail, Incidents } from './pages/Incidents';
import { Analytics, Assets, Automation, Intelligence, Reports, Settings, Simulations } from './pages/OtherPages';

function Framed({ children }: { children: ReactNode }) {
  const location = useLocation();
  return <ReferenceShell activePath={location.pathname}>{children}</ReferenceShell>;
}

function MitigationRoute() {
  const navigate = useNavigate();
  const [progress,setProgress] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setProgress(value => Math.min(100,value+1)), 95);
    return () => window.clearInterval(timer);
  }, []);
  return <DDoSMitigationScreenV2 progress={progress} onPause={()=>undefined} onCancel={()=>navigate('/threat-map')}/>;
}

export default function App() {
  const navigate = useNavigate();
  const systemStatus = useSOCStore(s=>s.systemStatus);
  const setSystemStatus = useSOCStore(s=>s.setSystemStatus);
  const [booting,setBooting] = useState(() => sessionStorage.getItem('cybersoc_initialized') !== 'true');
  const [bootProgress,setBootProgress] = useState(3);

  useEffect(() => {
    if (!booting) return;
    const timer = window.setInterval(() => setBootProgress(value => {
      const next = Math.min(100,value+1);
      if (next === 100) {
        window.clearInterval(timer);
        window.setTimeout(() => {
          sessionStorage.setItem('cybersoc_initialized','true');
          setBooting(false);
        }, 350);
      }
      return next;
    }), 36);
    return () => window.clearInterval(timer);
  }, [booting]);

  if (booting) return <InitialBootScreenV2 progress={bootProgress} onSkip={()=>{sessionStorage.setItem('cybersoc_initialized','true');setBooting(false)}}/>;
  if (systemStatus === 'OFFLINE') return <ServerUnavailableV2 onRetry={()=>setSystemStatus('ONLINE')} onBack={()=>{setSystemStatus('ONLINE');navigate('/dashboard')}}/>;

  return <>
    <Routes>
      <Route index element={<Navigate to="/dashboard" replace/>}/>
      <Route path="/dashboard" element={<DashboardReference/>}/>
      <Route path="/threat-map" element={<Framed><ThreatMapReferenceContent/></Framed>}/>
      <Route path="/mitigation" element={<MitigationRoute/>}/>
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
