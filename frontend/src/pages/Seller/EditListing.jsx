import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import {
  Text,
  Button,
  TextInput,
  Radio,
  Select,
  Textarea,
  NumberInput,
} from "@mantine/core";
import DummyImage from "../../assets/illustrations/il_avatar.png";
import IconUpload from "../../assets/icons/ic_upload.svg";
import { useForm } from "@mantine/form";

import classes from "./EditListing.module.css";

function EditListing() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();

  const form = useForm({
    initialValues: {
      category: "top wear",
      condition: "brand new",
      colour: "pink",
      title: "My best clothes",
      description: "my description ....",
      price: 879.88,
      quantity: 23,
      collection_address: "clementi rd",
      status: "available",
    },
  });

  const updateOnClickHandler = async () => {
    console.log(form.values);
  };

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
        console.log(user);
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

  return (
    <div className={classes.container}>
      <div className={classes.leftside}>
        <img src={DummyImage} className={classes.mainimage} />
        <div className={classes.secondaryimagewrapper}>
          <img src={DummyImage} className={classes.secondaryimage} />
          <img src={DummyImage} className={classes.secondaryimage} />
          <img src={DummyImage} className={classes.secondaryimage} />
        </div>
      </div>
      <div className={classes.rightside}>
        <div className={classes.menu}>
          <Text>Category</Text>
          <TextInput
            placeholder="Your name"
            disabled
            value={form.values.category}
          />
          <div className={classes.uploadwrapper}>
            <img src={IconUpload} width={30} height={30} />
            <Button>Upload</Button>
          </div>
        </div>

        <div className={classes.menu}>
          <Text>Condition</Text>
          <Radio.Group
            className={classes.conditionwrapper}
            value={form.values.condition}
            onChange={(value) => form.setValues({ condition: value })}
          >
            <Radio value="brand new" label="Brand New" />
            <Radio value="well used" label="Well Used" />
            <Radio value="heavily used" label="Heavily Used" />
          </Radio.Group>
        </div>

        <div className={classes.menu}>
          <Text>Colour</Text>
          <Select
            placeholder="Pick one"
            data={[
              { value: "red", label: "Red" },
              { value: "blue", label: "Blue" },
              { value: "yellow", label: "Yellow" },
              { value: "pink", label: "Pink" },
            ]}
          />
        </div>

        <div className={classes.menu}>
          <Text>Title</Text>
          <TextInput
            placeholder="Title"
            value={form.values.title}
            {...form.getInputProps("title")}
          />
        </div>

        <div className={classes.menu}>
          <Text>Description</Text>
          <Textarea
            value={form.values.description}
            {...form.getInputProps("description")}
          />
        </div>

        <div className={classes.menu}>
          <Text>Price</Text>
          <NumberInput
            hideControls
            decimalSeparator="."
            thousandsSeparator=","
            precision={2}
            step={0.5}
            defaultValue={form.values.price}
          />
        </div>

        <div className={classes.menu}>
          <Text>Quantity</Text>
          <NumberInput defaultValue={form.values.quantity} />
        </div>

        <div className={classes.menu}>
          <Text>Collection address</Text>
          <TextInput
            value={form.values.collection_address}
            {...form.getInputProps("collection_address")}
          />
        </div>

        <div className={classes.menu}>
          <Text>Status</Text>
          <Radio.Group
            className={classes.conditionwrapper}
            value={form.values.status}
          >
            <Radio value="available" label="Available" />
            <Radio value="unavailable" label="Unavailable" />
          </Radio.Group>
        </div>

        <Button onClick={updateOnClickHandler}>Update listing</Button>
      </div>
    </div>
  );
}

export default EditListing;
