import { Portlet, Widget8, Widget10 } from "@blueupcode/components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Component } from "react"
import * as SolidIcon from "@fortawesome/free-solid-svg-icons"

class Widget33Component extends Component {
  state = {
    data: [
      {
        title: "$27,639",
        subtitle: "Total revenue",
        avatar: () => (
          <Widget8.Avatar display circle variant="label-info" className="m-0">
            <FontAwesomeIcon icon={SolidIcon.faDollarSign} />
          </Widget8.Avatar>
        )
      },
      {
        title: "87,123",
        subtitle: "Order received",
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
      },
      {
        title: "237",
        subtitle: "New users",
        avatar: () => (
          <Widget8.Avatar
            display
            circle
            variant="label-success"
            className="m-0"
          >
            <FontAwesomeIcon icon={SolidIcon.faUsers} />
          </Widget8.Avatar>
        )
      },
      {
        title: "5,726",
        subtitle: "Unique visits",
        avatar: () => (
          <Widget8.Avatar display circle variant="label-danger" className="m-0">
            <FontAwesomeIcon icon={SolidIcon.faLink} />
          </Widget8.Avatar>
        )
      }
    ]
  }

  render() {
    return (
      <Portlet>
        <Widget10 vertical="md">
          {this.state.data.map((data, index) => {
            const { title, subtitle, avatar: WidgetAvatar } = data

            return (
              <Widget10.Item key={index}>
                <Widget10.Content>
                  <Widget10.Title>{title}</Widget10.Title>
                  <Widget10.Subtitle>{subtitle}</Widget10.Subtitle>
                </Widget10.Content>
                <Widget10.Addon>
                  <WidgetAvatar />
                </Widget10.Addon>
              </Widget10.Item>
            )
          })}
        </Widget10>
      </Portlet>
    )
  }
}

export default Widget33Component
