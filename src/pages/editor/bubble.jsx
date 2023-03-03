import { Row, Col, Portlet, Container } from "@blueupcode/components"
import { pageChangeHeaderTitle, breadcrumbChange } from "store/actions"
import { bindActionCreators } from "redux"
import { Component, Fragment } from "react"
import { connect } from "react-redux"
import withLayout from "components/layout/withLayout"
import withAuth from "components/auth/tokenWithAuth"
import Quill from "@blueupcode/quill"
import Head from "next/head"
import PAGE from "config/page.config"

class EditorBubblePage extends Component {
  componentDidMount() {
    // Set header title
    this.props.pageChangeHeaderTitle("Bubble Editor")
    // Set breadcrumb data
    this.props.breadcrumbChange([
      { text: "Dashboard", link: "/" },
      { text: "Editor" },
      { text: "Bubble", link: "/editor/bubble" }
    ])
  }

  state = {
    // Initial editor content
    content:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod."
  }

  // Handle editor change event
  handleChange = (value) => {
    this.setState({ content: value })
  }

  render() {
    return (
      <Fragment>
        <Head>
          <title>Bubble Editor | {PAGE.siteName}</title>
        </Head>
        <Container fluid>
          <Row>
            <Col xs="12">
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>Bubble editor</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  <Quill
                    theme="bubble"
                    value={this.state.content}
                    onChange={this.handleChange}
                    style={{ minHeight: "20rem" }}
                  />
                </Portlet.Body>
              </Portlet>
              {/* END Portlet */}
            </Col>
          </Row>
        </Container>
      </Fragment>
    )
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators(
    { pageChangeHeaderTitle, breadcrumbChange },
    dispatch
  )
}

export default connect(
  null,
  mapDispathToProps
)(withAuth(withLayout(EditorBubblePage)))
