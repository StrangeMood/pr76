import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Link } from 'react-router-dom'

import { subscribeProjects, requestCreateProject, requestLeaveProject } from './projects_actions'
import { projectsAreFetchingSelector, projectsSelector } from './projects_selectors'

class Projects extends Component {
  static propTypes = {
    projects: PropTypes.array.isRequired,
    areFetching: PropTypes.bool.isRequired,
    subscribeProjects: PropTypes.func.isRequired,
    requestCreateProject: PropTypes.func.isRequired,
    requestLeaveProject: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.subscribeProjects()
  }

  onCreate = () => this.props.requestCreateProject()

  onRemove = project => this.props.requestLeaveProject(project)

  render() {
    const { projects, areFetching } = this.props

    return (
      <div className="project-sidebar">
        <h1>PROJECTS</h1>
        {areFetching ? (
          <div>FETCHING...</div>
        ) : (
          <div>
            <ul>
              {projects.map(pr => (
                <li key={pr.id}>
                  <Link to={`/${pr.id}`}>{pr.name}</Link>
                  <button onClick={this.onRemove.bind(null, pr)}>LEAVE</button>
                </li>
              ))}
            </ul>
            <button onClick={this.onCreate}>CREATE PROJECT</button>
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  createStructuredSelector({
    projects: projectsSelector,
    areFetching: projectsAreFetchingSelector,
  }),
  { subscribeProjects, requestCreateProject, requestLeaveProject }
)(Projects)
