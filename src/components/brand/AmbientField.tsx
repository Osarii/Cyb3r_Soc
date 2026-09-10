import { memo } from 'react';

// Fixed coordinates keep background detail stable between normal use and visual QA.
export const AmbientField = memo(function AmbientField() {
  return <svg className="ambient-field" viewBox="0 0 1672 941" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g fill="#9f6dd2">{Array.from({length:640},(_,i)=>{
      const x=(i*733+91)%1672;
      const y=(i*347+Math.sin(i*1.7)*140+941)%941;
      return <circle key={i} cx={x} cy={y} r={i%13===0?1.1:.45} opacity={.12+(i%5)*.055}/>;
    })}</g>
    <g stroke="#8751c1" strokeWidth=".45" fill="#8551af" fillOpacity=".025" opacity=".45">
      <path d="M870 104 1000 28 1060 156 1160 70 1275 14 1190 180 1060 156 1110 235 1000 28 965 175Z"/>
      <path d="M1230 840 1350 731 1440 812 1500 718 1664 794 1440 812 1555 918 1350 731"/>
      <path d="M0 839 44 684 77 823 157 767 118 871 44 684 14 921 77 823"/>
    </g>
  </svg>;
});
