import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import MapSatelliteLayer from './map_satellite_layer'
import MapRouteDrawingLayer from './map_route_drawing_layer'

import PlusIcon from '../icons/plus.svg'
import MinusIcon from '../icons/minus.svg'

import { setBaseStyle } from './map_actions'
import { mapBaseStyleSelector } from './map_selectors'

mapboxgl.accessToken = process.env.MAPBOX_API_KEY

export const MAX_ZOOM = 16

class Map extends Component {
  static propTypes = {
    children: PropTypes.node,
    baseStyle: PropTypes.string.isRequired,
    setBaseStyle: PropTypes.func.isRequired,
  }

  static childContextTypes = { map: PropTypes.object, controls: PropTypes.object }

  state = { map: null }

  getChildContext() {
    return { map: this.state.map, controls: this.controls }
  }
  componentDidMount() {
    const map = new mapboxgl.Map({
      container: this.container,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [50.22, 53.24],
      zoom: 12,
      maxZoom: MAX_ZOOM,
    })

    map.doubleClickZoom.disable()

    this.setState({ map })
  }

  onZoomIn = () => this.state.map.zoomIn()
  onZoomOut = () => this.state.map.zoomOut()

  render() {
    const { baseStyle } = this.props

    return (
      <div className="map">
        <div className="map_container" ref={(el) => { this.container = el }} />
        {this.state.map && <MapSatelliteLayer setBaseStyle={this.props.setBaseStyle} baseStyle={baseStyle} />}
        {this.state.map && <MapRouteDrawingLayer baseStyle={baseStyle} />}
        {this.state.map && this.props.children}

        <div className="map-controls" ref={(node) => { this.controls = node }}>
          <button className="map-controls_zoomin-item" title="Zoom In" onClick={this.onZoomIn}>
            <PlusIcon />
          </button>
          <button className="map-controls_zoomout-item" title="Zoom Out" onClick={this.onZoomOut}>
            <MinusIcon />
          </button>
        </div>
      </div>
    )
  }
}

export default connect(
  createStructuredSelector({
    baseStyle: mapBaseStyleSelector,
  }),
  { setBaseStyle }
)(Map)
