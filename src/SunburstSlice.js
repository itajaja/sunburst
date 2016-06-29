import React from 'react';

import Arc from './Arc';

const propTypes = {
  radiusScale: React.PropTypes.func.isRequired,
  angleScale: React.PropTypes.func.isRequired,
  fillScale: React.PropTypes.func.isRequired,
  node: React.PropTypes.object.isRequired,
};

function SunburstSlice({ radiusScale, angleScale, fillScale, node }) {
  const { x0, x1, depth, data, children } = node;

  const arc = (
    <Arc
      innerRadius={radiusScale(depth)}
      outerRadius={radiusScale(depth + 1)}
      startAngle={angleScale(x0)}
      endAngle={angleScale(x1)}
      fill={fillScale(data.key)}
      stroke="white"
    />
  );

  if (!children) {
    return arc;
  }

  return (
    <g>
      {arc}

      {children.map(child => (
        <SunburstSlice
          key={child.data.key}
          radiusScale={radiusScale}
          angleScale={angleScale}
          fillScale={fillScale}
          node={child}
        />
      ))}
    </g>
  );
}

SunburstSlice.propTypes = propTypes;

export default SunburstSlice;
