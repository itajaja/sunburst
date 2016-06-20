import d3 from 'd3'
import React from 'react'

import d3Component from './d3Component'
import transform from './transform'

function isChildOf(child, parent) {
  if (!child) return false
  return child === parent || isChildOf(child.parent, parent)
}

// TODO add id function to data
class Sunburst extends React.Component {
  static propTypes = {
    data: React.PropTypes.object,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    valueFunc: React.PropTypes.func.isRequired,
    onSliceClick: React.PropTypes.func.isRequired,
    root: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props, context)
    this.x = d3.scale.linear()
    this.y = d3.scale.sqrt()
    this.color = d3.scale.category20b()
    this.slicePath = d3.svg.arc()
        .startAngle(d => Math.max(0, Math.min(2 * Math.PI, this.x(d.x))))
        .endAngle(d => Math.max(0, Math.min(2 * Math.PI, this.x(d.x + d.dx))))
        .innerRadius(d => Math.max(0, this.y(d.y)))
        .outerRadius(d => Math.max(0, this.y(d.y + d.dy)))
    this.tweens = {}

    this.state = this.prepareState(props, true)
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.prepareState(nextProps))
    setTimeout(
      () => this.setState(this.prepareState(nextProps, true)), 1
    )
  }

  // onD3Enter(selection) {
  //   const { onSliceClick } = this.props
  //   const { data } = this.state
  //   selection.selectAll('path')
  //     .data(data, ({ key }) => key)
  //     .enter()
  //     .append('path')
  //     .style('fill', d => this.color((d.children ? d : d.parent).name))
  //     .style('stroke', 'white')
  //     .attr('d', this.slicePath)
  //     .on('click', onSliceClick)
  //     .each(this.setCurrentTween)
  // }

  onD3Update(selection) {
    const { root, onSliceClick } = this.props
    const { data, radius } = this.state

    const paths = selection.selectAll('path')
      .data(data, ({ key }) => key)

    paths.enter()
      .append('path')
      .style('fill', d => this.color((d.children ? d : d.parent).name))
      .style('stroke', 'white')
      .style('opacity', 0)
      .on('mouseover', d => console.log(d))
      .on('click', onSliceClick)
      .each(this.setCurrentTween)

    paths.exit()
        .remove()

    selection.transition()
      .duration(1600)
      .tween('scale', () => {
        const xd = d3.interpolate(this.x.domain(), [root.x, root.x + root.dx])
        const yd = d3.interpolate(this.y.domain(), [root.y, 1])
        const yr = d3.interpolate(this.y.range(), [0, radius])
        return t => {
          this.x.domain(xd(t))
          this.y.domain(yd(t)).range(yr(t))
        }
      })
      .selectAll('path')
        .style('opacity', d => (d.x < root.x || d.x + d.dx > root.x + root.dx) ? 0 : 1)
        .attrTween('d', this.arcTween)
  }

  setCurrentTween = ({ key, x, y, dx, dy }) => {
    if (key === 'Bacteria-Firmicutes-Bacilli') {
      console.log(x, dx, !!this.tweens[key])
    }
    this.tweens[key] = { x, y, dx, dy }
  }

  prepareState({ data, valueFunc, height, width }, real) {
    const radius = Math.min(width, height) / 2
    this.x.range([0, 2 * Math.PI])
    this.y.range([0, radius])
    const vf = (d) => {
      if (this.tweens[d.key]) {
        return valueFunc(d)
      }
      return 0.01
    }
    return {
      data: d3.layout.partition()
        .sort(null)
        .value(vf)
        .nodes(data),
      radius,
    }
  }

  arcTween = d => {
    const i = d3.interpolate(this.tweens[d.key], d)
    return t => {
      const b = i(t)
      this.setCurrentTween(b)
      return this.slicePath(b)
    }
  }

  render() {
    const { height, width } = this.props
    return <g transform={transform({ translate: [width / 2, height / 2] })} />
  }
}

export default d3Component(Sunburst)
