import React from "react";
import classes from "./Footer.module.css";
import IconFacebook from "../../assets/icons/ic_facebook.svg";
import IconInstagram from "../../assets/icons/ic_instagram.svg";
import IconTwitter from "../../assets/icons/ic_twitter.svg";
import { Text } from "@mantine/core";

function Footer() {
  return (
    <footer className={classes.container}>
      <div className={classes.leftSide}>
        <Text size="xl" fw={700}>
          Top Care Fashion
        </Text>
        <Text size="md">
          "We seamlessly combine the vast world of fashion with a trustworthy
          marketplace. Our commitment to diverse styles unites passionate
          sellers with discerning buyers, ensuring each transaction is
          exceptional. Our platform epitomises the ever-evolving fashion
          industry, featuring a carefully curated collection that caters to both
          trendsetters and those with classic tastes. Beyond fashion, our name
          represents trust, transparency, and outstanding customer service."
        </Text>

        <Text size="xl" fw={700}>
          Find us on
        </Text>
        <div className={classes.socialMediaContainer}>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={IconFacebook} alt="Facebook" width={32} height={32} />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={IconInstagram} alt="Instagram" width={32} height={32} />
          </a>

          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={IconTwitter} alt="Twitter" width={32} height={32} />
          </a>
        </div>
      </div>

      <div className={classes.rightSide}>
        <Text size="xl" fw={700}>
          Resources
        </Text>
        <div className={classes.linkContainer}>
          <a href="/frequently-ask-question" className={classes.link}>
            FAQ
          </a>
          <a href="/feedback-form" className={classes.link}>
            Feedback
          </a>
        </div>
        <Text>© Top Care Fashion</Text>
      </div>
    </footer>
  );
}

export default Footer;
