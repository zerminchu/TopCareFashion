/* eslint-disable no-unused-vars */
import React from "react";

import { Accordion, Container, Title, createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    minHeight: 650,
    background:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.md,
  },

  title: {
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    textAlign: "center",
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
  },

  item: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
  },

  question: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    fontSize: "18px",
    fontWeight: "bold",
  },

  answer: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.black,
    fontSize: "16px",
  },
}));

const resetPasswordExplanation =
  "To reset your password, simply click on the 'Sign In' button. You will be prompted to enter the email associated with your account. Once done, a password reset link will be sent to your email for your convenience.";

const multipleAccountsExplanation =
  "Of course! Our system allows you to create multiple accounts, each linked to a unique email address. Feel free to register new accounts using different email addresses.";

const paymentSystemExplanation =
  "We've integrated with the secure and reliable STRIPE payment system to provide you with the utmost security when processing payments.";

const listProductExplanation =
  "Listing a product is a breeze. Click on the 'List Product' button located in the upper right corner of the screen. When you upload an image of the product, our advanced machine learning model will assist in categorising the image for you. Additionally, fill in various details, including pickup location and product description. Once all fields are complete, click 'Submit' to list your product.";

const editListingExplanation =
  "Editing an existing product listing is simple. While on the homepage showcasing your listed products, click on the 'Edit' button (usually represented by three lines). This action will take you to a form where you can effortlessly make any necessary changes to the product details.";

const pastTransactionsExplanation =
  "To view your past transactions, click on the dropdown menu next to your profile picture and select the 'Transactions' option. Here, you'll find a comprehensive list of all your previous transactions.";

function FaqFormal() {
  const { classes } = useStyles();

  return (
    <Container size="sm" className={classes.wrapper}>
      <Title align="center" className={classes.title}>
        Frequently Asked Questions (FAQ)
      </Title>

      <Accordion variant="separated">
        <Accordion.Item className={classes.item} value="reset-password">
          <Accordion.Control className={classes.question}>
            How can I reset my password?
          </Accordion.Control>
          <Accordion.Panel className={classes.answer}>
            {resetPasswordExplanation}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="another-account">
          <Accordion.Control className={classes.question}>
            Can I create multiple accounts?
          </Accordion.Control>
          <Accordion.Panel className={classes.answer}>
            {multipleAccountsExplanation}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="payment">
          <Accordion.Control className={classes.question}>
            What payment system do you use?
          </Accordion.Control>
          <Accordion.Panel className={classes.answer}>
            {paymentSystemExplanation}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Title align="center" className={classes.title}>
        Technical Guide
      </Title>

      <Accordion variant="separated">
        <Accordion.Item className={classes.item} value="Tech-2">
          <Accordion.Control className={classes.question}>
            How do I list a product?
          </Accordion.Control>
          <Accordion.Panel className={classes.answer}>
            {listProductExplanation}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="Tech-3">
          <Accordion.Control className={classes.question}>
            How can I edit an existing product listing?
          </Accordion.Control>
          <Accordion.Panel className={classes.answer}>
            {editListingExplanation}
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="Tech-4">
          <Accordion.Control className={classes.question}>
            How do I access my past transactions?
          </Accordion.Control>
          <Accordion.Panel className={classes.answer}>
            {pastTransactionsExplanation}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}

export default FaqFormal;
