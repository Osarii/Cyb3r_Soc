import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Attack, Incident } from '../../types';
import { initialIncidents } from '../../data';
type AIState='IDLE'|'LISTENING'|'THINKING'|'SPEAKING'|'ERROR';
type Store={attacks:Attack[];incidents:Incident[];logs:string[];aiState:AIState;systemStatus:'ONLINE'|'OFFLINE';addAttack:(type:string)=>Attack;setAttackStatus:(id:string,status:Attack['status'])=>void;resolveAttack:(id:string)=>void;setAIState:(s:AIState)=>void;setSystemStatus:(s:'ONLINE'|'OFFLINE')=>void};
const paths:Record<string,[[number,number],[number,number]]>={DDoS:[[-74,40],[-3,40]],'Brute Force':[[103,1],[-3,40]],Ransomware:[[37,55],[-3,40]],Phishing:[[139,35],[-3,40]],'Port Scan':[[-43,-22],[-3,40]],'Data Exfiltration':[[-3,40],[77,28]]};
export const useSOCStore=create<Store>()(persist((set,get)=>({
 attacks:[],incidents:initialIncidents,logs:['[INFO] Telemetría global sincronizada','[INFO] Motores de detección operativos'],aiState:'IDLE',systemStatus:'ONLINE',
 addAttack:(type)=>{const coords=paths[type]||paths.DDoS; const id=`ATK-${Date.now().toString().slice(-5)}`; const attack:Attack={id,type,source:'203.0.113.84',destination:'198.51.100.10',sourceCoordinates:coords[0],destinationCoordinates:coords[1],severity:type==='DDoS'?'Critical':'High',startedAt:new Date().toLocaleTimeString('es-GT'),duration:18,progress:0,status:'IN TRANSIT'}; const incident:Incident={id:`INC-${Date.now().toString().slice(-4)}`,severity:attack.severity,title:`Simulación ${type} detectada`,attackType:type,source:attack.source,target:attack.destination,asset:type==='DDoS'?'FW-EDGE-01':'SRV-APP-03',status:'Active',detectedAt:attack.startedAt}; set(s=>({attacks:[...s.attacks,attack],incidents:[incident,...s.incidents],logs:[`[WARN] ${type} simulado iniciado`,...s.logs]})); return attack},
 setAttackStatus:(id,status)=>set(s=>({attacks:s.attacks.map(a=>a.id===id?{...a,status}:a),incidents:s.incidents.map(i=>i.attackType===get().attacks.find(a=>a.id===id)?.type?{...i,status:status==='CONTAINED'?'Contained':i.status}:i),logs:[`[INFO] ${id} → ${status}`,...s.logs]})),
 resolveAttack:(id)=>set(s=>({attacks:s.attacks.map(a=>a.id===id?{...a,status:'NEUTRALIZED'}:a),incidents:s.incidents.map(i=>i.attackType===get().attacks.find(a=>a.id===id)?.type&&i.status!=='Resolved'?{...i,status:'Resolved'}:i),logs:[`[INFO] ${id} neutralizado; servicios estables`,...s.logs]})),
 setAIState:(aiState)=>set({aiState}),setSystemStatus:(systemStatus)=>set({systemStatus})
}),{name:'cybersoc-state',partialize:s=>({incidents:s.incidents,logs:s.logs})}));
