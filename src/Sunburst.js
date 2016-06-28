import { partition, stratify } from 'd3-hierarchy';
import { scaleOrdinal, scaleSqrt, schemeCategory20b } from 'd3-scale';
import React from 'react';

import Arc from './Arc';

export default class Sunburst extends React.Component {
  static propTypes = {
    nodes: React.PropTypes.array.isRequired,
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.rScale = scaleSqrt().domain([0, 20]);
    this.colorScale = scaleOrdinal(schemeCategory20b);
  }

  getLayout(nodes) {
    const root = stratify()(nodes);
    root.each(node => {
      node.value = node.data.value; // eslint-disable-line no-param-reassign
    });

    const partitioner = partition()
      .size([2 * Math.PI, 1]);

    return partitioner(root).descendants();
  }

  render() {
    const { nodes, height, width } = this.props;
    const layout = this.getLayout(nodes);

    const radius = Math.min(width, height) / 2;
    this.rScale.range([0, radius]);

    return (
      <g transform={`translate(${0.5 * width},${0.5 * height})`}>
        {layout.map(({ x0, x1, depth, data }) => (
          <Arc
            key={data.key}
            innerRadius={this.rScale(depth)}
            outerRadius={this.rScale(depth + 1)}
            startAngle={x0}
            endAngle={x1}
            fill={this.colorScale(data.key)}
            stroke="white"
          />
        ))}
      </g>
    );
  }
}
