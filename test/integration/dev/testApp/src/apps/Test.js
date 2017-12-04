import React from 'react';

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: 'hi' };
  }

  componentDidMount() {
    window.setTimeout(() => {
      this.setState({ text: 'hello' });
    }, 100);
  }

  async handleClick() {
    await new Promise((resolve) => {
      resolve();
      this.setState({ text: 'world' });
    });
  }

  render() {
    return (
      <div>
        <button className="test-button" onClick={() => this.handleClick()}>
          { this.state.text }
        </button>
      </div>
    );
  }
}
