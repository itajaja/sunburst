import React from 'react'

import Sunburst from './Sunburst'
import Svg from './Svg'

import d0 from './data/data_0.1.report.summary.kraken'
import d1 from './data/data_0.2.report.summary.kraken'
import d2 from './data/data_0.3.report.summary.kraken'
import d3 from './data/data_0.4.report.summary.kraken'
import d4 from './data/data_0.5.report.summary.kraken'
import d5 from './data/data_0.6.report.summary.kraken'
import d6 from './data/data_0.7.report.summary.kraken'
import d7 from './data/data_0.8.report.summary.kraken'
import d8 from './data/data_0.9.report.summary.kraken'
import d9 from './data/data_1.0.report.summary.kraken'
import parseTaxonomy from './parseTaxonomy'

const dataList = [d9, d0, d1, d2, d3, d4, d5, d6, d7, d8]

const valueFuncs = [
  ({ numReads }) => numReads,
  ({ children }) => children ? 0 : 1,
]

export default class App extends React.Component {
  state = {
    dataIndex: 0,
    valueFunc: 0,
  }

  onToggleSize = () => {
    const { valueFunc } = this.state
    this.setState({ valueFunc: (valueFunc + 1) % valueFuncs.length })
  }

  onSliceClick = root => {
    this.setState({ root })
  }

  onChangeDataset = () => {
    this.setState({ dataIndex: (this.state.dataIndex + 1) % dataList.length })
  }

  onToggleJagged = () => {
    this.setState({ jagged: !this.state.jagged })
  }

  // componentDidMount() {
  //   setInterval(() => {
  //     this.setState({
  //       data: d3.range(Math.random() * 300).map(() => Math.random() * 200),
  //     })
  //   }, 1500)
  // }

  render() {
    const { valueFunc, dataIndex, root, jagged } = this.state
    return (
      <div>
        <button onClick={this.onToggleSize}>
          toggle measure
        </button>
        <button onClick={this.onChangeDataset}>
          change dataset
        </button>
        <button onClick={() => this.onSliceClick()}>
          reset root
        </button>
        <button onClick={this.onToggleJagged}>
          toggle jagged
        </button>
        <Svg width={960} height={700}>
          <Sunburst
            data={parseTaxonomy(dataList[dataIndex])}
            width={960}
            height={700}
            valueFunc={valueFuncs[valueFunc]}
            onSliceClick={this.onSliceClick}
            root={root}
            jagged={jagged}
          />
        </Svg>
      </div>
    )
  }
}
