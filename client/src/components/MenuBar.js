import React from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'shards-react';

class MenuBar extends React.Component {
  render() {
    return (
      <Navbar type='dark' theme='primary' expand='md'>
        <NavbarBrand href='/'>Personality Database</NavbarBrand>
        <Nav navbar>
          <NavItem>
            <NavLink active href='/movieList'>
              Movies
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

export default MenuBar;
