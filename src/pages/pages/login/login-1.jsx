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

function Login1Page() {
  return (
    <Fragment>
      <Head>
        <title>Login 1 | {PAGE.siteName}</title>
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
                <Login1Form />
              </Portlet.Body>
            </Portlet>
            {/* END Portlet */}
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

function Login1Form() {
  // Define Yup schema for form validation
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Your email is not valid")
      .required("Please enter your email"),
    password: yup
      .string()
      .min(6, "Please enter at least 6 characters")
      .required("Please provide your password"),
    remember: yup.boolean()
  })

  const { control, handleSubmit } = useForm({
    // Apply Yup as resolver for react-hook-form
    resolver: yupResolver(schema),
    // Define the default values for all input forms
    defaultValues: {
      email: "",
      password: "",
      remember: false
    }
  })

  // Handle form submit event
  const onSubmit = (data) => {

  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
          name="password"
          control={control}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, error }
          }) => (
            <FloatLabel size="lg">
              <Input
                type="password"
                id="password"
                size="lg"
                placeholder="Please insert your password"
                name={name}
                innerRef={ref}
                invalid={invalid}
                onChange={onChange}
                onBlur={onBlur}
                defaultValue={value}
              />
              <Label for="password">Password</Label>
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
            name="remember"
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid }
            }) => (
              <CustomInput
                type="switch"
                id="remember"
                size="lg"
                label="Remember me"
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
          Don&apos;t have an account ?{" "}
          <Link href="/pages/register/register-1">Sign Up</Link>
        </span>
        <Button type="submit" variant="label-primary" size="lg" width="widest">
          Login
        </Button>
      </div>
    </Form>
  )
}

export default withAuth(withLayout(Login1Page, "blank"))
