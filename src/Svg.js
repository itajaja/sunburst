import React from 'react'

// TODO: width and height should be passed down as context
export default class Svg extends React.Component {
  static propTypes = {
  };

  render() {
    return (
      <svg {...this.props} />
    )
  }
}
