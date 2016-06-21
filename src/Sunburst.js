import d3 from 'd3'
import { partition, stratify } from 'd3-hierarchy'
import React from 'react'

import d3Component from './d3Component'
import transform from './transform'

class Sunburst extends React.Component {
  static propTypes = {
    data: React.PropTypes.array,
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    valueFunc: React.PropTypes.func.isRequired,
    onSliceClick: React.PropTypes.func.isRequired,
    root: React.PropTypes.object,
    jagged: React.PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context)
    this.x = d3.scale.linear()
    this.y = d3.scale.sqrt()
    this.color = d3.scale.category20b()
    this.tweens = {}

    this.state = this.prepareState(props, [])
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.prepareState(nextProps, this.state.data))
    setTimeout(
      () => this.setState(this.prepareState(nextProps)), 1
    )
  }

  onD3Update(selection) {
    const { root, onSliceClick } = this.props
    const { data, radius } = this.state

    const realRoot = root || data[0]

    const paths = selection.selectAll('path')
      .data(data, (d) => d.data.key)

    paths.enter()
      .append('path')
      .style('fill', d => this.color((d.children ? d : d.parent).data.key))
      .style('stroke', 'white')
      .style('opacity', 0)
      .on('mouseover', d => d3.selectAll('path').style('opacity', dd => d.descendants().indexOf(dd) !== -1 ? 1 : 0.4))
      .on('click', onSliceClick)
      .each(this.setCurrentTween)

    selection.on('mouseleave', () => d3.selectAll('path').style('opacity', 1))

    paths.exit()
        .attr('class', 'exit')
        .transition()
        .duration(1000)
        .attrTween('d', d => this.arcTween({ ...d, x1: d.x0 }))
        .style('opacity', 0)
        .remove()

    paths.transition()
      .duration(1000)
      .tween('scale', () => {
        const xd = d3.interpolate(this.x.domain(), [realRoot.x0, realRoot.x1])
        const yd = d3.interpolate(this.y.domain(), [realRoot.y0, 1])
        const yr = d3.interpolate(this.y.range(), [0, radius])
        return t => {
          this.x.domain(xd(t))
          this.y.domain(yd(t)).range(yr(t))
        }
      })
        .attrTween('d', this.arcTween)
        .style('opacity', 1)
  }

  setCurrentTween = ({ data, x0, y0, x1, y1 }) => {
    this.tweens[data.key] = { x0, y0, x1, y1, key: data.key }
  }

  slicePath = () => {
    const { jagged } = this.props
    return d3.svg.arc()
        .startAngle(d => Math.max(0, Math.min(2 * Math.PI, this.x(d.x0))))
        .endAngle(d => Math.max(0, Math.min(2 * Math.PI, this.x(d.x1))))
        .innerRadius(d => Math.max(0, this.y(d.y0)))
        .outerRadius(d => Math.max(0, jagged ? this.y(d.y1) : this.y(1)))
  }

  prepareState({ data, valueFunc, height, width }) {
    const stratifier = stratify()
      .parentId(({ id }) => id === '__ROOT__'
        ? undefined
        : id.substring(0, id.lastIndexOf(';')) || '__ROOT__'
      )
    const radius = Math.min(width, height) / 2
    this.x.range([0, 2 * Math.PI])
    this.y.range([0, radius])
    const hData = stratifier(data)
      .sum(valueFunc)
      .sort((a, b) => a.data.key - b.data.key)
    const partitionedData = partition()(hData).descendants()

    return {
      data: partitionedData,
      radius,
    }
  }

  arcTween = d => {
    const i = d3.interpolate(this.tweens[d.data.key], d)
    return t => {
      const b = i(t)
      this.setCurrentTween(b)
      return this.slicePath()(b)
    }
  }

  render() {
    const { height, width } = this.props
    return <g transform={transform({ translate: [width / 2, height / 2] })} />
  }
}

export default d3Component(Sunburst)
