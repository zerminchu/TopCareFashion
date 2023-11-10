/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import classes from "./SellerHeader.module.css";
import ILLogo from "../../assets/illustrations/il_logo.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import { Button, Text } from "@mantine/core";

function AdminHeader(props) {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/");
    window.location.reload();
  };

  const logoutOnClick = () => {
    navigate("/");
    Cookies.remove("firebaseIdToken");
    Cookies.remove("userRole");
    window.location.reload();
  };

  return (
    <div className={classes.container}>
      <div className={classes.leftside}>
        <Link onClick={handleLogoClick}>
          <img src={ILLogo} width={50} height={50} />
        </Link>
        <Text fw={700} fz="xl">
          Top Care Fashion
        </Text>
      </div>
      <Button onClick={logoutOnClick}>Log out</Button>
    </div>
  );
}

export default AdminHeader;
