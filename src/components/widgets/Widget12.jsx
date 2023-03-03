import {
  Badge,
  Marker,
  Portlet,
  Timeline,
  Widget7
} from "@blueupcode/components"
import { Component, Fragment } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as SolidIcon from "@fortawesome/free-solid-svg-icons"

class Widget12Component extends Component {
  state = {
    data: [
      {
        color: "primary",
        content: "12 new users registered",
        time: "Just now"
      },
      {
        color: "success",
        content: () => (
          <Fragment>
            System shutdown <Badge variant="label-success">pending</Badge>
          </Fragment>
        ),
        time: "2 mins"
      },
      {
        color: "primary",
        content: "New invoice received",
        time: "3 mins"
      },
      {
        color: "danger",
        content: () => (
          <Fragment>
            New order received <Badge variant="label-danger">urgent</Badge>
          </Fragment>
        ),
        time: "10 mins"
      },
      {
        color: "warning",
        content: "Production server down",
        time: "1 hrs"
      },
      {
        color: "info",
        content: () => (
          <Fragment>
            System error <a href="#">check</a>
          </Fragment>
        ),
        time: "2 hrs"
      },
      {
        color: "secondary",
        content: "DB overloaded 80%",
        time: "5 hrs"
      },
      {
        color: "success",
        content: "Production server up",
        time: "6 hrs"
      }
    ]
  }

  render() {
    return (
      <Portlet>
        <Portlet.Header>
          <Portlet.Icon>
            <FontAwesomeIcon icon={SolidIcon.faListAlt} />
          </Portlet.Icon>
          <Portlet.Title>Lastest log</Portlet.Title>
        </Portlet.Header>
        <Portlet.Body>
          <Portlet className="h-100 mb-0">
            <Portlet.Body>
              {/* BEGIN Timeline */}
              <Timeline>
                {this.state.data.map((data, index) => {
                  const { content: Content, time, color } = data

                  return (
                    <Timeline.Item
                      key={index}
                      pin={<Marker type="dot" variant={color} />}
                    >
                      {/* BEGIN Widget */}
                      <Widget7>
                        <Widget7.Text>
                          {typeof Content === "function" ? (
                            <Content />
                          ) : (
                            Content
                          )}
                        </Widget7.Text>
                        <Widget7.Time>{time}</Widget7.Time>
                      </Widget7>
                      {/* END Widget */}
                    </Timeline.Item>
                  )
                })}
              </Timeline>
              {/* END Timeline */}
            </Portlet.Body>
          </Portlet>
        </Portlet.Body>
      </Portlet>
    )
  }
}

export default Widget12Component
