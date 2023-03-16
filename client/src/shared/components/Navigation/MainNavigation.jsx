import { useState } from "react";
import { Link } from "react-router-dom";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import "./MainNavigation.css";
import Backdrop from "../UIElements/Backdrop";
import logo from "./visipin.png";

export default function MainNavigation(props) {
  const [isOpen, setIsOpen] = useState(false);

  function close() {
    setIsOpen(false);
  }

  function open() {
    setIsOpen(true);
  }

  return (
    <>
      {isOpen && <Backdrop onClick={close} />}
      <SideDrawer show={isOpen} onClick={close}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button className="main-navigation__menu-btn" onClick={open}>
          <span />
          <span />
          <span />
        </button>
        <div className="branding">
          <img className="logo" src={logo} alt={logo} />
          <h1 className="main-navigation__title">
            <Link to="/">VisiPin</Link>
          </h1>
        </div>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
}
