import { arc } from 'd3-shape';
import React from 'react';

const propTypes = {
  innerRadius: React.PropTypes.number.isRequired,
  outerRadius: React.PropTypes.number.isRequired,
  startAngle: React.PropTypes.number.isRequired,
  endAngle: React.PropTypes.number.isRequired,
};

function Arc({ innerRadius, outerRadius, startAngle, endAngle, ...props }) {
  return (
    <path
      {...props}
      d={arc()({ innerRadius, outerRadius, startAngle, endAngle })}
    />
  );
}

Arc.propTypes = propTypes;

export default Arc;
