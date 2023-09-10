import {
  SimpleGrid,
  Container,
  useMantineTheme,
  createStyles,
  rem,
  TextInput,
  Button,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import { showNotifications } from "../../utils/ShowNotification";

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
  const { classes } = useStyles();
  const [uploadedImages, setUploadedImages] = useState(uploadedImagesFromRoute);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [colour, setColour] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity_available, setQuantityAvailable] = useState("");
  const [collection_address, setCollectionAddress] = useState("");
  const [avail_status, setAvailStatus] = useState("");
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false);

  const navigate = useNavigate();
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

  useEffect(() => {
    if (location.state?.category) {
      setCategory(location.state.category);
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
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

      showNotifications({
        title: "Success",
        message: "Your item have been listed onto the marketplace",
        status: "success",
      });

      setSubmissionSuccessful(true);
      localStorage.removeItem("uploadedImages");
    } catch (error) {
      showNotifications({
        status: "error",
        title: "Error",
      });
    }
  };

  useEffect(() => {
    const storedImages = localStorage.getItem("uploadedImages");
    if (storedImages) {
      setUploadedImages(JSON.parse(storedImages));
    }
  }, []);

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
              fontWeight: "700px",
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
        <TextInput
          label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Top"
          classNames={classes}
          style={{ width: "50%" }}
        />
        <br />
        {/*  <Select
          mt="md"
          withinPortal
          data={["Brand New", "Well Used", "Heavily Used"]}
          placeholder="Pick one"
          label="Condition"
          value={condition}
          onChange={(event) => setCondition(event.target.value)}
          //classNames={classes}
        /> */}

        <TextInput
          label="Condition"
          value={condition}
          onChange={(event) => setCondition(event.target.value)}
          placeholder="New"
          classNames={classes}
          style={{ width: "50%" }}
        />
        <br />
        <TextInput
          label="Colour"
          value={colour}
          onChange={(event) => setColour(event.target.value)}
          placeholder="Red"
          classNames={classes}
          style={{ width: "50%" }}
        />
        <br />
        <TextInput
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Give your item a title"
          classNames={classes}
          style={{ width: "50%" }}
        />
        <br />
        <TextInput
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Give your item a description"
          classNames={classes}
          style={{ width: "50%" }}
        />
        <br />
        <TextInput
          label="Price"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="$123"
          classNames={classes}
          style={{ width: "50%" }}
        />
        <br />
        <TextInput
          label="Quantity"
          value={quantity_available}
          onChange={(event) => setQuantityAvailable(event.target.value)}
          placeholder="10"
          classNames={classes}
          style={{ width: "50%" }}
        />
        <br />
        <TextInput
          label="Collection Address"
          value={collection_address}
          onChange={(event) => setCollectionAddress(event.target.value)}
          placeholder="123, Clementi Road"
          classNames={classes}
          style={{ width: "50%" }}
        />
        <br />
        <TextInput
          label="Status"
          value={avail_status}
          onChange={(event) => setAvailStatus(event.target.value)}
          classNames={classes}
          style={{ width: "50%" }}
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
            <Button type="submit" onClick={() => navigate("/")}>
              Submit
            </Button>
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
