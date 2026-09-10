import { ComposableMap, Geographies, Geography, Graticule, Line, Marker, Sphere, ZoomableGroup } from 'react-simple-maps';
import { useSOCStore } from '../../app/store/useSOCStore';
import geography from 'world-atlas/countries-110m.json';

const nodes: [number, number][] = [[-122,38],[103,1],[37,55],[121,31],[-74,4],[13,52],[151,-33]];

export function ThreatMap({ compact = false }: { compact?: boolean }) {
  const attacks = useSOCStore(s => s.attacks);
  const demo = attacks.length ? attacks : [
    { id:'demo', sourceCoordinates:[-122,38] as [number,number], destinationCoordinates:[13,52] as [number,number], status:'IN TRANSIT' },
    { id:'demo2', sourceCoordinates:[121,31] as [number,number], destinationCoordinates:[13,52] as [number,number], status:'IN TRANSIT' },
    { id:'demo3', sourceCoordinates:[-74,4] as [number,number], destinationCoordinates:[151,-33] as [number,number], status:'IN TRANSIT' },
  ];
  return <div className={`threat-map ${compact ? 'compact' : ''}`}>
    <ComposableMap projectionConfig={{ scale: compact ? 123 : 147 }}>
      <ZoomableGroup zoom={1}>
        <Sphere id="soc-sphere" fill="#090812" stroke="#332842" strokeWidth={.7}/>
        <Graticule stroke="#261e32" strokeWidth={.3}/>
        <Geographies geography={geography as unknown as string}>
          {({ geographies }) => geographies.map(geo => <Geography className="map-country" key={geo.rsmKey} geography={geo} fill="#2a1d3d" stroke="#4c3766" strokeWidth={.28}/>)}
        </Geographies>
        {nodes.map((p,i) => <Marker coordinates={p} key={i}><circle r={i===5?4:2} fill={i===5?'#a78bfa':'#6f4d91'}><animate attributeName="r" values="2;4;2" dur={`${2+i/4}s`} repeatCount="indefinite"/></circle></Marker>)}
        {demo.map((a,i) => <g key={a.id} opacity={a.status==='CONTAINED'?.35:1}>
          <Line from={a.sourceCoordinates} to={a.destinationCoordinates} stroke={i%2?'#8b5cf6':'#f43f5e'} strokeWidth={1.2} strokeLinecap="round" className="attack-line"/>
          <Marker coordinates={a.sourceCoordinates}><circle r={4} fill={i%2?'#8b5cf6':'#f43f5e'}/></Marker>
          <Marker coordinates={a.destinationCoordinates}><circle r={7} fill="none" stroke={i%2?'#a78bfa':'#f43f5e'} strokeWidth="1" className="target-ring"/></Marker>
        </g>)}
      </ZoomableGroup>
    </ComposableMap>
    <div className="map-legend"><span><i className="critical"/>ATAQUE EN CURSO</span><span><i/>TRÁFICO SOSPECHOSO</span><b>{attacks.length||3} trayectorias activas</b></div>
  </div>;
}
