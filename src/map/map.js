import React, { Component } from 'react'
import PropTypes from 'prop-types'

mapboxgl.accessToken = process.env.MAPBOX_API_KEY

class Map extends Component {
  static propTypes = {
    children: PropTypes.node,
  }

  static childContextTypes = { map: PropTypes.object }

  state = { map: null }

  getChildContext() {
    return { map: this.state.map }
  }

  componentDidMount() {
    this.setState({
      map: new mapboxgl.Map({
        container: this.mapNode,
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [50.22, 53.24],
        zoom: 12,
        maxZoom: 18,
      }),
    })
  }

  render() {
    return <div className="map" ref={(el) => { this.mapNode = el }}>{this.state.map && this.props.children}</div>
  }
}

export default Map
