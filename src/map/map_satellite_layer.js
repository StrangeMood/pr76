import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import cn from 'classnames'
import request from 'superagent'

import { once } from 'ramda'

import MapIcon from '../icons/map.svg'

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

  state = { satellite: false, disabled: true }

  componentDidMount() {
    this.context.map.on('load', () => this.setState({ disabled: false }))
  }

  switchToSatellite = async () => {
    this.setState({ satellite: true })
    this.baseStyle = this.context.map.getStyle()

    this.context.map.setStyle({ version: 8, sources: {}, layers: [] })

    const sourceConfig = await requestBingMapOptions()

    this.context.map.setStyle({
      version: 8,
      sources: { bing: sourceConfig },
      layers: [{
        id: 'satellite',
        type: 'raster',
        source: 'bing',
        minzoom: 0,
        maxzoom: 17,
      }],
    })
  }

  switchToBase = () => {
    this.setState({ satellite: false })
    this.context.map.setStyle(this.baseStyle)
  }

  render() {
    const { disabled, satellite } = this.state

    const control = createPortal(
      <button
        disabled={disabled}
        className={cn('map-satellite-layer_switch', { '-active': satellite })}
        onClick={satellite ? this.switchToBase : this.switchToSatellite}
        title={satellite ? 'Satellite' : 'Street'}
        >
        <MapIcon className="icon" />
      </button>,
      this.context.controls
    )

    return control
  }
}

export default MapSatelliteLayer
