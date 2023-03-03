import { Component } from "react"
import { Portlet } from "@blueupcode/components"
import { connect } from "react-redux"
import Chart from "@blueupcode/apexcharts"

class Widget32Component extends Component {
  state = {
    title: "Page views",
    subtitle: "Check out the chart"
  }

  render() {
    const { title, subtitle } = this.state

    return (
      <Portlet variant="primary">
        <Portlet.Body>
          <h4>{title}</h4>
          <span></span>
          {subtitle}
          <Widget32Chart theme={this.props.theme} />
        </Portlet.Body>
      </Portlet>
    )
  }
}

class Widget32Chart extends Component {
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
        strokeColors: "#fff"
      },
      stroke: {
        show: true,
        colors: ["#fff"],
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
        name: "Visit",
        data: [320, 450, 360, 560, 440, 480]
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

export default connect(mapStateToProps)(Widget32Component)
