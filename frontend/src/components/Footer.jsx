import React from "react";
import classes from "./Footer.module.css";

function Footer() {
  return (
    <footer className={classes.footerContainer}>
      <div className={classes.leftContent}>
        <h4>Your Title</h4>
        <p>Your description goes here.</p>
      </div>

      <div className={classes.rightContent}>
        <a href="/faq" className={classes.link}>
          FAQ
        </a>
        <a href="/feedback" className={classes.link}>
          Feedback
        </a>
      </div>
    </footer>
  );
}

export default Footer;
