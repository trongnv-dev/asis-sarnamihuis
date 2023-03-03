import { Button, Avatar, GridNav, Portlet, Dropdown, RichList, Widget16 } from '@blueupcode/components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { bindActionCreators } from 'redux';
import { AuthStore } from 'lib/local_store/';
import { tokenChange } from 'store/actions';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as RegularIcon from '@fortawesome/free-regular-svg-icons';
import * as SolidIcon from '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import PAGE from 'config/page.config';

class HeaderUser extends Component {
  state = {
    
    navs: [
      [
        {
          icon: () => <FontAwesomeIcon icon={RegularIcon.faAddressCard} />,
          title: 'Profile',
          onClick :()=>{this.props.profileOnClick()}
        },
        {
          icon: () => <FontAwesomeIcon icon={RegularIcon.faEdit} />,
          title: 'Password',
          onClick :()=>{this.props.changePasswordOnClick()}
        }
      ]
    ],
  };

  handleSignOut = async () => {
    // Try to signing out
    await AuthStore.saveToken('');
    // await AuthStore.clearToken();

    // Redirect to login page and remove firebase data from state management
    this.props.tokenChange(null);
    Router.push(PAGE.loginPagePath);
  };

  render() {
    const { navs } = this.state;
    // eslint-disable-next-line no-unused-vars
    const { changePasswordOnClick, profileOnClick, user, firebase, tokenChange, ...attributes } = this.props;

    return (
      <Dropdown.Uncontrolled {...attributes}>
        <Widget16 dropdown variant="flat-primary">
          <Widget16.Text>
            Hi <strong>{user?.name}</strong>
          </Widget16.Text>
          {/* BEGIN Avatar */}
          <Widget16.Avatar display variant="info">
            <FontAwesomeIcon icon={SolidIcon.faUserAlt} />
          </Widget16.Avatar>
          {/* END Avatar */}
        </Widget16>
        <Dropdown.Menu wide right animated className="overflow-hidden py-0">
          {/* BEGIN Portlet */}
          <Portlet scroll className="border-0">
            <Portlet.Header className="bg-primary rounded-0">
              {/* BEGIN Rich List */}
              <RichList.Item className="w-100 p-0">
                <RichList.Addon addonType="prepend">
                <Avatar variant="label-light" display circle>
                    {user?.avatar ==null ? <FontAwesomeIcon icon={SolidIcon.faUserAlt}/> : <Image src={image} layout="fill" alt="Avatar image" /> }
                </Avatar>
                </RichList.Addon>
                <RichList.Content>
                  <RichList.Title className="text-white">{user?.email}</RichList.Title>
                  {/* <RichList.Subtitle className="text-white">{user?.email}</RichList.Subtitle> */}
                </RichList.Content>
                {/* <RichList.Addon addonType="append">
                  <Badge variant="warning" shape="square" size="lg">
                    {count}
                  </Badge>
                </RichList.Addon> */}
              </RichList.Item>
              {/* END Rich List */}
            </Portlet.Header>
            <Portlet.Body className="p-0">
              {/* BEGIN Grid Nav */}
              <GridNav flush action noRounded>
                {navs.map((nav, index) => (
                  <GridNav.Row key={index}>
                    {nav.map((data, index) => {
                      const { icon: Icon, title,onClick } = data;
                      return (
                        <GridNav.Item key={index} icon={<Icon />} onClick={onClick}>
                          {title}
                        </GridNav.Item>
                      );
                    })}
                  </GridNav.Row>
                ))}
              </GridNav>
              {/* END Grid Nav */}
            </Portlet.Body>
            <Portlet.Footer bordered className="rounded-0">
              <Button variant="label-danger" onClick={this.handleSignOut}>
                Sign out
              </Button>
            </Portlet.Footer>
          </Portlet>
          {/* END Portlet */}
        </Dropdown.Menu>
      </Dropdown.Uncontrolled>
    );
  }
}

function mapStateToProps(state) {
  return {
    firebase: state.firebase,
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ tokenChange }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderUser);
