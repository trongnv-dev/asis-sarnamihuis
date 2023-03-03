import React from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { mapToCssModules } from "../utils"
import Widget16Avatar from "./Widget16Avatar"
import Widget16Text from "./Widget16Text"
import Dropdown from "../dropdown/Dropdown"
import Button from "../button/Button"

const propTypes = {
  className: PropTypes.string,
  cssModule: PropTypes.object,
  dropdown: PropTypes.bool
}

const Widget16 = props => {
  const { className, cssModule, dropdown, ...attributes } = props

  const Tag = dropdown ? Dropdown.Toggle : Button

  const classes = mapToCssModules(classNames("widget16", className), cssModule)

  return <Tag {...attributes} className={classes} />
}

Widget16.propTypes = propTypes

Widget16.Avatar = Widget16Avatar
Widget16.Text = Widget16Text

export default Widget16
