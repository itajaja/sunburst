import d3 from 'd3'
import React from 'react'

import Histogram from './Histogram'
import Svg from './Svg'

export default class App extends React.Component {
  state = {
    data: [1, 2, 10, 4, 20],
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        data: d3.range(Math.random() * 300).map(() => Math.random() * 200),
      })
    }, 1500)
  }

  render() {
    return (
      <Svg width={1000} height={300}>
        <Histogram data={this.state.data} width={1000} height={300}/>
      </Svg>
    )
  }
}
