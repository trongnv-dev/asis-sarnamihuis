import { bindActionCreators } from "redux"
import { tokenChange } from "store/actions"
import { Component } from "react"
import { connect } from "react-redux"
import verifyCookie from "components/auth/tokenVerifyCookie"
import Router from "next/router"
import PAGE from "config/page.config"

function tokenWithAuth(AuthComponent) {
  class Authentication extends Component {
    static async getInitialProps(ctx) {
      let initialProps = {}

      // Get initial properties
      if (AuthComponent.getInitialProps) {
        initialProps = await AuthComponent.getInitialProps(ctx)
      }

      // Verify cookie
      const token = await verifyCookie(ctx)

      // Check cookie is valid or not
      if (!token) {
        // Redirect to login page
        if (ctx.res) {
          ctx.res.writeHead(302, { Location: PAGE.loginPagePath })
          ctx.res.end()
        } else {
          Router.push(PAGE.loginPagePath)
        }

        return {
          ...initialProps,
          token
        }
      }

      return {
        ...initialProps,
        token
      }
    }

    componentDidMount() {
      this.props.tokenChange(this.props.token)
    }

    render() {
      return <AuthComponent {...this.props} />
    }
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators({ tokenChange }, dispatch)
  }

  return connect(null, mapDispatchToProps)(Authentication)
}

export default tokenWithAuth
