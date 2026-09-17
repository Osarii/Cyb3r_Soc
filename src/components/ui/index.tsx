import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import styled from 'styled-components';
export const CyberCard=styled.section`background:linear-gradient(145deg,rgba(28,23,39,.96),rgba(15,13,22,.96));border:1px solid var(--border);clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));position:relative;box-shadow:inset 0 1px rgba(255,255,255,.025),0 18px 45px rgba(0,0,0,.25);`;
export const CyberPanel=styled(CyberCard)`padding:20px;`;
const Btn=styled.button`border:1px solid var(--purple-700);background:linear-gradient(180deg,#2c2040,#1b1526);color:var(--text);font:600 11px var(--font-ui);letter-spacing:.08em;text-transform:uppercase;padding:10px 16px;clip-path:polygon(7px 0,100% 0,100% calc(100% - 7px),calc(100% - 7px) 100%,0 100%,0 7px);cursor:pointer;transition:.18s;min-height:38px;&:hover{transform:translateY(-1px);border-color:var(--purple-400);background:linear-gradient(180deg,#3a2856,#21172e)}&:active{transform:scale(.97)}&:focus-visible{outline:2px solid #fff;outline-offset:3px}&:disabled{opacity:.4;cursor:not-allowed}`;
export function CyberButton({variant='primary',...p}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:string}){return <Btn data-variant={variant} {...p}/>}
export const CyberIconButton=styled(Btn)`width:40px;height:40px;padding:0;display:grid;place-items:center;`;
export const CyberInput=styled.input`width:100%;border:1px solid var(--border);background:#0e0b15;color:var(--text);padding:11px 13px;outline:none;clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);&:focus{border-color:var(--purple-400);box-shadow:0 0 0 2px rgba(139,92,246,.16)}`;
export const CyberSelect=styled.select`border:1px solid var(--border);background:#0e0b15;color:var(--text);padding:10px 34px 10px 12px;clip-path:polygon(6px 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%,0 6px);`;
export const CyberTabs=styled.div`display:flex;gap:6px;flex-wrap:wrap;`;
export const CyberBadge=styled.span`display:inline-flex;align-items:center;gap:6px;padding:4px 8px;border:1px solid currentColor;font:700 10px var(--font-mono);letter-spacing:.06em;text-transform:uppercase;clip-path:polygon(4px 0,100% 0,100% calc(100% - 4px),calc(100% - 4px) 100%,0 100%,0 4px);`;
export const CyberStatus=({children,className=''}:{children:ReactNode,className?:string})=><CyberBadge className={className}><i className="status-dot"/>{children}</CyberBadge>;
export const CyberProgress=({value}:{value:number})=><div className="progress" aria-label={`Progreso ${value}%`}><span style={{width:`${value}%`}}/></div>;
export function CyberStatCard({label,value,delta,icon}:{label:string;value:string;delta:string;icon:ReactNode}){return <CyberCard className="stat"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{delta}</small></div></CyberCard>}
export function CyberTooltip({label,children}:{label:string;children:ReactNode}){return <span title={label}>{children}</span>}
export const CyberModal=({children}: {children:ReactNode})=><div className="modal-backdrop"><CyberPanel className="modal">{children}</CyberPanel></div>;
export function CyberDropdown(props:SelectHTMLAttributes<HTMLSelectElement>){return <CyberSelect {...props}/>}
