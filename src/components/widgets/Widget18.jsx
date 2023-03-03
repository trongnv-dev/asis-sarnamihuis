import { Component, Fragment } from "react"
import { Portlet, Widget8 } from "@blueupcode/components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import * as SolidIcon from "@fortawesome/free-solid-svg-icons"

class Widget18Component extends Component {
  state = {
    avatar: () => (
      <Widget8.Avatar display circle variant="label-info">
        <FontAwesomeIcon icon={SolidIcon.faDollarSign} />
      </Widget8.Avatar>
    ),
    highlight: "$23K",
    title: "Profit",
    color: "danger",
    detail: () => (
      <Fragment>
        <FontAwesomeIcon icon={SolidIcon.faCaretDown} /> 1.4%
      </Fragment>
    )
  }

  render() {
    const {
      avatar: WidgetAvatar,
      highlight,
      title,
      color,
      detail: Detail
    } = this.state

    return (
      <Portlet>
        <Portlet.Body>
          {/* BEGIN Widget */}
          <Widget8>
            <Widget8.Content>
              <WidgetAvatar />
              <Widget8.Highlight>{highlight}</Widget8.Highlight>
              <Widget8.Title>{title}</Widget8.Title>
              <Widget8.Subtitle className={`text-${color}`}>
                <Detail />
              </Widget8.Subtitle>
            </Widget8.Content>
          </Widget8>
          {/* END Widget */}
        </Portlet.Body>
      </Portlet>
    )
  }
}

export default Widget18Component
