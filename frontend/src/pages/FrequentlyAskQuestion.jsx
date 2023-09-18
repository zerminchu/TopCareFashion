/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { retrieveUserInfo } from "../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import {

  Container,
  Title,
  Accordion,
  createStyles,
  rem,
} from "@mantine/core";


const useStyles = createStyles((theme) => ({
  wrapper: {
    paddingTop: `calc(${theme.spacing.xl} * 2)`,
    paddingBottom: `calc(${theme.spacing.xl} * 2)`,
    minHeight: 650,
  },

  title: {
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },

  item: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));




const forgotPassword = "Click the sign in button and navigate to the forgot password button, you will need to put in your email address that you want to reset the password, and a link will be sent to that email for the password reset.";

const moreThanOneAccount = "Yes, each account is created using an email, you can register for a new account using a different email.";

const premiumFeature = "Our clothes reccomender mode is a Chat Bot in which you can ask it for outfit ideas, you can prompt it with questions such as what kind of outfit would be good for this occasion, and it will generate a picture of a outfit that would fit the occasion, it can also be asked questions about the what type of clothing piece goes well with another piece of clothing based on your own personalized style.";

const paymentSystem = "We work with STRIPE payment system, it is a secure gateway used to process payment.";

const ListProduct= "Listing a product is done by clicking on the list product button on the top right of the screen, it will ask you for 3 images of the product. Afterwhich, will ask you to fill various fields about the product including pickup location and product description, once all fields are filled. Click the Submit button and the product will be listed.";

const editListing = "In the home page where all your products are listed, simply click on the edit button(triple line) and it will bring you back to the form where you can edit the details of the product.";

const pastTransaction = "Click on the dropdown menu next to your profile picture and click on transactions button, all your past trasactions will be listed there.";

const checkOrderStatus = "In the "
export function FaqSimple() {
  const navigate = useNavigate();
  const { classes } = useStyles();

  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
      } catch (error) {
        console.log(error);
      }
    };

    // Check if user has signed in before
    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  // Route restriction only for seller
  // useEffect(() => {
  //   if (currentUser && currentUser.role !== "seller") {
  //     navigate("/", { replace: true });
  //   }
  // }, [currentUser]);

  return (
    <Container size="sm" className={classes.wrapper}>
      <div>
        <Title align="center" className={classes.title}>
          Frequently Asked Questions
        </Title>

        <Accordion variant="separated">
          <Accordion.Item className={classes.item} value="forgot-password">
            <Accordion.Control>How can i reset forgotten password?</Accordion.Control>
            <Accordion.Panel>{forgotPassword}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="another-account">
            <Accordion.Control>
              Can I create more that one account?
            </Accordion.Control>
            <Accordion.Panel>{moreThanOneAccount}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="clothes-reccomender">
            <Accordion.Control>
              What is the premium feature?
            </Accordion.Control>
            <Accordion.Panel>{premiumFeature}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="payment">
            <Accordion.Control>
              What payment systems to you work with?
            </Accordion.Control>
            <Accordion.Panel>{paymentSystem}</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
      <div>
        <Title align="center" className={classes.title}>
          Technical Guide
        </Title>

        <Accordion variant="separated">

          <Accordion.Item className={classes.item} value="Tech-2">
            <Accordion.Control>
              How do I list a product?
            </Accordion.Control>
            <Accordion.Panel>{ListProduct}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="Tech-3">
            <Accordion.Control>
              How do I edit a existing product listing?
            </Accordion.Control>
            <Accordion.Panel>{editListing}</Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item className={classes.item} value="payment">
            <Accordion.Control>
              How do I check past transactions?
            </Accordion.Control>
            <Accordion.Panel>{pastTransaction}</Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </Container>
  );
}

export default FaqSimple;
