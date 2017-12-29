import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { createSelector } from 'reselect'
import rndstr from 'randomatic'
import { evolve, identity, append, pipe, map, prop, findIndex, update, propEq, remove, init, tail, zip,
  insert } from 'ramda'

import RouteIcon from '../icons/route.svg'
import { MAP_BASE_STYLE } from './map_actions'

const EMPTY_GEO_JSON = { type: 'Point', coordinates: [] }
const EMPTY_GEO_JSON_SOURCE = { type: 'geojson', data: EMPTY_GEO_JSON }

const routeLineSelector = createSelector(
  identity,
  pipe(
    map(prop('coordinates')),
    coordinates => ({ type: 'Feature', geometry: { type: 'LineString', coordinates } })
  )
)

const routePointsSelector = createSelector(
  identity,
  pipe(
    map(point => ({
      type: 'Feature',
      properties: { id: point.id },
      geometry: { type: 'Point', coordinates: point.coordinates },
    })),
    features => ({ type: 'FeatureCollection', features })
  )
)

const routeMidpointsSelector = createSelector(
  identity,
  pipe(
    points => zip(init(points), tail(points)),
    map(([start, end]) => {
      const feature = turf.midpoint(turf.point(start.coordinates), turf.point(end.coordinates))
      feature.properties = {
        id: rndstr(5),
        afterId: start.id,
      }
      return feature
    }),
    features => ({ type: 'FeatureCollection', features })
  )
)

// const routeLengthSelector = createSelector(
//   routeLineSelector,
//   linestring => turf.lineDistance(linestring)
// )

class MapRouteDrawingLayer extends Component {
  static contextTypes = { map: PropTypes.object.isRequired, controls: PropTypes.object.isRequired }

  static propTypes = {
    route: PropTypes.array,
    baseStyle: PropTypes.string,
    onDraw: PropTypes.func,
  }

  static defaultProps = {
    baseStyle: MAP_BASE_STYLE.ROAD,
    onDraw: () => {},
    route: [],
  }

  state = {
    adding: false,
    route: this.props.route,
  }

