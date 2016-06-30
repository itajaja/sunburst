import React from 'react';

import Arc from './Arc';

const propTypes = {
  radiusScale: React.PropTypes.func.isRequired,
  angleScale: React.PropTypes.func.isRequired,
  fillScale: React.PropTypes.func.isRequired,
  node: React.PropTypes.object.isRequired,
  jagged: React.PropTypes.number.isRequired,
};

function SunburstSlice({ radiusScale, angleScale, fillScale, node, jagged }) {
  const { x0, x1, depth, data, children } = node;

  // We could also transition an outer radius floor for the entire diagram,
  // to keep the boundary of the smooth edge as a circle, rather than having
  // each slice animate semi-independently.
  const maxRadius = radiusScale.range()[1];
  const outerRadius =
    maxRadius + jagged * (radiusScale(depth + 1) - maxRadius);

  const arc = (
    <Arc
      innerRadius={radiusScale(depth)}
      outerRadius={outerRadius}
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
          jagged={jagged}
        />
      ))}
    </g>
  );
}

SunburstSlice.propTypes = propTypes;

export default SunburstSlice;
