import { Component } from "react"
import { Portlet } from "@blueupcode/components"
import { connect } from "react-redux"
import Chart from "@blueupcode/apexcharts"

class Widget31Component extends Component {
  state = {
    title: "New users",
    subtitle: "Last 6 months"
  }

  render() {
    const { title, subtitle } = this.state

    return (
      <Portlet>
        <Portlet.Body>
          <h4 className="text-primary">{title}</h4>
          <span className="text-muted">{subtitle}</span>
          <Widget31Chart theme={this.props.theme} />
        </Portlet.Body>
      </Portlet>
    )
  }
}

class Widget31Chart extends Component {
  state = {
    // Chart options
    options: {
      theme: {
        mode: this.props.theme,
        palette: "palette1"
      },
      chart: {
        background: "transparent",
        sparkline: {
          enabled: true
        }
      },
      fill: {
        type: "solid",
        opacity: 0
      },
      markers: {
        strokeColors: this.props.theme === "dark" ? "#424242" : "#fff"
      },
      stroke: {
        show: true,
        colors: ["#2196f3"],
        lineCap: "round"
      },
      tooltip: {
        marker: {
          show: false
        }
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        crosshairs: {
          show: false
        }
      }
    },
    // Chart series data
    series: [
      {
        name: "Users",
        data: [640, 400, 760, 620, 980, 640]
      }
    ]
  }

  componentDidUpdate(prevProps) {
    if (this.props.theme !== prevProps.theme) {
      const newState = this.state

      // Change chart options
      newState.options.theme = {
        mode: this.props.theme,
        palette: "palette1"
      }
      newState.options.markers.strokeColors =
        this.props.theme === "dark" ? "#424242" : "#fff"

      this.setState(newState)
    }
  }

  render() {
    const { options, series } = this.state

    return <Chart type="area" options={options} series={series} height={150} />
  }
}

function mapStateToProps(state) {
  return {
    theme: state.page.theme
  }
}

export default connect(mapStateToProps)(Widget31Component)
