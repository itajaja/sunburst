import { partition, stratify } from 'd3-hierarchy';
import { scaleLinear, scaleOrdinal, scaleSqrt, schemeCategory20b }
  from 'd3-scale';
import React from 'react';

import SunburstSlice from './SunburstSlice';

export default class Sunburst extends React.Component {
  static propTypes = {
    nodes: React.PropTypes.array.isRequired,
    maxDepth: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.radiusScale = scaleSqrt();
    this.angleScale = scaleLinear().range([0, 2 * Math.PI]);

    this.fillScale = scaleOrdinal(schemeCategory20b);
  }

  getRoot(nodes) {
    const root = stratify()(nodes);
    root.each(node => {
      node.value = node.data.value; // eslint-disable-line no-param-reassign
    });

    return partition()(root);
  }

  render() {
    const { nodes, maxDepth, height, width } = this.props;
    const root = this.getRoot(nodes);
    const radius = Math.min(width, height) / 2;

    const { radiusScale, angleScale, fillScale } = this;
    radiusScale.domain([0, maxDepth + 1]).range([0, radius]);

    root.each(({ data }) => {
      // Evaluate the fill color in breadth-first fashion to ensure that
      // adjacent slices have different fill colors.
      fillScale(data.key);
    });

    return (
      <g transform={`translate(${0.5 * width},${0.5 * height})`}>
        <SunburstSlice
          radiusScale={radiusScale}
          angleScale={angleScale}
          fillScale={fillScale}
          node={root}
        />
      </g>
    );
  }
}
