import React from 'react'

import Sunburst from './Sunburst'
import Svg from './Svg'
import data1 from './krona1'
import data2 from './krona2'

const valueFuncs = [
  () => 1,
  ({ size }) => size,
]

export default class App extends React.Component {
  state = {
    data: data1,
    root: data1,
    valueFunc: 0,
  }

  onToggleSize = () => {
    const { valueFunc } = this.state
    this.setState({ valueFunc: (valueFunc + 1) % valueFuncs.length })
  }

  onSliceClick = root => {
    console.log('setting root', root)
    this.setState({ root })
  }

  onChangeDataset = () => {
    this.setState({ data: this.state.data === data1 ? data2 : data1 })
  }

  // componentDidMount() {
  //   setInterval(() => {
  //     this.setState({
  //       data: d3.range(Math.random() * 300).map(() => Math.random() * 200),
  //     })
  //   }, 1500)
  // }

  render() {
    const { valueFunc, data, root } = this.state
    return (
      <div>
        <button onClick={this.onToggleSize}>
          toggle measure
        </button>
        <button onClick={this.onChangeDataset}>
          change dataset
        </button>
        <button onClick={() => this.onSliceClick(data)}>
          reset root
        </button>
        <Svg width={960} height={700}>
          <Sunburst
            data={data}
            width={960}
            height={700}
            valueFunc={valueFuncs[valueFunc]}
            onSliceClick={this.onSliceClick}
            root={root}
          />
        </Svg>
      </div>
    )
  }
}
