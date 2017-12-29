import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import cn from 'classnames'
import request from 'superagent'

import { once } from 'ramda'

import MapIcon from '../icons/map.svg'
import { MAP_BASE_STYLE } from './map_actions'

const requestBingMapOptions = once(async () => {
  const BING_CONF_URL =
    `https://dev.virtualearth.net/REST/v1/Imagery/Metadata/AerialWithLabels?key=${process.env.BINGMAPS_API_KEY}`
  const bingResponse = await request.get(BING_CONF_URL)
  const config = bingResponse.body.resourceSets[0].resources[0]

  return {
    type: 'raster',
    tileSize: config.imageHeight,
    maxzoom: 17,
    tiles: config.imageUrlSubdomains.map(domain =>
      config.imageUrl
        .replace(/http(s)?:/, '')
        .replace(/{subdomain}/, domain)
        .replace(/{culture}/, window.navigator.language)),
  }
})

class MapSatelliteLayer extends Component {
  static contextTypes = { map: PropTypes.object.isRequired, controls: PropTypes.object.isRequired }

  static propTypes = {
    baseStyle: PropTypes.oneOf([MAP_BASE_STYLE.ROAD, MAP_BASE_STYLE.SATELLITE]).isRequired,
    setBaseStyle: PropTypes.func.isRequired,
  }

  state = { disabled: true }

  componentDidMount() {
    const gmap = this.context.map

    gmap.on('load', async () => {
      this.baseLayers = gmap.getStyle().layers.map(l => l.id)

      const sourceConfig = await requestBingMapOptions()

      gmap.addSource('bing', sourceConfig)
      gmap.addLayer({
        id: 'satellite',
        type: 'raster',
        source: 'bing',
        minzoom: 0,
        maxzoom: 17,
        layout: { visibility: 'none' },
      }, this.baseLayers[1])

      this.switchBaseStyle(this.props.baseStyle)

      this.setState({ disabled: false })
    })
  }

  componentWillReceiveProps(nextProps) {
    this.switchBaseStyle(nextProps.baseStyle)
  }

  onSwitchPress = () => {
    this.props.setBaseStyle(this.props.baseStyle === MAP_BASE_STYLE.ROAD ?
      MAP_BASE_STYLE.SATELLITE : MAP_BASE_STYLE.ROAD)
  }

  switchBaseStyle = (style) => {
    const gmap = this.context.map
    this.baseLayers.forEach((layer) => {
      gmap.setLayoutProperty(layer, 'visibility', style === MAP_BASE_STYLE.ROAD ? 'visible' : 'none')
    })
    gmap.setLayoutProperty('satellite', 'visibility', style === MAP_BASE_STYLE.SATELLITE ? 'visible' : 'none')
  }

  render() {
    const { disabled } = this.state
    const satellite = this.props.baseStyle === MAP_BASE_STYLE.SATELLITE

    const control = createPortal(
      <button
        disabled={disabled}
        className={cn('map-satellite-layer_switch', { '-active': satellite })}
        onClick={this.onSwitchPress}
        title={satellite ? 'Satellite' : 'Street'}
        >
        <MapIcon />
      </button>,
      this.context.controls
    )

    return control
  }
}

export default MapSatelliteLayer
