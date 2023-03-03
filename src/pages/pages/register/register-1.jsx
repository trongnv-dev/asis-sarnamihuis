import {
  Row,
  Col,
  Form,
  Label,
  Input,
  Button,
  Portlet,
  Container,
  CustomInput,
  FloatLabel,
  Widget12
} from "@blueupcode/components"
import { yupResolver } from "components/validation/yupResolver"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useForm, Controller } from "react-hook-form"
import { Fragment } from "react"
import * as SolidIcon from "@fortawesome/free-solid-svg-icons"
import * as yup from "yup"
import withLayout from "components/layout/withLayout"
import withAuth from "components/auth/tokenWithAuth"
import Link from "next/link"
import Head from "next/head"
import PAGE from "config/page.config"

function Register1Page() {
  return (
    <Fragment>
      <Head>
        <title>Register 1 | {PAGE.siteName}</title>
      </Head>
      <Container fluid>
        <Row
          noGutters
          className="align-items-center justify-content-center h-100"
        >
          <Col sm="8" md="6" lg="4" xl="3">
            {/* BEGIN Portlet */}
            <Portlet>
              <Portlet.Body>
                <div className="text-center mt-2 mb-4">
                  {/* BEGIN Widget */}
                  <Widget12
                    display
                    circle
                    variant="label-primary"
                    className="mb-4"
                  >
                    <FontAwesomeIcon icon={SolidIcon.faUserAlt} />
                  </Widget12>
                  {/* END Widget */}
                </div>
                <Register1Form />
              </Portlet.Body>
            </Portlet>
            {/* END Portlet */}
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

function Register1Form() {
  // Define Yup schema for form validation
  const schema = yup.object().shape({
    firstName: yup
      .string()
      .min(5, "Please enter at least 5 characters")
      .required("Please enter your firstname"),
    lastName: yup
      .string()
      .min(5, "Please enter at least 5 characters")
      .required("Please enter your lastname"),
    email: yup
      .string()
      .email("Your email is not valid")
      .required("Please enter your email"),
    password1: yup
      .string()
      .min(6, "Please enter at least 6 characters")
      .required("Please provide your password"),
    password2: yup
      .string()
      .min(6, "Please enter at least 6 characters")
      .oneOf([yup.ref("password1")], "Your password not match")
      .required("Please repeat your password"),
    agreement: yup.boolean().oneOf([true], "You must accept the agreement")
  })

  const { control, handleSubmit } = useForm({
    // Apply Yup as resolver for react-hook-form
    resolver: yupResolver(schema),
    // Define the default values for all input forms
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password1: "",
      password2: "",
      agreement: false
    }
  })

  // Handle form submit event
  const onSubmit = (data) => {

  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Row>
        <Col xs="6">
          {/* BEGIN Form Group */}
          <Form.Group>
            <Controller
              name="firstName"
              control={control}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, error }
              }) => (
                <FloatLabel size="lg">
                  <Input
                    type="text"
                    id="first-name"
                    size="lg"
                    placeholder="Insert your firstname"
                    name={name}
                    innerRef={ref}
                    invalid={invalid}
                    onChange={onChange}
                    onBlur={onBlur}
                    defaultValue={value}
                  />
                  <Label for="first-name">First name</Label>
                  {invalid && <Form.Feedback>{error.message}</Form.Feedback>}
                </FloatLabel>
              )}
            />
          </Form.Group>
          {/* END Form Group */}
        </Col>
        <Col xs="6">
          {/* BEGIN Form Group */}
          <Form.Group>
            <Controller
              name="lastName"
              control={control}
              render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, error }
              }) => (
                <FloatLabel size="lg">
                  <Input
                    type="text"
                    id="last-name"
                    size="lg"
                    placeholder="Insert your lastname"
                    name={name}
                    innerRef={ref}
                    invalid={invalid}
                    onChange={onChange}
                    onBlur={onBlur}
                    defaultValue={value}
                  />
                  <Label for="last-name">Last name</Label>
                  {invalid && <Form.Feedback>{error.message}</Form.Feedback>}
                </FloatLabel>
              )}
            />
          </Form.Group>
          {/* END Form Group */}
        </Col>
      </Row>
      {/* BEGIN Form Group */}
      <Form.Group>
        <Controller
          name="email"
          control={control}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, error }
          }) => (
            <FloatLabel size="lg">
              <Input
                type="email"
                id="email"
                size="lg"
                placeholder="Please insert your email"
                name={name}
                innerRef={ref}
                invalid={invalid}
                onChange={onChange}
                onBlur={onBlur}
                defaultValue={value}
              />
              <Label for="email">Email</Label>
              {invalid && <Form.Feedback>{error.message}</Form.Feedback>}
            </FloatLabel>
          )}
        />
      </Form.Group>
      {/* END Form Group */}
      {/* BEGIN Form Group */}
      <Form.Group>
        <Controller
          name="password1"
          control={control}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, error }
          }) => (
            <FloatLabel size="lg">
              <Input
                type="password"
                id="password1"
                size="lg"
                placeholder="Please provide your password"
                name={name}
                innerRef={ref}
                invalid={invalid}
                onChange={onChange}
                onBlur={onBlur}
                defaultValue={value}
              />
              <Label for="password1">Password</Label>
              {invalid && <Form.Feedback>{error.message}</Form.Feedback>}
            </FloatLabel>
          )}
        />
      </Form.Group>
      {/* END Form Group */}
      {/* BEGIN Form Group */}
      <Form.Group>
        <Controller
          name="password2"
          control={control}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, error }
          }) => (
            <FloatLabel size="lg">
              <Input
                type="password"
                id="password2"
                size="lg"
                placeholder="Repeat your password"
                name={name}
                innerRef={ref}
                invalid={invalid}
                onChange={onChange}
                onBlur={onBlur}
                defaultValue={value}
              />
              <Label for="password2">Confirm password</Label>
              {invalid && <Form.Feedback>{error.message}</Form.Feedback>}
            </FloatLabel>
          )}
        />
      </Form.Group>
      {/* END Form Group */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        {/* BEGIN Form Group */}
        <Form.Group className="mb-0">
          <Controller
            control={control}
            name="agreement"
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid }
            }) => (
              <CustomInput
                type="checkbox"
                id="agreement"
                size="lg"
                label="Accept agreement"
                name={name}
                innerRef={ref}
                invalid={invalid}
                onChange={onChange}
                onBlur={onBlur}
                defaultChecked={value}
              />
            )}
          />
        </Form.Group>
        {/* END Form Group */}
        <Link href="#">Forgot password?</Link>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <span>
          Already have an account ?{" "}
          <Link href="/pages/login/login-1">Sign In</Link>
        </span>
        <Button type="submit" variant="label-primary" size="lg" width="widest">
          Register
        </Button>
      </div>
    </Form>
  )
}

export default withAuth(withLayout(Register1Page, "blank"))
