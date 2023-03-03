import { Button, Header, Marker } from '@blueupcode/components';
import * as RegularIcon from '@fortawesome/free-regular-svg-icons';
import * as SolidIcon from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeLabel } from 'components/UI/features';
import PAGE from 'config/page.config';
import { connect } from 'react-redux';
import Sticky from 'react-stickynode';
import { bindActionCreators } from 'redux';
import { asideToggle, sidemenuToggle } from 'store/actions';
import EditProfile from '../../UI/Profiles/EditProfile';
import HeaderAction from './HeaderAction';
import HeaderBreadcrumb from './HeaderBreadcrumb';
import HeaderNav from './HeaderNav';
import HeaderUser from './HeaderUser';
import {useState } from 'react';
import ChangePassword from '../../UI/Profiles/ChangePassword';
import Router from 'next/router';

function HeaderComponent(props) {
  const { headerTitle, sidemenuToggle, asideToggle } = props;

  const [popupEditProfire, setPopupEditProfire] = useState(false); 
  const [popupChangePassword, setPopupChangePassword] = useState(false); 


  const handlePopupProfile = () => {
    const id = localStorage.getItem('userId');
    Router.push(`/persons/update/${id}`);
  };

  const handlePopupChangePassword= () => {
    const id = localStorage.getItem('userId');
    Router.push(`/persons/change-password/${id}`);
    // setPopupChangePassword(true);
  };

  return (
    <Header>
      <Sticky enabled={true} top={0} bottomBoundary={0} className="sticky-header">
        {/* BEGIN Header Holder */}
        <Header.Holder desktop>
          <Header.Container fluid>
            <Header.Wrap>
              <HeaderNav />
            </Header.Wrap>
            <Header.Wrap block>
              {popupEditProfire && <EditProfile setPopupEditProfire = {setPopupEditProfire}  id = {localStorage.getItem('userId')}></EditProfile>}
              {popupChangePassword && <ChangePassword setPopupChangePassword = {setPopupChangePassword} id = {localStorage.getItem('userId')}></ChangePassword>}
            </Header.Wrap>
            <Header.Wrap>
              <HeaderUser className="ml-2" changePasswordOnClick ={handlePopupChangePassword}  profileOnClick = {handlePopupProfile}/>
            </Header.Wrap>
          </Header.Container>
        </Header.Holder>
        {/* END Header Holder */}
      </Sticky>
      {/* BEGIN Header Holder */}
      <Header.Holder desktop>
        <Header.Container fluid>
          <Header.Title>
            <ChangeLabel label={headerTitle} />
          </Header.Title>
          <Header.Divider />
          <Header.Wrap block justify="start">
            <HeaderBreadcrumb />
          </Header.Wrap>
          <Header.Wrap>
            <HeaderAction />
          </Header.Wrap>
        </Header.Container>
      </Header.Holder>
      {/* END Header Holder */}
      <Sticky enabled={true} top={0} bottomBoundary={0} className="sticky-header">
        {/* BEGIN Header Holder */}
        <Header.Holder mobile>
          <Header.Container fluid>
            <Header.Wrap>
              <Button icon variant="flat-primary" onClick={asideToggle}>
                <FontAwesomeIcon icon={SolidIcon.faBars} />
              </Button>
            </Header.Wrap>
            <Header.Wrap block justify="start" className="px-3">
              <Header.Brand>{PAGE.siteName}</Header.Brand>
            </Header.Wrap>
            <Header.Wrap block>
              {popupEditProfire && <EditProfile setPopupEditProfire = {setPopupEditProfire}  id = {localStorage.getItem('userId')}></EditProfile>}
              {popupChangePassword && <ChangePassword setPopupChangePassword = {setPopupChangePassword} id = {localStorage.getItem('userId')}></ChangePassword>}
            </Header.Wrap>
            <Header.Wrap>
              {/* <HeaderUser className="ml-2" /> */}
              <HeaderUser className="ml-2" changePasswordOnClick ={handlePopupChangePassword}  profileOnClick = {handlePopupProfile}/>
            </Header.Wrap>
          </Header.Container>
        </Header.Holder>
        {/* BEGIN Header Holder */}
      </Sticky>
      {/* BEGIN Header Holder */}
      <Header.Holder mobile>
        <Header.Container fluid>
          <Header.Wrap block justify="start" className="w-100">
            <HeaderBreadcrumb />
          </Header.Wrap>
        </Header.Container>
      </Header.Holder>
      {/* END Header Holder */}
    </Header>
  );
}

function mapStateToProps(state) {
  return {
    headerTitle: state.page.headerTitle,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ asideToggle, sidemenuToggle }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
