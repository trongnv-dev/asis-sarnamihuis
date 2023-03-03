import { Button, Tooltip } from "@blueupcode/components"
import * as SolidIcon from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Component, Fragment } from "react"

function HeaderAction() {
  return (
    <Fragment>
      <HeaderActionFullscreen className="ml-2" />
    </Fragment>
  )
}
class HeaderActionFullscreen extends Component {
  state = { fullscreenActive: false }

  // Handle click event
  handleClick = () => {
    if (this.state.fullscreenActive) {
      // Exit from fullscreen mode
      document.exitFullscreen()
    } else {
      // Activating fullscreen mode
      document.documentElement.requestFullscreen()
    }
  }

  componentDidMount() {
    const fullscreenClass = "fullscreen-active"

    document.onfullscreenchange = () => {
      // Check whether fullscreen mode is activated
      if (document.fullscreenElement) {
        // Set the state and add the class to the body element
        this.setState({ fullscreenActive: true }, () => {
          document.body.classList.add(fullscreenClass)
        })
      } else {
        // Set the state and remove the class to the body element
        this.setState({ fullscreenActive: false }, () => {
          document.body.classList.remove(fullscreenClass)
        })
      }
    }
  }

  render() {
    return (
      <Fragment>
        <Button
          icon
          id="fullscreenTrigger"
          variant="label-info"
          onClick={this.handleClick}
          {...this.props}
        >
          <FontAwesomeIcon
            icon={SolidIcon.faExpand}
            className="fullscreen-icon-expand"
          />
          <FontAwesomeIcon
            icon={SolidIcon.faCompress}
            className="fullscreen-icon-compress"
          />
        </Button>
        <Tooltip.Uncontrolled placement="left" target="fullscreenTrigger">
          Toggle fullscreen
        </Tooltip.Uncontrolled>
      </Fragment>
    )
  }
}

export default HeaderAction
