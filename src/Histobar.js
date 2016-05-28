import React from 'react'

import d3Component from './d3Component'

class Histobar extends React.Component {
  static propTypes = {
    height: React.PropTypes.number,
    scale: React.PropTypes.object,
  }

  onD3Enter(selection) {
    const { height } = this.props
    selection.attr('y', height)
  }

  onD3Update(selection) {
    const { height, scale } = this.props

    selection
      .transition()
      .duration(400)
      .attr('x', (d) => scale.x(d.x))
      .attr('width', scale.x.rangeBand())
      .attr('y', d => scale.y(d.y))
      .attr('height', d => height - scale.y(d.y))
  }

  onD3Exit(selection) {
    const { height } = this.props

    return selection
      .transition()
      .duration(400)
      .attr('y', height)
  }

  render() {
    return (
      <rect />
    )
  }
}

export default d3Component(Histobar)
