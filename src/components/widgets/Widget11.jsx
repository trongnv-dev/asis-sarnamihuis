import { Portlet, Widget8, Widget10 } from "@blueupcode/components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Component } from "react"
import * as SolidIcon from "@fortawesome/free-solid-svg-icons"

class Widget11Component extends Component {
  state = {
    data: [
      {
        highlight: "$27,639",
        title: "Total revenue",
        avatar: () => (
          <Widget8.Avatar display circle variant="label-info" className="m-0">
            <FontAwesomeIcon icon={SolidIcon.faDollarSign} />
          </Widget8.Avatar>
        )
      },
      {
        highlight: "87,123",
        title: "Order received",
        avatar: () => (
          <Widget8.Avatar
            display
            circle
            variant="label-primary"
            className="m-0"
          >
            <FontAwesomeIcon icon={SolidIcon.faBoxes} />
          </Widget8.Avatar>
        )
      }
    ]
  }

  render() {
    return (
      <Portlet>
        {/* BEGIN Widget */}
        <Widget10 vertical="lg">
          {this.state.data.map((data, index) => {
            const { highlight, title, avatar: WidgetAvatar } = data

            return (
              <Widget10.Item key={index}>
                <Widget10.Content>
                  <Widget10.Title>{highlight}</Widget10.Title>
                  <Widget10.Subtitle>{title}</Widget10.Subtitle>
                </Widget10.Content>
                <Widget10.Addon>
                  <WidgetAvatar />
                </Widget10.Addon>
              </Widget10.Item>
            )
          })}
        </Widget10>
        {/* END Widget */}
      </Portlet>
    )
  }
}

export default Widget11Component
