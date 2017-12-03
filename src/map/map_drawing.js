import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { addPoint } from './map_actions'

class MapDrawing extends Component {
  static propTypes = {
    addPoint: PropTypes.func.isRequired,
  }

  static contextTypes = { map: PropTypes.object.isRequired }

  componentDidMount() {
    const map = this.context.map

    map.on('load', () => {
      map.on('click', (e) => { this.props.addPoint(e.lngLat) })
    })
  }

  render() {
    return <div />
  }
}

export default connect(
  createStructuredSelector({}),
  { addPoint }
)(MapDrawing)
