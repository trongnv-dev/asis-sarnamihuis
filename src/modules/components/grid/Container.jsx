import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { mapToCssModules, tagPropType } from "../utils"

const propTypes = {
  className: PropTypes.string,
  cssModule: PropTypes.object,
  fluid: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  tag: tagPropType
}

const defaultProps = {
  tag: "div"
}

const Container = props => {
  const { className, cssModule, fluid, tag: Tag, ...attributes } = props

  let containerClass = "container"

  if (fluid === true) {
    containerClass = "container-fluid"
  } else if (fluid) {
    containerClass = `container-${fluid}`
  }

  const classes = mapToCssModules(classNames(className, containerClass), cssModule)

  return <Tag {...attributes} className={classes} />
}

Container.propTypes = propTypes
Container.defaultProps = defaultProps

export default Container
