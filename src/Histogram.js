import d3 from 'd3'
import React from 'react'
import Transition from 'react-addons-transition-group'

import Histobar from './Histobar'

export default class Histogram extends React.Component {
  static propTypes = {
    data: React.PropTypes.array,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
  };

  render() {
    const { data, height, width } = this.props

    const x = d3.scale.ordinal()
      .rangeRoundBands([0, width], 0.1)
      .domain(data.map((d, i) => i))

    const y = d3.scale.linear()
      .range([height, 0])
      .domain([0, d3.max(data)])

    return (
      <Transition transitionName="histogram" component="g">
        {this.props.data.map((d, i) => (
          <Histobar d={{ x: i, y: d }} key={i} scale={{ x, y }} height={height} />
        ))}
      </Transition>
    )
  }
}
