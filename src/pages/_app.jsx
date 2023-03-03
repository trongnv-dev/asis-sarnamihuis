// All components stylesheets
import ProgressBar from '@blueupcode/progressbar';
import { AuthProvider } from 'components/auth/tokenAuth';
import BlankLayout from 'components/layout/template/BlankLayout';
import DefaultLayout from 'components/layout/template/DefaultLayout';
import PAGE from 'config/page.config';
import apiConfig from 'lib/api/api';
import { AuthStore } from 'lib/local_store/';
import App from 'next/app';
import Router, { withRouter } from 'next/router';
import 'react-nestable/dist/styles/index.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { wrapper } from 'store';
import { saveUser, pageChangeTheme, setLanguage } from 'store/actions';
import 'styles/apexcharts/index.scss';
import 'styles/components/index.scss';
import 'styles/core/reboot.scss';
import 'styles/datetime/index.scss';
import 'styles/quill/bubble.scss';
import 'styles/quill/core.scss';
import 'styles/quill/snow.scss';
import 'styles/simplebar/index.scss';
import 'styles/slick-carousel/index.scss';
import 'styles/sweetalert2/index.scss';

class MyApp extends App {
  componentDidMount() {
    let darkModeActive = false;

    // Get dark mode support from native device and local storage
    const nativeDarkModeActive = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (localStorage.getItem('theme')) {
      darkModeActive = localStorage.getItem('theme') === 'dark';
    } else {
      darkModeActive = nativeDarkModeActive;
    }

    debugger
    if (localStorage.getItem('email')) {
      this.props.saveUser({ email: localStorage.getItem('email'),name: localStorage.getItem('userName') });
    } else {
      AuthStore.clearToken();
      Router.push(Router.query.redirect || PAGE.loginPagePath);
    }
    // Enable/disable dark mode
    // this.props.pageChangeTheme(darkModeActive ? 'dark' : 'light');
    this.props.pageChangeTheme('light');

    if ('apikey' in apiConfig().headers) {
      this.props.setLanguage();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.theme !== prevProps.theme) {
      // Toggling theme body class
      if (this.props.theme === 'dark') {
        document.body.classList.remove('theme-light');
        document.body.classList.add('theme-dark');
      } else {
        document.body.classList.remove('theme-dark');
        document.body.classList.add('theme-light');
      }
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    let Layout;

    switch (pageProps.layout) {
      case 'default':
        Layout = DefaultLayout;
        break;
      case 'blank':
        Layout = BlankLayout;
        break;
      default:
        Layout = BlankLayout;
    }

    return (
      <AuthProvider>
        <Layout>
          <ProgressBar />
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    );
  }
}

function mapStateToProps(state) {
  return {
    theme: state.page.theme,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({ pageChangeTheme, setLanguage, saveUser }, dispatch),
  };
}

export default wrapper.withRedux(connect(mapStateToProps, mapDispatchToProps)(withRouter(MyApp)));
