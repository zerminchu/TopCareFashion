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

const useStyles = createStyles((theme) => ({
  root: {
    position: "flex",
  },

  input: {
    height: rem(54),
    paddingTop: rem(18),
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
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();

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

      // Prepare form data for the POST request
      const formData = new FormData();
      // eslint-disable-next-line no-unused-vars
      files.forEach((file, index) => {
        formData.append("files", file); // Use the key 'files' for the array of files
      });
      formData.append("category", category);
      formData.append("condition", condition);
      formData.append("colour", colour);
      formData.append("user_id", currentUser.user_id);

      // Send data to the backend using Axios
      const response = await axios.post(
        "http://localhost:8000/add-product/",
        formData
      );

      console.log(response.data); // Success message
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedImages = localStorage.getItem("uploadedImages");
    if (storedImages) {
      setUploadedImages(JSON.parse(storedImages));
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Container my="md">
          <SimpleGrid cols={4} breakpoints={[{ maxWidth: "xs", cols: 1 }]}>
            {uploadedImages.map((imageSrc, index) => (
              <Container key={index}>
                <img
                  src={imageSrc}
                  alt={`Uploaded ${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    borderRadius: theme.radius.md,
                  }}
                />
              </Container>
            ))}
          </SimpleGrid>
        </Container>
        <TextInput
          label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          placeholder="Top"
          classNames={classes}
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
        />
        <br />
        <TextInput
          label="Colour"
          value={colour}
          onChange={(event) => setColour(event.target.value)}
          placeholder="Red"
          classNames={classes}
        />
        <br />
        <Button type="submit"> Submit</Button>
      </form>
    </div>
  );
}

export default ListItem;
