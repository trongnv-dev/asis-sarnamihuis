import {
  Row,
  Col,
  Form,
  Label,
  Input,
  Button,
  Portlet,
  Spinner,
  Container,
  CustomInput,
  FloatLabel,
  Widget12
} from "@blueupcode/components"
import { yupResolver } from "components/validation/yupResolver"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useForm, Controller } from "react-hook-form"
import { Fragment, useState } from "react"
import { firebaseClient } from "components/firebase/firebaseClient"
import { swal } from "components/swal/instance"
import * as SolidIcon from "@fortawesome/free-solid-svg-icons"
import * as yup from "yup"
import verifyCookie from "components/firebase/firebaseVerifyCookie"
import withLayout from "components/layout/withLayout"
import Router from "next/router"
import Link from "next/link"
import Head from "next/head"
import PAGE from "config/page.config"

function RegisterPage() {
  return (
    <Fragment>
      <Head>
        <title>Register | {PAGE.siteName}</title>
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
                <RegisterForm />
              </Portlet.Body>
            </Portlet>
            {/* END Portlet */}
          </Col>
        </Row>
      </Container>
    </Fragment>
  )
}

function RegisterForm() {
  // Loading state
  const [loading, setLoading] = useState(false)

  // Define Yup schema for form validation
  const schema = yup.object().shape({
    firstName: yup
      .string()
      .min(5, "Please enter at least 5 characters")
      .required("Please enter your lastname"),
    lastName: yup
      .string()
      .min(5, "Please enter at least 5 characters")
      .required("Please enter your lastname"),
    email: yup
      .string()
      .email("Your email is not valid")
      .required("Please enter your email"),
    password: yup
      .string()
      .min(6, "Please enter at least 6 characters")
      .required("Please provide your password"),
    passwordRepeat: yup
      .string()
      .min(6, "Please enter at least 6 characters")
      .oneOf([yup.ref("password")], "Your password not match")
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
      password: "",
      passwordRepeat: "",
      agreement: false
    }
  })

  // Handle form submit event
  const onSubmit = async ({ firstName, lastName, email, password }) => {
    // Show loading indicator
    setLoading(true)

    // Trying to register user account to firebase
    await firebaseClient
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        // Trying to login with the user account that been registered before
        return firebaseClient
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            const user = firebaseClient.auth().currentUser

            // Trying to update user name
            return user
              .updateProfile({
                displayName: `${firstName} ${lastName}`
              })
              .then(() => {
                // Set the user login credential data
                const credential =
                  firebaseClient.auth.EmailAuthProvider.credential(
                    user.email,
                    password
                  )

                // Trying to reauthenticate user account
                return user
                  .reauthenticateWithCredential(credential)
                  .then(() => {
                    // Redirect to dashboard page
                    Router.push(Router.query.redirect || PAGE.dashboardPagePath)
                  })
                  .catch((err) => {
                    // Show the error message if reauthentication is failed
                    swal.fire({ text: err.message, icon: "error" })
                  })
              })
              .catch((err) => {
                // Show the error message if update user data is failed
                swal.fire({ text: err.message, icon: "error" })
              })
          })
          .catch((err) => {
            // Show the error message if login is failed
            swal.fire({ text: err.message, icon: "error" })
          })
      })
      .catch((err) => {
        // Show the error message if register is failed
        swal.fire({ text: err.message, icon: "error" })
      })

    // Hide loading indicator
    setLoading(false)
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
          name="passwordRepeat"
          control={control}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, error }
          }) => (
            <FloatLabel size="lg">
              <Input
                type="password"
                id="password-repeat"
                size="lg"
                placeholder="Repeat your password"
                name={name}
                innerRef={ref}
                invalid={invalid}
                onChange={onChange}
                onBlur={onBlur}
                defaultValue={value}
              />
              <Label for="password-repeat">Confirm password</Label>
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
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <span>
          Already have an account ? <Link href="/login">Sign In</Link>
        </span>
        <Button
          type="submit"
          variant="label-primary"
          size="lg"
          width="widest"
          disabled={loading}
        >
          {loading ? (
            <Spinner
              style={{ width: "1.5rem", height: "1.5rem" }}
              className="mr-2"
            />
          ) : null}{" "}
          Register
        </Button>
      </div>
    </Form>
  )
}

RegisterPage.getInitialProps = async (ctx) => {
  const result = await verifyCookie(ctx)

  // Redirect to dashboard page if the user has logged in
  if (result) {
    if (ctx.res) {
      ctx.res.writeHead(302, {
        Location: ctx.query.redirect || PAGE.dashboardPagePath
      })
      ctx.res.end()
    } else {
      Router.push(Router.query.redirect || PAGE.dashboardPagePath)
    }
  }

  return { firebase: null }
}

export default withLayout(RegisterPage, "blank")
