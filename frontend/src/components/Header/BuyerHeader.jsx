/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import classes from "./BuyerHeader.module.css";
import { Button, Text } from "@mantine/core";
import DropDownMenu from "./DropDownMenu";
import { Link } from "react-router-dom";
import ILLogo from "../../assets/illustrations/il_logo.png";
import IconChat from "../../assets/icons/ic_chat.svg";
import IconCart from "../../assets/icons/ic_cart.svg";
import IconWishlist from "../../assets/icons/ic_wishlist.svg";
import { useNavigate } from "react-router-dom";

function BuyerHeader(props) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(props.currentUser);

  const manageViewCart = () => {
    navigate("/buyer/buyer-cart");
  };

  const manageViewWishlist = () => {
    navigate("/buyer/wishlist");
  };

  const manageViewChat = () => {
    navigate("/chatting");
  };

  return (
    <div className={classes.container}>
      <div className={classes.leftside}>
        <Link to="/">
          <img src={ILLogo} width={50} height={50} />
        </Link>

        <Text fw={700} fz="xl">
          Top Care Fashion
        </Text>
        <a className={classes.navBarMenu} onClick={() => navigate("/men")}>
          Men
        </a>
        <a className={classes.navBarMenu} onClick={() => navigate("/women")}>
          Women
        </a>
        <a
          className={classes.navBarMenu}
          href="https://kfleurosa.wixsite.com/topcarefashion"
          target="_blank"
        >
          About Us
        </a>
      </div>
      <div className={classes.rightside}>
        <DropDownMenu currentUser={currentUser} />
        <div onClick={manageViewWishlist} style={{ cursor: "pointer" }}>
          {" "}
          {manageViewWishlist}
          <img src={IconWishlist} width={30} height={30} />
        </div>
        <div onClick={manageViewCart} style={{ cursor: "pointer" }}>
          {" "}
          {manageViewCart}
          <img src={IconCart} width={30} height={30} />
        </div>
        <div onClick={manageViewChat} style={{ cursor: "pointer" }}>
          {" "}
          {manageViewChat}
          <img src={IconChat} width={30} height={30} />
        </div>
      </div>
    </div>
  );
}

export default BuyerHeader;
