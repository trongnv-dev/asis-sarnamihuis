import { Portlet, Progress, Widget4 } from "@blueupcode/components"
import { Component, Fragment } from "react"

class Widget8Component extends Component {
  state = {
    data: [
      {
        title: "New Orders",
        subtitle: "Fresh Order Amount",
        highlight: 523,
        change: 75,
        color: "info"
      },
      {
        title: "New Users",
        subtitle: "Joined New User",
        highlight: 138,
        change: 60,
        color: "success"
      }
    ]
  }

  render() {
    return (
      <Portlet>
        <Portlet.Body>
          {this.state.data.map((data, index) => {
            const { title, subtitle, highlight, change, color } = data

            return (
              <Fragment key={index}>
                <Widget4>
                  <Widget4.Group>
                    <Widget4.Display>
                      <Widget4.Title>{title}</Widget4.Title>
                      <Widget4.Subtitle>{subtitle}</Widget4.Subtitle>
                    </Widget4.Display>
                    <Widget4.Addon>
                      <Widget4.Highlight className={`text-${color}`}>
                        {highlight}
                      </Widget4.Highlight>
                    </Widget4.Addon>
                  </Widget4.Group>
                  <Progress value={change} variant={color} size="sm" />
                  <Widget4.Group>
                    <Widget4.Display>
                      <Widget4.Subtitle>Change</Widget4.Subtitle>
                    </Widget4.Display>
                    <Widget4.Addon>
                      <span className="text-muted">{`${change}%`}</span>
                    </Widget4.Addon>
                  </Widget4.Group>
                </Widget4>
                {this.state.data.length - 1 > index ? <hr /> : null}
              </Fragment>
            )
          })}
        </Portlet.Body>
      </Portlet>
    )
  }
}

export default Widget8Component
