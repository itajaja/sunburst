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

const ROOT_ID = '@@root';
const PLOT_KEY = '@@plot';

const stratifier = stratify()
  .parentId(({ id }) => (
    id === ROOT_ID ? null : id.substring(0, id.lastIndexOf(';')) || ROOT_ID
  ));

export default class App extends React.Component {
  state = {
    datasetIndex: 0,
    useHasReads: false,
    jagged: false,
  };

  onClickChangeDataset = () => {
    this.setState({
      datasetIndex: (this.state.datasetIndex + 1) % DATASETS.length,
    });
  };

  onClickChangeMeasure = () => {
    this.setState({ useHasReads: !this.state.useHasReads });
  };

  onClickToggleJagged = () => {
    this.setState({ jagged: !this.state.jagged });
  };

  getData() {
    const { datasetIndex, useHasReads } = this.state;
    const dataset = DATASETS[datasetIndex];

    const datasetParsed = dataset.map(([numReads, key, id]) => ({
      id,
      key: parseInt(key, 10),
      numReads: parseInt(numReads, 10),
    }));

    let getValue;

    if (useHasReads) {
      // The spring behavior is a bit odd if I use 1 as the value here.
      let totalNumReads = 0;
      let numTaxaWithReads = 0;

      datasetParsed.forEach(({ numReads }) => {
        if (numReads > 0) {
          totalNumReads += numReads;
          ++numTaxaWithReads;
        }
      });

      const meanNumReads = numTaxaWithReads ?
        totalNumReads / numTaxaWithReads : 1;

      getValue = ({ numReads }) => (numReads > 0 ? meanNumReads : 0);
    } else {
      getValue = ({ numReads }) => numReads;
    }

    datasetParsed.push({ id: ROOT_ID, key: -1, numReads: 0 });

    // We need to stratify and sum before applying the transition to ensure
    // that parents don't transition out before their children do, especially
    // for zero-read parents.
    const root = stratifier(datasetParsed)
      .sort((a, b) => (b.data.key - a.data.key))
      .sum(getValue);

    const nodes = root.descendants()
      .map(({ id, data, parent, value }) => ({
        id,
        key: data.key,
        parentId: parent && parent.id,
        value,
      }));

    return { nodes, maxDepth: root.height };
  }

  getStyles() {
    const { nodes, maxDepth } = this.getData();

    const styles = nodes.map(node => ({
      key: node.key.toString(),
      data: node,
      style: { value: spring(node.value) },
    }));

    styles.push({
      key: PLOT_KEY,
      style: {
        maxDepth: spring(maxDepth),
        jagged: spring(this.state.jagged ? 1 : 0),
      },
    });

    return styles;
  }

  renderStyles = (styles) => {
    const { maxDepth, jagged } = styles.pop().style;

    return (
      <Sunburst
        nodes={styles.map(({ data, style }) => ({
          ...data,
          ...style,
        }))}
        maxDepth={maxDepth}
        jagged={jagged}
        width={960}
        height={700}
      />
    );
  };

  render() {
    return (
      <div>
        <button onClick={this.onClickChangeDataset}>
          Change dataset
        </button>
        <button onClick={this.onClickChangeMeasure}>
          Change measure
        </button>
        <button onClick={this.onClickToggleJagged}>
          Toggle jagged
        </button>

        <svg width={960} height={700}>
          <TransitionMotion
            styles={this.getStyles()}
            willLeave={() => ({ value: spring(0) })}
            willEnter={() => ({ value: 0 })}
          >
            {this.renderStyles}
          </TransitionMotion>
        </svg>
      </div>
    );
  }
}
