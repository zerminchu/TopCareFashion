import {
  SimpleGrid,
  Container,
  useMantineTheme,
  createStyles,
  rem,
  TextInput,
  Button,
  Select,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import { showNotifications } from "../../../utils/ShowNotification";
import { useDispatch } from "react-redux";
import { Badge } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    position: "flex",
  },

  input: {
    height: rem(54),
    paddingTop: rem(18),
    width: "100%",
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    fontSize: theme.fontSizes.xs,
    paddingLeft: theme.spacing.sm,
    paddingTop: `calc(${theme.spacing.sm} / 2)`,
    zIndex: 1,
  },
}));

function ListItem() {
  const theme = useMantineTheme();
  const location = useLocation();
  const uploadedImagesFromRoute = location.state?.uploadedImages || [];
  const predictedCategoryFromRoute = location.state?.predictedCategory || "";

  const { classes } = useStyles();
  const [uploadedImages, setUploadedImages] = useState(uploadedImagesFromRoute);
  const [category, setCategory] = useState(predictedCategoryFromRoute);
  const [condition, setCondition] = useState("");
  const [colour, setColour] = useState("");
  const [gender, setGender] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity_available, setQuantityAvailable] = useState("");
  const [collection_address, setCollectionAddress] = useState("");
  const [avail_status, setAvailStatus] = useState("");
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  useEffect(() => {
    if (currentUser && currentUser.role !== "seller") {
      navigate("/", { replace: true });
    }
  }, [currentUser]);

  useEffect(() => {
    if (location.state?.category) {
      setCategory(location.state.category);
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    try {
      dispatch({ type: "SET_LOADING", value: true });

      // Convert blob URLs to File objects
      const filePromises = uploadedImages.map((blobUrl) =>
        fetch(blobUrl).then((response) => response.blob())
      );

      const files = await Promise.all(filePromises);

      const formData = new FormData();
      // eslint-disable-next-line no-unused-vars
      files.forEach((file, index) => {
        formData.append("files", file); // Use the key 'files' for the array of files
      });

      formData.append("gender", gender);
      formData.append("category", category);
      formData.append("condition", condition);
      formData.append("colour", colour);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity_available", quantity_available);
      formData.append("collection_address", collection_address);
      formData.append("user_id", currentUser.user_id);
      formData.append("avail_status", avail_status);

      await axios.post("http://localhost:8000/add-product/", formData);

      navigate("/", { replace: true });
      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        title: "Success",
        message: "Your item have been listed onto the marketplace",
        status: "success",
      });

      setSubmissionSuccessful(true);
      localStorage.removeItem("uploadedImages");
      navigate("/");
    } catch (error) {
      dispatch({ type: "SET_LOADING", value: false });

      showNotifications({
        title: "Error",
        message: "Oops! There is an error creating a listing!",
        status: "error",
      });
    }
  };

  useEffect(() => {
    const storedImages = localStorage.getItem("uploadedImages");
    if (storedImages) {
      setUploadedImages(JSON.parse(storedImages));
    }
  }, []);

  const validateCategory = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Category should not be blank";
      if (/^\s$|^\s+.|.\s+$/.test(value))
        return "Category should not contain trailing/leading whitespaces";
    }
    return null;
  };

  const validateCondition = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Condition should not be blank";
      if (/^\s$|^\s+.|.\s+$/.test(value))
        return "Condition should not contain trailing/leading whitespaces";
    }
    return null;
  };

  const validateColour = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Colour should not be blank";
      if (/^\s$|^\s+.|.\s+$/.test(value))
        return "Colour should not contain trailing/leading whitespaces";
    }
    return null;
  };
  const validateTitle = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Title should not be blank";
      if (/^\s$|^\s+.|.\s+$/.test(value))
        return "Title should not contain trailing/leading whitespaces";
    }
    return null;
  };

  const validateDescription = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Description should not be blank";
      if (/^\s$|^\s+.|.\s+$/.test(value))
        return "Description should not contain trailing/leading whitespaces";
    }
    return null;
  };

  const validatePrice = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Price should not be blank";
    }
    return null;
  };

  const validateQuantityAvailable = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Quantity Available should not be blank";
    }
    return null;
  };

  const validateCollectionAddress = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Collection Address should not be blank";
      if (/^\s$|^\s+.|.\s+$/.test(value))
        return "Collection Address should not contain trailing/leading whitespaces";
    }
    return null;
  };

  const validateAvailStatus = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Available Status should not be blank";
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <Container my="md">
        <div
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            borderRadius: "4px",
          }}
        >
          <div
            style={{
              marginBottom: "16px",
              fontSize: theme.fontSizes.md,
              fontWeight: "bold",
            }}
          >
            {submissionSuccessful ? "Uploaded Images" : "Preview Images"}
          </div>
          <SimpleGrid cols={3} breakpoints={[{ maxWidth: "xs", cols: 1 }]}>
            {uploadedImages.map((imageSrc, index) => (
              <div
                key={index}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "16px",
                  padding: "16px",
                  border: "1px solid #ccc",
                  borderRadius: theme.radius.md,
                  justifyContent: "center", // Center content vertically and horizontally
                  textAlign: "center", // Center text horizontally
                  overflow: "hidden", // Clip image to container boundaries
                }}
              >
                <img
                  src={imageSrc}
                  alt={`Uploaded ${index}`}
                  style={{
                    width: "100%", // Make the image fill the container width
                    height: "100%", // Make the image fill the container height
                    objectFit: "cover", // Cover the entire container
                  }}
                />
              </div>
            ))}
          </SimpleGrid>
        </div>
      </Container>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "inline-block",
            width: "50%",
            marginBottom: "10px",
          }}
        >
          <TextInput
            label="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Top"
            classNames={classes}
            error={validateCategory(category)}
          />
          <Badge
            color="violet"
            style={{
              position: "absolute",
              top: "50%",
              right: "5px",
              transform: "translateY(-50%)",
            }}
          >
            PREDICTED
          </Badge>
        </div>

        <Select
          mt="md"
          withinPortal
          data={[
            { value: "Brand New", label: "Brand New" },
            { value: "Lightly Used", label: "Lightly Used" },
            { value: "Well Used", label: "Well Used" },
          ]}
          placeholder="Brand New"
          label="Condition"
          value={condition}
          classNames={classes}
          style={{ width: "50%" }}
          onChange={(selectedValue) => setCondition(selectedValue)}
          error={validateCondition(condition)}
        />
        <br />

        {/*  <TextInput
          label="Condition"
          value={condition}
          onChange={(event) => setCondition(event.target.value)}
          placeholder="New"
          classNames={classes}
          style={{ width: "50%" }}
        />
        <br /> */}
        <TextInput
          label="Colour"
          value={colour}
          onChange={(event) => setColour(event.target.value)}
          placeholder="Red"
          classNames={classes}
          style={{ width: "50%" }}
          error={validateColour(colour)}
        />
        <br />
        <Select
          mt="md"
          withinPortal
          data={[
            { value: "men", label: "Men" },
            { value: "women", label: "Women" },
          ]}
          placeholder="Men"
          label="Gender"
          value={gender}
          classNames={classes}
          style={{ width: "50%" }}
          onChange={(selectedValue) => setGender(selectedValue)}
          error={validateCondition(gender)}
        />
        <br />
        <TextInput
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Oversized T-Shirt"
          classNames={classes}
          style={{ width: "50%" }}
          error={validateTitle(title)}
        />
        <br />
        <TextInput
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Give your item a description"
          classNames={classes}
          style={{ width: "50%" }}
          error={validateDescription(description)}
        />
        <br />
        <TextInput
          label="Price"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="$ 123"
          classNames={classes}
          style={{ width: "50%" }}
          error={validatePrice(price)}
        />
        <br />
        <TextInput
          label="Quantity Available"
          value={quantity_available}
          onChange={(event) => setQuantityAvailable(event.target.value)}
          placeholder="10"
          classNames={classes}
          style={{ width: "50%" }}
          error={validateQuantityAvailable(quantity_available)}
        />
        <br />
        <TextInput
          label="Collection Address"
          value={collection_address}
          onChange={(event) => setCollectionAddress(event.target.value)}
          placeholder="123, Clementi Road"
          classNames={classes}
          style={{ width: "50%" }}
          error={validateCollectionAddress(collection_address)}
        />
        <br />
        <Select
          mt="mt"
          withinPortal
          data={[
            { value: "Available", label: "Available" },
            { value: "Unavailable", label: "Unavailable" },
          ]}
          placeholder="Available"
          label="Available Status"
          value={avail_status}
          classNames={classes}
          style={{ width: "50%" }}
          onChange={(selectedValue) => setAvailStatus(selectedValue)}
          error={validateAvailStatus(avail_status)}
        />
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <div style={{ marginRight: "8px" }}>
            <Button type="submit">Submit</Button>
          </div>
          <Button type="button" onClick={() => navigate("/")} variant="outline">
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ListItem;
