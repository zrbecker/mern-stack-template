class Counter {
  constructor(syncInterval) {
    this._countServer = 0
    this._countUnprocessed = 0
    this._countProcessing = 0

    this._syncInterval = syncInterval
    this._lastSynced = new Date()
    this._syncInProgress = false
    this._resetInProgress = false

    this._nextCallbackId = 0
    this._callbacks = {}

    this._sync({force: true})
    setInterval(() => this._sync(), this._syncInterval)
  }

  get count() {
    return this._countServer + this._countUnprocessed + this._countProcessing
  }

  addToCount(count) {
    if (typeof count === 'number') {
      this._updateCounts({countUnprocessed: this._countUnprocessed + count})
      this._sync()
    } else {
      throw {message: `"count" must be a number. Saw: ${count}`}
    }
  }

  resetCount() {
    this._sync({force: true, reset: true})
  }

  addListener(callback) {
    this._callbacks[this._nextCallbackId] = callback
    return this._nextCallbackId++
  }

  removeListener(callbackId) {
    delete this._callbacks[callbackId]
  }

  _updateCounts(counts) {
    if (this._resetInProgress) {
      return
    }
    if (typeof counts.countServer === 'number') {
      this._countServer = counts.countServer
    }
    if (typeof counts.countUnprocessed === 'number') {
      this._countUnprocessed = counts.countUnprocessed
    }
    if (typeof counts.countProcessing === 'number') {
      this._countProcessing = counts.countProcessing
    }
    Object.keys(this._callbacks).forEach(id => this._callbacks[id](this.count))
  }

  async _sync(options) {
    const force = options ? options.force : null
    const reset = options ? options.reset : null

    const now = new Date()
    if (force || (!this._syncInProgress && now - this._lastSynced >= this._syncInterval)) {
      this._lastSynced = now
      this._syncInProgress = true

      try {
        if (reset) {
          await this._syncReset()
        } else if (this._countUnprocessed > 0) {
          await this._syncIncrement()
        } else {
          await this._syncGet()
        }
      } catch (err) {
        console.error('Unexpected:', err)
      }

      this._syncInProgress = false
    }
  }

  async _syncGet() {
    const response = await fetch('/api/count')
    if (!response.ok) {
      throw response
    }
    const data = await response.json()
    this._updateCounts({countServer: data.count})
  }

  async _syncIncrement() {
    const increment = this._countUnprocessed
    this._updateCounts({
      countUnprocessed: 0,
      countProcessing: this._countProcessing + increment
    })

    const response = await fetch('/api/count', {
      method: 'PUT',
      body: JSON.stringify({increment}),
      headers: new Headers({'Content-Type': 'application/json'})
    })
    if (!response.ok) {
      throw response
    }
    const data = await response.json()
    this._updateCounts({
      countProcessing: this._countProcessing - increment,
      countServer: data.count
    })
  }

  async _syncReset() {
    this._updateCounts({
      countProcessing: 0,
      countUnprocessed: 0,
      countServer: 0
    })
    this._resetInProgress = true
    try {
      const response = await fetch('/api/count', {
        method: 'PUT',
        body: JSON.stringify({reset: true}),
        headers: new Headers({'Content-Type': 'application/json'})
      })
      if (!response.ok) {
        throw response
      }
    } finally {
      this._resetInProgress = false
    }
  }
}

module.exports = Counter
