import { Row, Col, Table, Portlet, Container } from "@blueupcode/components"
import { pageChangeHeaderTitle, breadcrumbChange } from "store/actions"
import { bindActionCreators } from "redux"
import { Component, Fragment } from "react"
import { connect } from "react-redux"
import withLayout from "components/layout/withLayout"
import withAuth from "components/auth/tokenWithAuth"
import Head from "next/head"
import PAGE from "config/page.config"

class TablePage extends Component {
  componentDidMount() {
    // Set header title
    this.props.pageChangeHeaderTitle("Table")
    // Set breadcrumb data
    this.props.breadcrumbChange([
      { text: "Dashboard", link: "/" },
      { text: "Elements" },
      { text: "Base" },
      { text: "Table", link: "/elements/base/table" }
    ])
  }

  render() {
    return (
      <Fragment>
        <Head>
          <title>Table | {PAGE.siteName}</title>
        </Head>
        <Container fluid>
          <Row>
            <Col md="6">
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>Basic table</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  <p>
                    Using the most basic table markup, here’s how{" "}
                    <code>Table</code>-based tables look.
                  </p>
                  {/* BEGIN Table */}
                  <Table className="mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  {/* END Table */}
                </Portlet.Body>
              </Portlet>
              {/* END Portlet */}
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>Contextual colors</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  <p>
                    Use <code>variant</code> property to apply contextual colors
                  </p>
                  {/* BEGIN Tables */}
                  <Table variant="primary">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table variant="secondary">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table variant="success">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table variant="info">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table variant="danger">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table variant="warning">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table variant="dark">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Table variant="light" className="mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  {/* END Tables */}
                </Portlet.Body>
              </Portlet>
              {/* END Portlet */}
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>Hoverable</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  <p>
                    Add <code>hover</code> property to enable hover effect on
                    table rows within a <code>{"<tbody>"}</code>.
                  </p>
                  {/* BEGIN Table */}
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  {/* END Table */}
                </Portlet.Body>
              </Portlet>
              {/* END Portlet */}
            </Col>
            <Col md="6">
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>Border variants</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  <p>
                    Change the table border style by applying{" "}
                    <code>bordered|borderless</code> properties.
                  </p>
                  {/* BEGIN Table */}
                  <Table bordered>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  {/* END Table */}
                  {/* BEGIN Table */}
                  <Table borderless className="mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  {/* END Table */}
                </Portlet.Body>
              </Portlet>
              {/* END Portlet */}
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>Striped</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  <p>
                    Use <code>striped</code> property to add zebra-striping to
                    any table row within the <code>{"<tbody>"}</code>.
                  </p>
                  {/* BEGIN Table */}
                  <Table striped className="mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  {/* END Table */}
                </Portlet.Body>
              </Portlet>
              {/* END Portlet */}
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>Responsive table</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  <p>
                    Make your tables always responsive, use{" "}
                    <code>responsive</code> property for horizontally scrolling
                    tables.
                  </p>
                  <p>
                    Add <code>responsive</code> with boolean value to create
                    responsive table and use{" "}
                    <code>responsiveUp|responsiveDown</code> with{" "}
                    <code>sm|md|lg|xl</code> as needed to create responsive
                    tables up or down to a particular breakpoint.
                  </p>
                  {/* BEGIN Table */}
                  <Table striped hover responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                        <th>Head</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                        <td>Data</td>
                      </tr>
                    </tbody>
                  </Table>
                  {/* END Table */}
                </Portlet.Body>
              </Portlet>
              {/* END Portlet */}
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>Small table</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  <p>
                    Add <code>small</code> property to make tables more compact
                    by cutting cell padding in half.
                  </p>
                  {/* BEGIN Table */}
                  <Table small className="mb-0">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                      </tr>
                      <tr>
                        <th scope="row">3</th>
                        <td colSpan="2">Larry the Bird</td>
                        <td>@twitter</td>
                      </tr>
                    </tbody>
                  </Table>
                  {/* END Table */}
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

export default connect(null, mapDispathToProps)(withAuth(withLayout(TablePage)))
