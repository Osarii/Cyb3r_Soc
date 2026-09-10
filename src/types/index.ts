export type Severity='Critical'|'High'|'Medium'|'Low';
export type IncidentStatus='Active'|'Investigating'|'Contained'|'Resolved';
export type AttackStatus='DETECTED'|'IN TRANSIT'|'IMPACT'|'CONTAINED'|'NEUTRALIZED';
export type Attack={id:string;incidentId:string;type:string;source:string;destination:string;sourceCoordinates:[number,number];destinationCoordinates:[number,number];severity:Severity;startedAt:string;duration:number;progress:number;status:AttackStatus};
export type Incident={id:string;severity:Severity;title:string;attackType:string;source:string;target:string;asset:string;status:IncidentStatus;detectedAt:string};
export type Asset={hostname:string;ip:string;type:string;risk:Severity;status:'Online'|'At risk'|'Offline';lastSeen:string;incidents:number};
