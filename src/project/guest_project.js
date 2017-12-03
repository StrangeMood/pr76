import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { requestJoinProject } from '../projects/projects_actions'
import { projectSelector } from './project_selectors'
import { currentUserSelector } from '../auth/auth_selectors'

import Map from '../map/map'
import MapFeaturesLayer from '../map/map_features_layer'

class GuestProject extends Component {
  static propTypes = {
    project: PropTypes.object,
    currentUser: PropTypes.object,
    requestJoinProject: PropTypes.func.isRequired,
  }

  onJoin = () => this.props.requestJoinProject(this.props.project)

  render() {
    const { project, currentUser } = this.props

    return (
      <div className="container">
        <div className="project-sidebar">
          <h1>{project.name} [GUEST]</h1>
          <div>
            <h3>COLLABORATORS {currentUser && <button onClick={this.onJoin}>JOIN</button>}</h3>
            <div>
              {Object.values(project.collaborators || {}).map(user =>
                (<img key={user.id} className={cn('project_collaborator -no-presence')}
                  src={user.photoUrl} alt={user.name} height="30" width="30" />))}
            </div>
          </div>
        </div>
        <Map key="map">
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
  { requestJoinProject }
)(GuestProject)