  componentDidMount() {
    const gmap = this.context.map
    const canvas = gmap.getCanvas()

    gmap.on('load', () => {
      gmap.addSource('route-line-feature', EMPTY_GEO_JSON_SOURCE)
      gmap.addSource('route-points-feature', EMPTY_GEO_JSON_SOURCE)
      gmap.addSource('route-midpoints-feature', EMPTY_GEO_JSON_SOURCE)

      gmap.addLayer({
        'id': 'route-line',
        'type': 'line',
        'source': 'route-line-feature',
        'paint': {
          'line-color': '#43AA8B',
          'line-width': 2,
        },
      })

      gmap.addLayer({
        'id': 'route-points',
        'type': 'circle',
        'source': 'route-points-feature',
        'paint': {
          'circle-radius': 6,
          'circle-color': '#fff',
          'circle-stroke-color': '#43AA8B',
          'circle-stroke-width': 2,
        },
      })

      gmap.addLayer({
        'id': 'route-midpoints',
        'type': 'circle',
        'source': 'route-midpoints-feature',
        'paint': {
          'circle-radius': 3,
          'circle-color': '#43AA8B',
        },
      })

      gmap.addLayer({
        'id': 'route-points-last',
        'type': 'circle',
        'source': 'route-points-feature',
        'paint': {
          'circle-radius': 7,
          'circle-color': '#B2B09B',
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 1,
        },
        'filter': ['==', 'id', ''],
      })

      gmap.addLayer({
        'id': 'route-points-hover',
        'type': 'circle',
        'source': 'route-points-feature',
        'paint': {
          'circle-radius': 8,
          'circle-color': '#47cdac',
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 1,
        },
        'filter': ['==', 'id', ''],
      })

      gmap.addLayer({
        'id': 'route-midpoints-hover',
        'type': 'circle',
        'source': 'route-midpoints-feature',
        'paint': {
          'circle-radius': 4,
          'circle-color': '#47cdac',
        },
        'filter': ['==', 'id', ''],
      })

      gmap.on('click', 'route-points-hover', (e) => {
        e.originalEvent.preventDraw = true
      })
      gmap.on('click', 'route-midpoints-hover', (e) => {
        e.originalEvent.preventDraw = true
      })

      gmap.on('dblclick', 'route-points-hover', (e) => {
        e.originalEvent.preventDraw = true
        const id = e.features[0].properties.id
        const index = findIndex(propEq('id', id), this.state.route)
        this.setState(evolve({ route: remove(index, 1) }))
      })

      gmap.on('click', (e) => {
        if (!this.state.adding) return null
        if (e.originalEvent.preventDraw) return null

        this.setState(evolve({ route: append({ id: rndstr(5), coordinates: [e.lngLat.lng, e.lngLat.lat] }) }))
      })

      gmap.on('mouseenter', 'route-points', (e) => {
        canvas.style.cursor = 'pointer'
        gmap.setFilter('route-points-hover', ['==', 'id', e.features[0].properties.id])
      })
      gmap.on('mouseleave', 'route-points', () => {
        canvas.style.cursor = 'pointer'
        gmap.setFilter('route-points-hover', ['==', 'id', ''])
      })
      gmap.on('mouseenter', 'route-midpoints', (e) => {
        canvas.style.cursor = 'pointer'
        gmap.setFilter('route-midpoints-hover', ['==', 'id', e.features[0].properties.id])
      })
      gmap.on('mouseleave', 'route-midpoints', () => {
        canvas.style.cursor = ''
        gmap.setFilter('route-midpoints-hover', ['==', 'id', ''])
      })
      gmap.on('mousedown', 'route-points', (e) => {
        gmap.dragPan.disable()
        const id = e.features[0].properties.id

        const onMove = (me) => {
          const index = findIndex(propEq('id', id), this.state.route)
          this.setState(evolve({ route: update(index, { id, coordinates: [me.lngLat.lng, me.lngLat.lat] }) }))
        }

        gmap.on('mousemove', onMove)
        gmap.once('mouseup', () => {
          gmap.dragPan.enable()
          gmap.off('mousemove', onMove)
        })
      })
      gmap.on('mousedown', 'route-midpoints', (e) => {
        gmap.dragPan.disable()
        const id = e.features[0].properties.id
        const afterId = e.features[0].properties.afterId

        const iindex = findIndex(propEq('id', afterId), this.state.route)
        this.setState(evolve({ route: insert(iindex + 1, { id, coordinates: [e.lngLat.lng, e.lngLat.lat] }) }))

        const onMove = (me) => {
          const uindex = findIndex(propEq('id', id), this.state.route)
          this.setState(evolve({ route: update(uindex, { id, coordinates: [me.lngLat.lng, me.lngLat.lat] }) }))
        }

        gmap.on('mousemove', onMove)
        gmap.once('mouseup', () => {
          gmap.dragPan.enable()
          gmap.off('mousemove', onMove)
        })
      })

      this.adjustRoute(this.state.route, this.state.adding)
      this.adjustStyle(this.props)
    })
  }

  componentWillReceiveProps(nextProps) {
    this.adjustStyle(nextProps)
    this.setState({ route: nextProps.route })
  }

  componentWillUpdate(nextProps, nextState) {
    this.adjustRoute(nextState.route, nextState.adding)
  }

  onToggleAdding = () => {
    this.setState({ adding: !this.state.adding }, () => {
      const gmap = this.context.map

      if (this.state.adding) {
        gmap.getCanvas().style.cursor = 'default'
      } else {
        gmap.getCanvas().style.cursor = ''
      }
    })
  }

  adjustRoute = (route, adding = false) => {
    this.context.map.getSource('route-line-feature').setData(routeLineSelector(route))
    this.context.map.getSource('route-points-feature').setData(routePointsSelector(route))
    this.context.map.getSource('route-midpoints-feature').setData(routeMidpointsSelector(route))
    this.context.map.setFilter(
      'route-points-last',
      ['==', 'id', route.length && adding ? route[route.length - 1].id : '']
    )
  }

  adjustStyle = (props) => {
    const gmap = this.context.map
    const isDark = props.baseStyle === MAP_BASE_STYLE.SATELLITE
    gmap.setPaintProperty('route-line', 'line-color', isDark ? '#fff' : '#43AA8B')
    gmap.setPaintProperty('route-points', 'circle-color', isDark ? '#43AA8B' : '#fff')
    gmap.setPaintProperty('route-points', 'circle-stroke-color', isDark ? '#fff' : '#43AA8B')
    gmap.setPaintProperty('route-midpoints', 'circle-color', isDark ? '#fff' : '#43AA8B')
  }

  render() {
    const { adding } = this.state

    const control = createPortal(
      <button
        className={cn('map-route-drawing_switch', { '-active': adding })}
        onClick={this.onToggleAdding}
      >
        <RouteIcon />
      </button>,
      this.context.controls
    )

    return control
  }
}

export default MapRouteDrawingLayer
