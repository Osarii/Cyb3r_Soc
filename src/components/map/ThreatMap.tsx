import { memo, useId, useMemo, useRef } from 'react';
import { ComposableMap, ZoomableGroup } from 'react-simple-maps';
import { geoNaturalEarth1 } from 'd3-geo';
import { useSOCStore } from '../../app/store/useSOCStore';
import { useAnimationActivity } from '../../hooks/useAnimationActivity';
import { useVisualTestMode } from '../../config/visualTest';
import type { Attack } from '../../types';

const projection = geoNaturalEarth1().center([0,18]).scale(168).translate([500,190]);
type ThreatMapRoute = Pick<Attack, 'id' | 'sourceCoordinates' | 'destinationCoordinates' | 'status'>;
const cities: {name:string;position:[number,number];source:boolean;offset:[number,number]}[] = [
  {name:'San Francisco, US',position:[-122,38],source:true,offset:[-45,-40]},
  {name:'Londres, UK',position:[0,51],source:false,offset:[0,-37]},
  {name:'Moscú, RU',position:[37,55],source:true,offset:[8,-36]},
  {name:'Bogotá, CO',position:[-74,4],source:true,offset:[5,8]},
  {name:'Shanghái, CN',position:[121,31],source:true,offset:[9,-9]},
  {name:'Sidney, AU',position:[151,-33],source:false,offset:[-20,7]},
];
const demo: ThreatMapRoute[] = [
  {id:'demo-1',sourceCoordinates:[-122,38],destinationCoordinates:[0,51],status:'IN TRANSIT'},
  {id:'demo-2',sourceCoordinates:[121,31],destinationCoordinates:[37,55],status:'IN TRANSIT'},
  {id:'demo-3',sourceCoordinates:[-74,4],destinationCoordinates:[151,-33],status:'IN TRANSIT'},
  {id:'demo-4',sourceCoordinates:[-122,38],destinationCoordinates:[121,31],status:'IN TRANSIT'},
  {id:'demo-5',sourceCoordinates:[-74,4],destinationCoordinates:[13,30],status:'IN TRANSIT'},
];

/** Geographic, code-driven trajectories; no screenshot is used as a map. */
export const ThreatMap = memo(function ThreatMap({compact=false,routes: providedRoutes}:{compact?:boolean;routes?:ThreatMapRoute[]}) {
  const attacks=useSOCStore(s=>s.attacks);
  const routes=useMemo(()=>providedRoutes?.length?providedRoutes:attacks.length?attacks:demo,[providedRoutes,attacks]);
  const id=useId().replace(/:/g,'');
  const rootRef=useRef<HTMLDivElement>(null);
  const visualTest=useVisualTestMode();
  const animationActive=useAnimationActivity(rootRef);
  const frozen=visualTest||!animationActive;
  return <div ref={rootRef} className={`threat-map ${compact?'compact':''} ${frozen?'map-animation-paused':''}`}>
    <ComposableMap width={1000} height={380} projection="geoNaturalEarth1" projectionConfig={{center:[0,18],scale:168}}>
      <defs>
        <pattern id={`${id}-land`} width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#301b47"/><circle cx="1" cy="2" r=".65" fill="#995aca" opacity=".7"/><circle cx="5" cy="5" r=".35" fill="#b08add"/></pattern>
        <filter id={`${id}-glow`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <ZoomableGroup center={[0,18]}>
        {routes.map((route,index)=>{
          const source=projection(route.sourceCoordinates as [number,number]);
          const target=projection(route.destinationCoordinates as [number,number]);
          if(!source||!target)return null;
          const color=index%2?'#b55bff':'#ff326c';
          const d=`M${source[0]},${source[1]} Q${(source[0]+target[0])/2},${Math.min(source[1],target[1])-60} ${target[0]},${target[1]}`;
          const active=route.status==='IN TRANSIT';
          return <g key={route.id} opacity={route.status==='NEUTRALIZED'?.12:route.status==='CONTAINED'?.35:1}>
            <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="2 5" filter={`url(#${id}-glow)`}/>
            {[source,target].map((p,i)=>{const nodeColor=i?'#ab53ff':'#ff326c';return <g key={i} transform={`translate(${p[0]},${p[1]})`}><circle r="16" fill={nodeColor} opacity=".16"/><circle r="10" stroke={nodeColor} fill="none" strokeWidth="1"/><circle r="6" fill={nodeColor} filter={`url(#${id}-glow)`}/><circle r="3" fill="#fff0ff"/></g>})}
            {!frozen&&active?<circle r="3" fill="white" filter={`url(#${id}-glow)`}><animateMotion path={d} dur={`${6+index}s`} repeatCount="indefinite"/></circle>:null}
          </g>;
        })}
        {!compact&&cities.map(city=>{const p=projection(city.position);if(!p)return null;return <g key={city.name} transform={`translate(${p[0]+city.offset[0]},${p[1]+city.offset[1]})`}>
          <rect width={city.name.length*5.4+14} height="32" rx="3" fill="#100a20" stroke="#664383" strokeWidth=".65"/>
          <text x="7" y="12" fill="#f6eafa" fontSize="10" fontFamily="Arial, sans-serif">{city.name}</text>
          <text x="7" y="25" fill={city.source?'#ff4677':'#b980f1'} fontSize="9" fontFamily="Arial, sans-serif">{city.source?'Origen de ataque':'Destino'}</text>
        </g>})}
      </ZoomableGroup>
    </ComposableMap>
    <div className="map-legend"><span><i className="critical"/>ATAQUE EN CURSO</span><span><i/>TRÁFICO SOSPECHOSO</span><b>{routes.length} trayectorias</b></div>
  </div>;
});
