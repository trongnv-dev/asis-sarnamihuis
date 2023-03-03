import {
  Row,
  Col,
  Form,
  Label,
  Portlet,
  Container
} from "@blueupcode/components"
import { Component, Fragment } from "react"
import withLayout from "components/layout/withLayout"
import withAuth from "components/auth/tokenWithAuth"
import Head from "next/head"
import PAGE from "config/page.config"
import DateTimePicker from "react-datetime"

class DateTimePickerPage extends Component {
  render() {
    return (
      <Fragment>
        <Head>
          <title>Date Time Picker | {PAGE.siteName}</title>
        </Head>
        <Container fluid>
          <Row>
            <Col xs="12">
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>Date Time Picker</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  <p>
                    A date and time picker for ReactJS, for more info please visit{" "}
                    <a
                      href="https://www.npmjs.com/package/react-datetime"
                      target="_blank"
                      rel="noreferrer"
                    >
                      React Datetime&apos;s page
                    </a>.
                  </p>
                  <hr />
                  {/* BEGIN Form Group */}
                  <Form.Group row>
                    <Label sm="4" lg="3" className="text-muted text-sm-right">
                      Basic Demo
                    </Label>
                    <Col sm="5" lg="4">
                      <DateTimePicker />
                    </Col>
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group row>
                    <Label sm="4" lg="3" className="text-muted text-sm-right">
                      Initial Value
                    </Label>
                    <Col sm="5" lg="4">
                      <DateTimePicker initialValue={new Date()} />
                    </Col>
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group row>
                    <Label sm="4" lg="3" className="text-muted text-sm-right">
                      Close on Select
                    </Label>
                    <Col sm="5" lg="4">
                      <DateTimePicker closeOnSelect />
                    </Col>
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group row>
                    <Label sm="4" lg="3" className="text-muted text-sm-right">
                      Date Only
                    </Label>
                    <Col sm="5" lg="4">
                      <DateTimePicker timeFormat={false} />
                    </Col>
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group row>
                    <Label sm="4" lg="3" className="text-muted text-sm-right">
                      Custom Date Format
                    </Label>
                    <Col sm="5" lg="4">
                      <DateTimePicker dateFormat="YYYY-MM-DD" timeFormat={false} />
                    </Col>
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group row>
                    <Label sm="4" lg="3" className="text-muted text-sm-right">
                      Time Only
                    </Label>
                    <Col sm="5" lg="4">
                      <DateTimePicker dateFormat={false} />
                    </Col>
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group row>
                    <Label sm="4" lg="3" className="text-muted text-sm-right">
                      Custom Time Format
                    </Label>
                    <Col sm="5" lg="4">
                      <DateTimePicker timeFormat="hh:mm A" dateFormat={false} />
                    </Col>
                  </Form.Group>
                  {/* END Form Group */}
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

export default withAuth(withLayout(DateTimePickerPage))
