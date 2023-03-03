import { Button, Sidemenu } from "@blueupcode/components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { bindActionCreators } from "redux"
import { sidemenuToggle } from "store/actions"
import { Component, createRef } from "react"
import { connect } from "react-redux"
import * as SolidIcon from "@fortawesome/free-solid-svg-icons"
import SidemenuAgendaContact from "./SidemenuAgendaContact"
import SidemenuAgendaEvent from "./SidemenuAgendaEvent"
import SimpleBar from "simplebar"

class SidemenuAgenda extends Component {
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
        backdropOnClick={() => sidemenuToggle("agenda")}
      >
        <Sidemenu.Header>
          <Sidemenu.Title>May 14, 2020</Sidemenu.Title>
          <Sidemenu.Addon>
            <Button
              icon
              variant="label-danger"
              onClick={() => sidemenuToggle("agenda")}
            >
              <FontAwesomeIcon icon={SolidIcon.faTimes} />
            </Button>
          </Sidemenu.Addon>
        </Sidemenu.Header>
        <Sidemenu.Body className="pb-0" innerRef={this.bodyRef}>
          <SidemenuAgendaEvent />
          <SidemenuAgendaContact />
        </Sidemenu.Body>
      </Sidemenu>
    )
  }
}

function mapStateToProps(state) {
  return {
    show: state.sidemenu.agenda
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sidemenuToggle }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SidemenuAgenda)
