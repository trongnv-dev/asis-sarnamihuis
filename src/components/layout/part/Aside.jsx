import { Aside, Button } from '@blueupcode/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { asideChange, asideToggle } from 'store/actions';
import { bindActionCreators } from 'redux';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as SolidIcon from '@fortawesome/free-solid-svg-icons';
import AsideBody from './AsideBody';
import Router from 'next/router';
import PAGE from 'config/page.config';
import { menuApi } from 'services';
import { orderMenu, convertMenu } from 'utils/menu';
import { asideMenuUpdate } from 'store/actions';
import { useDispatch } from 'react-redux';

class AsideComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { asideMenu: null };
  }

  componentDidMount() {
    // Collapse aside when the routing start for mobile device
    Router.events.on('routeChangeStart', () => this.props.asideChange({ mobileMinimized: true }));
    this.getMenuData();
  }

  getMenuData = async () => {
    try {
      let response = await menuApi.getMenuList({
        orderBy: 'sort',
        direction: 'asc',
        perPage: '',
        page: 1,
        searchAll: '',
      });
      if (response.status === 200) {
        const menu = JSON.parse(localStorage.getItem('menu'));
        if (menu && menu.length > 0) {
          this.setState({ asideMenu: orderMenu(menu, response.data.data) });
        } else {
          this.setState({ asideMenu: convertMenu(response.data.data) });
        }
      } else {
        console.log('response: error');
      }
    } catch (e) {
      console.log('error: ', e);
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.needUpdate != this.props.needUpdate) {
      this.getMenuData();
    }
  }

  render() {
    const { asideChange, asideToggle } = this.props;
    const { desktopMinimized, mobileMinimized } = this.props.aside;
    return (
      <Aside
        desktopMinimized={desktopMinimized}
        mobileMinimized={mobileMinimized}
        backdropOnClick={() => asideChange({ mobileMinimized: true })}
      >
        <Aside.Header>
          <Aside.Title>
            <a href='/'>{PAGE.siteName}</a>
          </Aside.Title>
          <Aside.Addon>
            <Button icon size="lg" variant="label-primary" onClick={() => asideToggle()}>
              <FontAwesomeIcon icon={SolidIcon.faTimes} className="aside-icon-minimize" />
              <FontAwesomeIcon icon={SolidIcon.faThumbtack} className="aside-icon-maximize" />
            </Button>
          </Aside.Addon>
        </Aside.Header>
        {this.state.asideMenu && <AsideBody AsideMenu={this.state.asideMenu} />}
        {/* <AsideBody/> */}
      </Aside>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state,
    needUpdate: state.sidemenu?.needUpdate,
  };
  // return state.aside
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ asideChange, asideToggle, asideMenuUpdate }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(AsideComponent);
