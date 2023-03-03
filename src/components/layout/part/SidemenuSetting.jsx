import { Button, Sidemenu } from "@blueupcode/components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { bindActionCreators } from "redux"
import { sidemenuToggle } from "store/actions"
import { Component, createRef } from "react"
import { connect } from "react-redux"
import * as SolidIcon from "@fortawesome/free-solid-svg-icons"
import SidemenuSettingPerformance from "./SidemenuSettingPerformance"
import SidemenuSettingCustomer from "./SidemenuSettingCustomer"
import SidemenuSettingProject from "./SidemenuSettingProject"
import SidemenuSettingReport from "./SidemenuSettingReport"
import SimpleBar from "simplebar"

class SidemenuSetting extends Component {
  bodyRef = createRef()

  componentDidMount() {
    // Initialize custom scrollbar
    this.bodySimpleBarInstance = new SimpleBar(this.bodyRef.current)
  }

  render() {
    const { show, sidemenuToggle } = this.props

    return (
      <Sidemenu
        show={show}
        align="right"
        width="wider"
        backdropOnClick={() => sidemenuToggle("setting")}
      >
        <Sidemenu.Header>
          <Sidemenu.Title>Settings</Sidemenu.Title>
          <Sidemenu.Addon>
            <Button
              icon
              variant="label-danger"
              onClick={() => sidemenuToggle("setting")}
            >
              <FontAwesomeIcon icon={SolidIcon.faTimes} />
            </Button>
          </Sidemenu.Addon>
        </Sidemenu.Header>
        <Sidemenu.Body className="pb-0" innerRef={this.bodyRef}>
          <SidemenuSettingPerformance />
          <SidemenuSettingCustomer />
          <SidemenuSettingReport />
          <SidemenuSettingProject />
        </Sidemenu.Body>
      </Sidemenu>
    )
  }
}

function mapStateToProps(state) {
  return {
    show: state.sidemenu.setting
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sidemenuToggle }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SidemenuSetting)
