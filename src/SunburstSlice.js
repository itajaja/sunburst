import Color from 'color';
import React from 'react';

import Arc from './Arc';

const WHITE = new Color('white');

export default class SunburstSlice extends React.Component {
  static propTypes = {
    radiusScale: React.PropTypes.func.isRequired,
    angleScale: React.PropTypes.func.isRequired,
    fillScale: React.PropTypes.func.isRequired,
    node: React.PropTypes.object.isRequired,
    jagged: React.PropTypes.number.isRequired,
  };

  static contextTypes = {
    app: React.PropTypes.object.isRequired,
  };

  onMouseEnter = () => {
    this.context.app.setHighlightedKey(this.props.node.data.key);
  };

  onMouseLeave = () => {
    this.context.app.setHighlightedKey(null);
  };

  onClick = () => {
    this.context.app.setActiveNode(this.props.node);
  };

  render() {
    const { radiusScale, angleScale, fillScale, node, jagged } = this.props;
    const { x0, x1, depth, data, children } = node;
    const { key, fade } = data;

    // We could also transition an outer radius floor for the entire diagram,
    // to keep the boundary of the smooth edge as a circle, rather than having
    // each slice animate semi-independently.
    let outerRadius;
    if (jagged === 0) {
      outerRadius = radiusScale.range()[1];
    } else if (jagged === 1) {
      outerRadius = radiusScale(depth + 1);
    } else {
      const maxRadius = radiusScale.range()[1];
      outerRadius = maxRadius + jagged * (radiusScale(depth + 1) - maxRadius);
    }

    let fill = fillScale(key);
    if (fade > 0) {
      const weight = 1 - fade; // I don't know why color does this.
      fill = new Color(fill).mix(WHITE, weight).hexString();
    }

    const arc = (
      <Arc
        innerRadius={radiusScale(depth)}
        outerRadius={outerRadius}
        startAngle={angleScale(x0)}
        endAngle={angleScale(x1)}
        fill={fill}
        stroke="white"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
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
}
