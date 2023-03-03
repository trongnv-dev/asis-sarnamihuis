import {
  Avatar,
  Portlet,
  Dropdown,
  RichList,
  Widget11
} from "@blueupcode/components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Component } from "react"
import { connect } from "react-redux"
import * as SolidIcon from "@fortawesome/free-solid-svg-icons"
import Chart from "@blueupcode/apexcharts"

class Widget23Component extends Component {
  state = {
    data: [
      {
        avatar: () => (
          <Avatar display variant="label-primary">
            <FontAwesomeIcon icon={SolidIcon.faChartLine} />
          </Avatar>
        ),
        title: "Profit",
        subtitle: "IPO, Margins, Transactions"
      },
      {
        avatar: () => (
          <Avatar display variant="label-success">
            <FontAwesomeIcon icon={SolidIcon.faChartPie} />
          </Avatar>
        ),
        title: "Revenue",
        subtitle: "Expenses, Loses, Profits"
      }
    ]
  }

  render() {
    return (
      <Portlet>
        <Portlet.Header bordered>
          <Portlet.Icon>
            <FontAwesomeIcon icon={SolidIcon.faEuroSign} />
          </Portlet.Icon>
          <Portlet.Title>Profit share</Portlet.Title>
          <Portlet.Addon>
            {/* BEGIN Dropdown */}
            <Dropdown.Uncontrolled>
              <Dropdown.Toggle caret variant="label-primary">
                Export
              </Dropdown.Toggle>
              <Dropdown.Menu right animated>
                <Dropdown.Item
                  icon={<FontAwesomeIcon icon={SolidIcon.faPoll} />}
                >
                  Report
                </Dropdown.Item>
                <Dropdown.Item
                  icon={<FontAwesomeIcon icon={SolidIcon.faChartPie} />}
                >
                  Charts
                </Dropdown.Item>
                <Dropdown.Item
                  icon={<FontAwesomeIcon icon={SolidIcon.faChartLine} />}
                >
                  Statistics
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  icon={<FontAwesomeIcon icon={SolidIcon.faCog} />}
                >
                  Customize
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Uncontrolled>
            {/* BEGIN Dropdown */}
          </Portlet.Addon>
        </Portlet.Header>
        <Portlet.Body>
          {/* BEGIN Rich List */}
          <RichList className="flex-sm-row">
            {this.state.data.map((data, index) => {
              const { avatar: WidgetAvatar, title, subtitle } = data

              return (
                <RichList.Item key={index} className="flex-grow-1">
                  <RichList.Addon addonType="prepend">
                    <WidgetAvatar />
                  </RichList.Addon>
                  <RichList.Content>
                    <RichList.Title>{title}</RichList.Title>
                    <RichList.Subtitle>{subtitle}</RichList.Subtitle>
                  </RichList.Content>
                </RichList.Item>
              )
            })}
          </RichList>
          {/* END Rich List */}
        </Portlet.Body>
        <Widget23Chart theme={this.props.theme} />
      </Portlet>
    )
  }
}

class Widget23Chart extends Component {
  // Currency formatter
  currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  })

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
        opacity: 0.8,
        type: "solid"
      },
      markers: {
        strokeColors: this.props.theme === "dark" ? "#424242" : "#fff"
      },
      stroke: {
        show: false
      },
      tooltip: {
        y: {
          formatter: (val) => this.currency.format(val) // Format chart tooltip value
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep"
        ],
        crosshairs: {
          show: false
        }
      },
      responsive: [
        {
          breakpoint: 576,
          options: {
            chart: {
              height: 200
            }
          }
        }
      ]
    },
    // Chart series data
    series: [
      {
        name: "Revenue",
        data: [4000, 9600, 4600, 13600, 6800, 14600, 11000]
      },
      {
        name: "Profit",
        data: [3100, 8000, 2800, 5100, 2000, 10900, 10000]
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

    return (
      <Widget11 bottom>
        <Chart type="area" options={options} series={series} height={300} />
      </Widget11>
    )
  }
}

function mapStateToProps(state) {
  return {
    theme: state.page.theme
  }
}

export default connect(mapStateToProps)(Widget23Component)
