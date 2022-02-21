import React, { Component } from 'react';
import Router from './router'

import { AppWrapper } from './components/UserContext'

class App extends Component {
  render() {
    return (
      <AppWrapper>
        <Router/ >
      </AppWrapper>
    )
  }
}

export default App;