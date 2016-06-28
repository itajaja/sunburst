import { stratify } from 'd3-hierarchy';
import React from 'react';
import { spring, TransitionMotion } from 'react-motion';

import Sunburst from './Sunburst';

import d0 from './data/data_0.1.report.summary.kraken';
import d1 from './data/data_0.2.report.summary.kraken';
import d2 from './data/data_0.3.report.summary.kraken';
import d3 from './data/data_0.4.report.summary.kraken';
import d4 from './data/data_0.5.report.summary.kraken';
import d5 from './data/data_0.6.report.summary.kraken';
import d6 from './data/data_0.7.report.summary.kraken';
import d7 from './data/data_0.8.report.summary.kraken';
import d8 from './data/data_0.9.report.summary.kraken';
import d9 from './data/data_1.0.report.summary.kraken';

const DATASETS = [d9, d0, d1, d2, d3, d4, d5, d6, d7, d8];
const ROOT = '@@root';

const stratifier = stratify()
  .parentId(({ id }) => (
    id === ROOT ? null : id.substring(0, id.lastIndexOf(';')) || ROOT
  ));

export default class App extends React.Component {
  state = {
    datasetIndex: 0,
    useHasReads: false,
  };

  onClickChangeDataset = () => {
    this.setState({
      datasetIndex: (this.state.datasetIndex + 1) % DATASETS.length,
    });
  };

  onClickChangeMeasure = () => {
    this.setState({ useHasReads: !this.state.useHasReads });
  };

  getData() {
    const { datasetIndex, useHasReads } = this.state;
    const dataset = DATASETS[datasetIndex];

    const datasetParsed = dataset.map(([numReads, key, id]) => ({
      id,
      key: parseInt(key, 10),
      numReads: parseInt(numReads, 10),
    }));

    datasetParsed.push({ id: ROOT, key: -1, numReads: 0 });

    const root = stratifier(datasetParsed)
      .sort((a, b) => (b.data.key - a.data.key))
      .sum(useHasReads ?
        ({ numReads }) => Number(numReads > 0) :
        ({ numReads }) => numReads
      );

    const nodes = root.descendants().map(({ id, data, parent, value }) => ({
      id,
      key: data.key,
      parentId: parent && parent.id,
      value,
    }));

    return { nodes, height: root.height };
  }

  render() {
    const { nodes } = this.getData();

    return (
      <div>
        <button onClick={this.onClickChangeDataset}>
          Change dataset
        </button>
        <button onClick={this.onClickChangeMeasure}>
          Change measure
        </button>

        <svg width={960} height={700}>
          <TransitionMotion
            styles={nodes.map(node => ({
              key: node.key.toString(),
              data: node,
              style: { value: spring(node.value) },
            }))}
            willLeave={() => ({ value: spring(0) })}
            willEnter={() => ({ value: 0 })}
          >
            {styles => (
              <Sunburst
                nodes={styles.map(({ data, style }) => ({
                  ...data,
                  ...style,
                }))}
                width={960}
                height={700}
              />
            )}
          </TransitionMotion>
        </svg>
      </div>
    );
  }
}
