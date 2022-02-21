import React, { Component } from 'react';
import PretestStepper from '../components/PretestStepper';
import './PretestPanel.css';

class PretestPanel extends Component {

  render() {
    const innerHeight = window.innerHeight
    const menuHeight = 70
    const maxHeight = innerHeight - menuHeight

    return(
      <div style={{ padding: '0 24px', maxHeight: maxHeight, overflow: 'scroll' }}>
        <PretestStepper />
      </div>
    )
  }
}

export default PretestPanel;