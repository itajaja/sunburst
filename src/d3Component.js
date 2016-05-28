/* eslint-disable react/prop-types */
import d3 from 'd3'
import { findDOMNode } from 'react-dom'

const NOOP = () => undefined

// extends an existing method on a class, if it exists, otherwise
// just add the extension as default
function extend(Class, method, extension) {
  const existingMethod = Class.prototype[method]

  /* eslint-disable no-param-reassign */
  Class.prototype[method] = existingMethod
  /* eslint-enable no-param-reassign */
    ? function combined(...args) {
      extension.bind(this)(...args)
      return existingMethod.bind(this)(...args)
    }
    : extension
}

function _componentDidMount() {
  this.d3Node = d3.select(findDOMNode(this))
  this.d3Node.datum(this.props.d)
    .call((selection) => this.onD3Enter(selection))
    .call((selection) => this.onD3Update(selection))
}

function _componentDidUpdate() {
  this.d3Node.datum(this.props.d)
    .call((selection) => this.onD3Update(selection))
}

function _componentWillLeave(done) {
  this.d3Node
    .call((selection) => {
      const t = this.onD3Exit(selection)

      if (t && t.each) {
        t.each('end', done)
      } else {
        done()
      }
    })
}

export default function (Component) {
  extend(Component, 'componentDidMount', _componentDidMount)
  extend(Component, 'componentDidUpdate', _componentDidUpdate)
  extend(Component, 'componentWillLeave', _componentWillLeave)
  extend(Component, 'onD3Enter', NOOP)
  extend(Component, 'onD3Update', NOOP)
  extend(Component, 'onD3Exit', NOOP)
  return Component
}
