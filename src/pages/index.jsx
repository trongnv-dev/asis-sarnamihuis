import { Row, Col, Container } from '@blueupcode/components';
import { Component, Fragment } from 'react';
import { pageChangeHeaderTitle, breadcrumbChange } from 'store/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import withLayout from 'components/layout/withLayout';
import withAuth from 'components/auth/tokenWithAuth';
import Head from 'next/head';
import PAGE from 'config/page.config';

class DashboardPage extends Component {
  componentDidMount() {
    // Set header title
    this.props.pageChangeHeaderTitle('Dashboard');
    // Set breadcrumb data
    this.props.breadcrumbChange([{ text: 'Dashboard', link: '/' }]);
  }

  render() {
    return (
      <Fragment>
        <Head>
          <title>Dashboard | {PAGE.siteName}</title>
        </Head>
        <Container fluid>
          <Row style={{ justifyContent: 'center' }}>
            <h1 style={{ fontSize: '50px' }}>WELCOME TO ASIS</h1>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

function mapDispathToProps(dispatch) {
  return bindActionCreators({ pageChangeHeaderTitle, breadcrumbChange }, dispatch);
}

export default connect(null, mapDispathToProps)(withAuth(withLayout(DashboardPage)));
