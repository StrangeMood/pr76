import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import Project from './project'
import GuestProject from './guest_project'

import { subscribeProject, unsubscribeProject, setProject } from './project_actions'
import { isGuestProjectSelector, projectIsLoadingSelector } from './project_selectors'

class ProjectWrapper extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    isGuest: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    subscribeProject: PropTypes.func.isRequired,
    unsubscribeProject: PropTypes.func.isRequired,
    setProject: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.subscribeProject({ id: this.props.match.params.id })
  }

  componentWillUnmount() {
    this.props.unsubscribeProject({ id: this.props.match.params.id })
    this.props.setProject(null)
  }

  render() {
    const { isGuest, isLoading } = this.props

    if (isLoading) return <div>LOADING...</div>

    return isGuest ? <GuestProject /> : <Project />
  }
}

export default connect(
  createStructuredSelector({
    isGuest: isGuestProjectSelector,
    isLoading: projectIsLoadingSelector,
  }),
  { subscribeProject, unsubscribeProject, setProject }
)(ProjectWrapper)
