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

class EditorComplexPage extends Component {
  componentDidMount() {
    // Set header title
    this.props.pageChangeHeaderTitle("Complex Editor")
    // Set breadcrumb data
    this.props.breadcrumbChange([
      { text: "Dashboard", link: "/" },
      { text: "Editor" },
      { text: "Complex", link: "/editor/complex" }
    ])
  }

  state = {
    // Initial editor content
    content:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod."
  }

  // Define custom editor toolbar
  modules = {
    toolbar: [
      [{ font: ["poppins", "roboto mono"] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "super" }, { script: "sub" }],
      [{ header: "1" }, { header: "2" }, "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" }
      ],
      [{ direction: "rtl" }, { align: [] }],
      ["link", "image", "video"],
      ["clean"]
    ]
  }

  // Handle editor change event
  handleChange = (value) => {
    this.setState({ content: value })
  }

  render() {
    return (
      <Fragment>
        <Head>
          <title>Complex Editor | {PAGE.siteName}</title>
        </Head>
        <Container fluid>
          <Row>
            <Col xs="12">
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>Complex editor</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  <Quill
                    theme="snow"
                    value={this.state.content}
                    onChange={this.handleChange}
                    modules={this.modules}
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
)(withAuth(withLayout(EditorComplexPage)))
