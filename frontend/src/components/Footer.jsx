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
          TopCare Fashion
        </Text>
        <Text size="md">
          we've seamlessly blended the vast world of fashion with the integrity
          of a secure marketplace. Dedicated to celebrating diverse styles, we
          connect passionate sellers with discerning buyers, ensuring that every
          transaction is as unique as the pieces exchanged. Our platform stands
          as a testament to the fashion industry's dynamism, offering a curated
          selection of apparel that speaks to both trendsetters and classic
          style aficionados. Beyond fashion, our name is synonymous with trust,
          transparency, and top-notch customer care.
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
          <a href="/faq" className={classes.link}>
            FAQ
          </a>
          <a href="/feedback" className={classes.link}>
            Feedback
          </a>
        </div>
        <Text>© TopCare Fashion</Text>
      </div>
    </footer>
  );
}

export default Footer;
