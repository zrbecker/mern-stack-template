const React = require('react')
const ReactDOM = require('react-dom')
const Counter = require('./counter')

class CounterComponent extends React.Component {
  constructor() {
    super()
    this.state = {
      count: 0
    }
    this.counter = new Counter(100)
    this.counter.addListener(count => this._countListener(count))
  }

  _countListener(count) {
    this.setState({count})
  }

  _addOne() {
    this.counter.addToCount(1)
  }

  _reset() {
    this.counter.resetCount()
  }

  render() {
    return (
      <div>
        <p>{this.state.count}</p>
        <button onClick={() => this._addOne()}>Add One</button>
        <button onClick={() => this._reset()}>Reset</button>
      </div>
    )
  }
}

ReactDOM.render(<CounterComponent />, document.getElementById('root'))
