const React = require('react')
const ReactDOM = require('react-dom')

class Counter extends React.Component {
  constructor() {
    super()
    this.state = {
      count: 0
    }
  }

  componentDidMount() {
    this._loadStateFromServer()
  }

  _addOne() {
    this.setState(
      prevState => ({count: prevState.count + 1}),
      () => this._uploadStateToServer())
  }

  _loadStateFromServer() {
    fetch('/api/count')
    .then(res => res.json())
    .then(data => this.setState({count: data.count}))
    .catch(console.error)
  }

  _uploadStateToServer() {
    fetch('/api/count', {
      method: 'POST',
      body: JSON.stringify({count: this.state.count}),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
    .catch(console.error)
  }

  render() {
    return (
      <div>
        <p>{this.state.count}</p>
        <button onClick={() => this._addOne()}>Add One</button>
      </div>
    )
  }
}

ReactDOM.render(<Counter />, document.getElementById('root'))
