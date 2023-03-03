import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { mapToCssModules } from "../utils"
import Avatar from "../avatar/Avatar"

const propTypes = {
  className: PropTypes.string
}

const Widget16Avatar = props => {
  const { className, cssModule, tag, ...attributes } = props

  const classes = mapToCssModules(classNames("widget16-avatar", className), cssModule)

  return <Avatar {...attributes} tag="span" className={classes} />
}

Widget16Avatar.propTypes = propTypes

export default Widget16Avatar
