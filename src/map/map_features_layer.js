import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { projectFeaturesSelector } from './map_selectors'

class MapFeaturesLayer extends Component {
  static propTypes = {
    features: PropTypes.object.isRequired,
  }

  static contextTypes = { map: PropTypes.object.isRequired }

  componentDidMount() {
    const map = this.context.map

    map.on('load', () => {
      map.addSource('features', {
        type: 'geojson',
        data: this.props.features,
      })

      map.addLayer({
        id: 'features',
        type: 'circle',
        source: 'features',
        paint: {
          'circle-radius': { base: 1.75, stops: [[12, 4], [22, 180]] },
          'circle-color': '#FF4500',
        },
      })

      map.on('click', 'features', (e) => {
        console.log(e.features)
        e.originalEvent.stopPropagation()
      })

      // Change the cursor to a pointer when the mouse is over the states layer.
      map.on('mouseenter', 'features', () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      // Change it back to a pointer when it leaves.
      map.on('mouseleave', 'features', () => {
        map.getCanvas().style.cursor = ''
      })
    })
  }

  componentDidUpdate() {
    this.context.map.getSource('features').setData(this.props.features)
  }

  render() {
    return <div />
  }
}

export default connect(
  createStructuredSelector({
    features: projectFeaturesSelector,
  }),
  null
)(MapFeaturesLayer)
