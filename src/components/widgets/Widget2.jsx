import {
  Row,
  Col,
  Portlet,
  Progress,
  Widget3,
  Widget4
} from "@blueupcode/components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Component } from "react"
import * as SolidIcon from "@fortawesome/free-solid-svg-icons"

class Widget2Component extends Component {
  state = {
    highlight: "$237,650",
    title: "Total Revenue",
    detail: [
      {
        percent: 62,
        title: "Sales growth",
        color: "primary"
      },
      {
        percent: 40,
        title: "Product growth",
        color: "danger"
      },
      {
        percent: 74,
        title: "Market share",
        color: "success"
      }
    ]
  }

  render() {
    const { highlight, title, detail } = this.state

    return (
      <Portlet>
        <Portlet.Header bordered>
          <Portlet.Icon>
            <FontAwesomeIcon icon={SolidIcon.faBoxes} />
          </Portlet.Icon>
          <Portlet.Title>Product sales</Portlet.Title>
        </Portlet.Header>
        <Portlet.Body className="widget3">
          <Widget3.Display>
            <Widget3.Title>
              {highlight} <Widget3.Subtitle>{title}</Widget3.Subtitle>
            </Widget3.Title>
          </Widget3.Display>
          <Row>
            {detail.map((data, index) => {
              const { percent, title, color } = data
              const marginClass = index < 1 ? "mt-2 mt-md-0" : ""
              const colSize = 12 / detail.length

              return (
                <Col key={index} md={colSize} className={marginClass}>
                  {/* BEGIN Widget */}
                  <Widget4>
                    <Widget4.Group>
                      <Widget4.Addon>
                        <Widget4.Highlight>{`${percent}%`}</Widget4.Highlight>
                      </Widget4.Addon>
                    </Widget4.Group>
                    <Progress value={percent} variant={color} size="sm" />
                    <Widget4.Group>
                      <Widget4.Addon>
                        <Widget4.Subtitle>{title}</Widget4.Subtitle>
                      </Widget4.Addon>
                    </Widget4.Group>
                  </Widget4>
                  {/* END Widget */}
                </Col>
              )
            })}
          </Row>
        </Portlet.Body>
      </Portlet>
    )
  }
}

export default Widget2Component
