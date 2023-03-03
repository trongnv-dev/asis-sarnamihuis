import { Form, Portlet, CustomInput } from "@blueupcode/components"
import { Component } from "react"

class SidemenuSettingReport extends Component {
  state = {
    setting1: false,
    setting2: true,
    setting3: false
  }

  // Handle switch element
  handleClick = (e, identifier) => {
    this.setState({ ...this.state, [identifier]: e.target.checked })
  }

  render() {
    return (
      <Portlet bordered {...this.props}>
        <Portlet.Header>
          <Portlet.Title>Reports</Portlet.Title>
        </Portlet.Header>
        <Portlet.Body>
          {/* BEGIN Form Group */}
          <Form.Group>
            <CustomInput
              type="switch"
              size="lg"
              id="reportSetting1"
              label="Generate reports"
              checked={this.state.setting1}
              onChange={(e) => this.handleClick(e, "setting1")}
            />
          </Form.Group>
          {/* END Form Group */}
          {/* BEGIN Form Group */}
          <Form.Group>
            <CustomInput
              type="switch"
              size="lg"
              id="reportSetting2"
              label="Enable report export"
              checked={this.state.setting2}
              onChange={(e) => this.handleClick(e, "setting2")}
            />
          </Form.Group>
          {/* END Form Group */}
          {/* BEGIN Form Group */}
          <Form.Group className="mb-0">
            <CustomInput
              type="switch"
              size="lg"
              id="reportSetting3"
              label="Allow data"
              checked={this.state.setting3}
              onChange={(e) => this.handleClick(e, "setting3")}
            />
          </Form.Group>
          {/* END Form Group */}
        </Portlet.Body>
      </Portlet>
    )
  }
}

export default SidemenuSettingReport
