import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { requestLeaveProject } from '../projects/projects_actions'
import { setProjectPresence } from './project_actions'
import { projectSelector } from './project_selectors'
import { currentUserSelector } from '../auth/auth_selectors'
import Map from '../map/map'
import MapDrawing from '../map/map_drawing'
import MapFeaturesLayer from '../map/map_features_layer'

class Project extends Component {
  static propTypes = {
    project: PropTypes.object,
    currentUser: PropTypes.object.isRequired,
    setProjectPresence: PropTypes.func.isRequired,
    requestLeaveProject: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.setProjectPresence(this.props.project, true)
  }

  componentWillUnmount() {
    this.props.setProjectPresence(this.props.project, false)
  }

  onLeave = () => { this.props.requestLeaveProject(this.props.project) }

  render() {
    const { project } = this.props

    return (
      <div className="container">
        <div className="project-sidebar">
          <h1>{project.name}</h1>
          <div>
            <h3>COLLABORATORS <button onClick={this.onLeave}>LEAVE</button></h3>
            <div>
              {Object.values(project.collaborators || {}).map(user =>
                (<img key={user.id} className={cn('project_collaborator', { '-online': !!user.online })}
                  src={user.photoUrl} alt={user.name} height="30" width="30" />))}
            </div>
          </div>
        </div>
        <Map key="map">
          <MapDrawing />
          <MapFeaturesLayer />
        </Map>
      </div>
    )
  }
}

export default connect(
  createStructuredSelector({
    currentUser: currentUserSelector,
    project: projectSelector,
  }),
  { setProjectPresence, requestLeaveProject }
)(Project)
