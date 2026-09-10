import type { Asset, Incident } from '../types';
export const initialIncidents:Incident[]=[
 {id:'INC-4821',severity:'Critical',title:'Volumetric traffic anomaly',attackType:'DDoS',source:'203.0.113.42',target:'198.51.100.10',asset:'FW-EDGE-01',status:'Active',detectedAt:'12:44:08'},
 {id:'INC-4819',severity:'High',title:'Credential spray detected',attackType:'Brute Force',source:'192.0.2.81',target:'198.51.100.18',asset:'VPN-GW-01',status:'Investigating',detectedAt:'12:31:52'},
 {id:'INC-4814',severity:'Medium',title:'Suspicious process chain',attackType:'Ransomware',source:'192.0.2.24',target:'198.51.100.31',asset:'WS-USER-109',status:'Contained',detectedAt:'11:58:19'},
 {id:'INC-4809',severity:'Low',title:'Port enumeration pattern',attackType:'Port Scan',source:'203.0.113.117',target:'198.51.100.22',asset:'SRV-APP-03',status:'Resolved',detectedAt:'10:17:03'}
];
export const assets:Asset[]=[
 {hostname:'DB-PROD-01',ip:'198.51.100.14',type:'Database',risk:'High',status:'Online',lastSeen:'Ahora',incidents:2},
 {hostname:'SRV-APP-03',ip:'198.51.100.22',type:'Application',risk:'Medium',status:'Online',lastSeen:'8 s',incidents:1},
 {hostname:'FW-EDGE-01',ip:'198.51.100.10',type:'Firewall',risk:'Critical',status:'At risk',lastSeen:'Ahora',incidents:4},
 {hostname:'WS-USER-109',ip:'198.51.100.31',type:'Endpoint',risk:'Low',status:'Online',lastSeen:'2 min',incidents:1},
 {hostname:'VPN-GW-01',ip:'198.51.100.18',type:'Gateway',risk:'High',status:'At risk',lastSeen:'11 s',incidents:3}
];
export const intel=[
 {kind:'CAMPAIGN',title:'Purple Raven credential campaign',meta:'Confidence 92% · 12 min'},
 {kind:'CVE',title:'CVE-2026-41802 activity observed',meta:'Elevated · 38 min'},
 {kind:'IOC',title:'New simulated command pattern',meta:'7 indicators · 1 h'},
 {kind:'MALWARE',title:'ObsidianLock behavioral profile',meta:'Research feed · 2 h'}
];
export const trends=[{d:'Lun',v:18},{d:'Mar',v:26},{d:'Mié',v:21},{d:'Jue',v:38},{d:'Vie',v:31},{d:'Sáb',v:17},{d:'Hoy',v:29}];
export const types=[{name:'DDoS',value:34},{name:'Phishing',value:26},{name:'Brute Force',value:19},{name:'Malware',value:13},{name:'Otros',value:8}];
