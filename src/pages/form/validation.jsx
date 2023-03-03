import {
  Row,
  Col,
  Form,
  Label,
  Input,
  Button,
  Portlet,
  Container,
  FloatLabel,
  InputGroup,
  CustomInput
} from "@blueupcode/components"
import { yupResolver } from "components/validation/yupResolver"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useForm, Controller } from "react-hook-form"
import { Component, Fragment } from "react"
import * as SolidIcon from "@fortawesome/free-solid-svg-icons"
import * as yup from "yup"
import withLayout from "components/layout/withLayout"
import withAuth from "components/auth/tokenWithAuth"
import Head from "next/head"
import PAGE from "config/page.config"

class FormValidationPage extends Component {
  render() {
    return (
      <Fragment>
        <Head>
          <title>Form Validation | {PAGE.siteName}</title>
        </Head>
        <Container fluid>
          <Row>
            <Col md="6">
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>Validation states</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  {/* BEGIN Form Group */}
                  <Form.Group>
                    <Label for="validationEmail">Email address</Label>
                    <Input
                      type="email"
                      id="validationEmail"
                      placeholder="Please insert your email"
                      valid
                    />
                    <Form.Feedback valid>Valid feedback</Form.Feedback>
                    <Form.Text>
                      We&apos;ll never share your email with anyone else.
                    </Form.Text>
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group className="mb-0">
                    <Label for="validationPassword">Password</Label>
                    <Input
                      type="password"
                      id="validationPassword"
                      placeholder="Please insert your password"
                      invalid
                    />
                    <Form.Feedback>Invalid feedback</Form.Feedback>
                  </Form.Group>
                  {/* END Form Group */}
                </Portlet.Body>
              </Portlet>
              {/* END Portlet */}
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>Custom form</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  {/* BEGIN Form Group */}
                  <Form.Group>
                    <Label for="validationTextarea">Textarea</Label>
                    <Input
                      type="textarea"
                      id="validationTextarea"
                      placeholder="Required example textarea"
                      required
                      invalid
                    />
                    <Form.Feedback>
                      Please enter a message in the textarea.
                    </Form.Feedback>
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group>
                    <CustomInput
                      type="checkbox"
                      id="validationCheckbox"
                      label="Check this custom checkbox"
                      required
                      invalid
                    />
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group>
                    <CustomInput
                      type="radio"
                      id="validationRadio1"
                      name="validationRadios"
                      label="Toggle this custom radio"
                      defaultChecked
                      required
                      valid
                    />
                    <CustomInput
                      type="radio"
                      id="validationRadio2"
                      name="validationRadios"
                      label="Or toggle this other custom radio"
                      required
                      valid
                    />
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group>
                    <CustomInput
                      type="switch"
                      id="validationSwitch"
                      label="Toggle this switch element"
                      invalid
                    />
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group>
                    <CustomInput
                      id="validationSelect"
                      type="select"
                      required
                      valid
                    >
                      <option value="">Open this select menu</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </CustomInput>
                    <Form.Feedback valid>
                      Example valid custom select feedback
                    </Form.Feedback>
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group>
                    <CustomInput
                      id="validationFile"
                      type="file"
                      required
                      invalid
                    >
                      <Form.Feedback>
                        Example invalid custom file feedback
                      </Form.Feedback>
                    </CustomInput>
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group className="mb-0">
                    {/* BEGIN Float Label */}
                    <FloatLabel>
                      <Input
                        type="email"
                        id="validationFloatLabel"
                        placeholder="Email"
                        defaultValue="example@my.com"
                        valid
                      />
                      <Label for="validationFloatLabel">Float label</Label>
                      <Form.Feedback valid>
                        Example valid float label feedback
                      </Form.Feedback>
                    </FloatLabel>
                    {/* END Float Label */}
                  </Form.Group>
                  {/* END Form Group */}
                </Portlet.Body>
              </Portlet>
              {/* END Portlet */}
            </Col>
            <Col md="6">
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>Input group</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  {/* BEGIN Form Group */}
                  <Form.Group>
                    {/* BEGIN Input Group */}
                    <InputGroup>
                      <InputGroup.Addon addonType="prepend">
                        <InputGroup.Text>@</InputGroup.Text>
                      </InputGroup.Addon>
                      <Input type="email" placeholder="Email" valid />
                    </InputGroup>
                    {/* END Input Group */}
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group>
                    {/* BEGIN Input Group */}
                    <InputGroup>
                      <Input type="text" placeholder="Currency" invalid />
                      <InputGroup.Addon addonType="append">
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={SolidIcon.faDollarSign} />
                        </InputGroup.Text>
                      </InputGroup.Addon>
                    </InputGroup>
                    {/* END Input Group */}
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group>
                    {/* BEGIN Input Group */}
                    <InputGroup>
                      <InputGroup.Addon addonType="prepend">
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={SolidIcon.faLink} />
                        </InputGroup.Text>
                      </InputGroup.Addon>
                      <Input type="text" placeholder="Link" valid />
                      <InputGroup.Addon addonType="prepend">
                        <InputGroup.Text>.com</InputGroup.Text>
                      </InputGroup.Addon>
                    </InputGroup>
                    {/* END Input Group */}
                  </Form.Group>
                  {/* END Form Group */}
                  {/* BEGIN Form Group */}
                  <Form.Group className="mb-0">
                    {/* BEGIN Input Group */}
                    <InputGroup icon>
                      <InputGroup.Addon addonType="prepend">
                        <FontAwesomeIcon icon={SolidIcon.faMapMarkerAlt} />
                      </InputGroup.Addon>
                      <Input type="text" placeholder="Location" invalid />
                    </InputGroup>
                    {/* END Input Group */}
                  </Form.Group>
                  {/* END Form Group */}
                </Portlet.Body>
              </Portlet>
              {/* END Portlet */}
              {/* BEGIN Portlet */}
              <Portlet>
                <Portlet.Header bordered>
                  <Portlet.Title>React Hook Form</Portlet.Title>
                </Portlet.Header>
                <Portlet.Body>
                  <p>
                    We use <strong>React Hook Form</strong> library to support
                    these features. Performant, flexible and extensible forms
                    with easy-to-use validation. Look more references on{" "}
                    <a
                      href="https://react-hook-form.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      their pages
                    </a>
                  </p>
                  <FormValidation />
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

function FormValidation() {
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
    gender: yup.string().notOneOf(["default"], "Please enter your gender"),
    email: yup
      .string()
      .email("Your email is not valid")
      .required("Please enter your email"),
    homepage: yup
      .string()
      .url("Your link is not valid")
      .required("Please enter your homepage link"),
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
      gender: "default",
      email: "",
      homepage: "",
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
                <FloatLabel>
                  <Input
                    type="text"
                    id="first-name"
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
                <FloatLabel>
                  <Input
                    type="text"
                    id="last-name"
                    placeholder="Insert your lastname"
                    name={name}
                    innerRef={ref}
                    invalid={invalid}
                    onChange={onChange}
                    onBlur={onBlur}
                    defaultValue={value}
                  />
                  <Label for="last-name">last name</Label>
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
          name="gender"
          control={control}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, error }
          }) => (
            <>
              <CustomInput
                type="select"
                name={name}
                innerRef={ref}
                onChange={onChange}
                onBlur={onBlur}
                invalid={invalid}
                defaultValue={value}
              >
                <option value="default">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </CustomInput>
              {invalid && <Form.Feedback>{error.message}</Form.Feedback>}
            </>
          )}
        />
      </Form.Group>
      {/* END Form Group */}
      {/* BEGIN Form Group */}
      <Form.Group>
        {/* BEGIN Input Group */}
        <InputGroup>
          <InputGroup.Addon addonType="prepend">
            <InputGroup.Text>
              <FontAwesomeIcon icon={SolidIcon.faEnvelope} />
            </InputGroup.Text>
          </InputGroup.Addon>
          <Controller
            name="email"
            control={control}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, error }
            }) => (
              <>
                <Input
                  type="email"
                  placeholder="Please enter your email"
                  name={name}
                  innerRef={ref}
                  invalid={invalid}
                  onChange={onChange}
                  onBlur={onBlur}
                  defaultValue={value}
                />
                {invalid && <Form.Feedback>{error.message}</Form.Feedback>}
              </>
            )}
          />
        </InputGroup>
        {/* END Input Group */}
      </Form.Group>
      {/* END Form Group */}
      {/* BEGIN Form Group */}
      <Form.Group>
        {/* BEGIN Input Group */}
        <InputGroup>
          <InputGroup.Addon addonType="prepend">
            <InputGroup.Text>Homepage</InputGroup.Text>
          </InputGroup.Addon>
          <Controller
            name="homepage"
            control={control}
            render={({
              field: { onChange, onBlur, value, name, ref },
              fieldState: { invalid, error }
            }) => (
              <>
                <Input
                  type="text"
                  placeholder="https://example.me"
                  name={name}
                  innerRef={ref}
                  invalid={invalid}
                  onChange={onChange}
                  onBlur={onBlur}
                  defaultValue={value}
                />
                {invalid && <Form.Feedback>{error.message}</Form.Feedback>}
              </>
            )}
          />
        </InputGroup>
        {/* END Input Group */}
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
            <>
              <Input
                type="password"
                placeholder="please provide your password"
                name={name}
                innerRef={ref}
                invalid={invalid}
                onChange={onChange}
                onBlur={onBlur}
                defaultValue={value}
              />
              {invalid && <Form.Feedback>{error.message}</Form.Feedback>}
            </>
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
            <>
              <Input
                type="password"
                placeholder="Please insert again your password"
                name={name}
                innerRef={ref}
                invalid={invalid}
                onChange={onChange}
                onBlur={onBlur}
                defaultValue={value}
              />
              {invalid && <Form.Feedback>{error.message}</Form.Feedback>}
            </>
          )}
        />
      </Form.Group>
      {/* END Form Group */}
      {/* BEGIN Form Group */}
      <Form.Group>
        <Controller
          name="agreement"
          control={control}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid }
          }) => (
            <CustomInput
              type="checkbox"
              size="lg"
              id="agreement"
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
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </Form>
  )
}

export default withAuth(withLayout(FormValidationPage))
