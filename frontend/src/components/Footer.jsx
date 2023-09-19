import React from "react";
import classes from "./Footer.module.css";
import { Text } from "@mantine/core";

import IconInstagram from "../assets/icons/ic_instagram.svg";
import IconFacebook from "../assets/icons/ic_facebook.svg";
import IconTwitter from "../assets/icons/ic_twitter.svg";

function Footer() {
  return (
    <footer className={classes.container}>
      <div className={classes.leftSide}>
        <Text size="xl" fw={700}>
          Top Care Fashion
        </Text>
        <Text size="md">
          We've harmoniously fused the expansive realm of fashion with the
          reliability of a secure marketplace. Committed to embracing a variety
          of styles, we link enthusiastic sellers with discerning buyers,
          guaranteeing that each transaction is as exceptional as the items
          exchanged. Our platform is a testament to the ever-evolving fashion
          industry, presenting a thoughtfully curated collection of clothing
          that appeals to both trendsetters and those with classic tastes.
          Beyond fashion, our name embodies trust, transparency, and exceptional
          customer service.
        </Text>

        <Text size="xl" fw={700}>
          Find us on
        </Text>
        <div className={classes.socialMediaContainer}>
          <img src={IconInstagram} width={50} height={50} />
          <img src={IconFacebook} width={50} height={50} />
          <img src={IconTwitter} width={50} height={50} />
        </div>
      </div>

      <div className={classes.rightSide}>
        <Text size="xl" fw={700}>
          Resources
        </Text>
        <div className={classes.linkContainer}>
          <a className={classes.link}>FAQ</a>
          <a className={classes.link}>Feedback</a>
        </div>
        <Text>© Top Care Fashion</Text>
      </div>
    </footer>
  );
}

export default Footer;
