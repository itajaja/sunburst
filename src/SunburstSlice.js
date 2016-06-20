import d3 from 'd3'
import React from 'react'

import d3Component from './d3Component'

class SunburstSlice extends React.Component {
  static propTypes = {
    color: React.PropTypes.func.isRequired,
    d: React.PropTypes.object,
    slicePath: React.PropTypes.func.isRequired,
  }

  onD3Enter(selection) {
    const { color, slicePath } = this.props

    selection.select('path')
      .style('stroke', 'white')
      .style('fill', d => color((d.children ? d : d.parent).name))
      .attr('d', slicePath)
      .style('opacity', 0)
      .each(d => {
        this.setCurrentTween(d)
      })
  }

  onD3Update(selection) {
    selection.select('path').transition()
      .duration(600)
      .style('opacity', d => d.value ? 1 : 0)
      .attrTween('d', this.arcTween)

    selection.select('text').html(d => d.y)
  }

  onD3Exit(selection) {
    return selection
      .datum({ dy: 0, y: 0 })
      .transition()
      .duration(600)
      .style('opacity', 0)
      .attrTween('d', this.arcTween)
  }

  onClick = () => {
    const { d, onClick } = this.props
    onClick(d)
  }

  onMouseOver = () => {
    // this.d3Node.transition().duration(600).style('fill', 'blue')
  }

  setCurrentTween = ({ x, y, dx, dy }) => this._currentTween = {
    x, y, dx, dy,
  }

  arcTween = d => {
    const { slicePath } = this.props
    const i = d3.interpolate(this._currentTween, d)
    return t => {
      const b = i(t)
      this.setCurrentTween(b)
      return slicePath(b)
    }
  }

  render() {
    return (
      <g>
        <path onClick={this.onClick} onMouseOver={this.onMouseOver} />
        <text />
      </g>
    )
  }
}

export default d3Component(SunburstSlice)
