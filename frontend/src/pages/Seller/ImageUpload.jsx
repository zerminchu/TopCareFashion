/* eslint-disable no-unused-vars */
import { useRef, useState, useEffect } from "react";
import {
  Text,
  Group,
  Button,
  createStyles,
  Progress,
  rem,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons-react";
import { useInterval } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { Container, SimpleGrid } from "@mantine/core";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";

//import axios from "axios";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    marginBottom: rem(30),
  },

  dropzone: {
    borderWidth: rem(1),
    paddingBottom: rem(50),
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  control: {
    position: "absolute",
    width: rem(250),
    left: `calc(50% - ${rem(125)})`,
    bottom: rem(-20),
  },

  button_1: {
    position: "relative",
    transition: "background-color 150ms ease",
  },

  progress: {
    ...theme.fn.cover(-1),
    height: "auto",
    backgroundColor: "transparent",
    zIndex: 0,
  },

  label: {
    position: "relative",
    zIndex: 1,
  },
}));

function ImageUpload() {
  const { classes, theme } = useStyles();
  const openRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();

  const handleDrop = (files) => {
    const allowedFormats = ["image/jpeg", "image/png"];
    const newImages = [...uploadedImages];

    for (const file of files) {
      if (allowedFormats.includes(file.type) && newImages.length < 3) {
        newImages.push(URL.createObjectURL(file));
      }
    }

    setUploadedImages(newImages);
    localStorage.setItem("uploadedImages", JSON.stringify(newImages)); // Save to local storage
  };

  useEffect(() => {
    const storedImages = localStorage.getItem("uploadedImages");
    if (storedImages) {
      setUploadedImages(JSON.parse(storedImages));
    }
  }, []);

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

  const handleClick = () => {
    if (uploadedImages.length === 3) {
      /*   if (uploadedImages[0]) {
        classifyAndNavigate(); */
      if (uploadedImages.length === 3) {
        const imageFiles = uploadedImages.map((blobUrl, index) => {
          const blob = fetch(blobUrl).then((r) => r.blob());
          return new File([blob], `image_${index}.png`, { type: "image/png" });
        });

        // Navigate to the ListItem component with uploaded images as state
        navigate("/create-listing", { state: { uploadedImages: imageFiles } });
      }
    } else if (loaded) {
      setLoaded(false);
      setUploadedImages([]);
    } else if (!interval.active) {
      interval.start();
    }
  };

  const interval = useInterval(
    () =>
      setProgress((current) => {
        if (current < 100) {
          return current + 1;
        }

        interval.stop();
        setLoaded(true);
        return 0;
      }),
    20
  );

  const handleImageRemove = (indexToRemove) => {
    const newImages = uploadedImages.filter(
      (_, index) => index !== indexToRemove
    );
    setUploadedImages(newImages);
    localStorage.setItem("uploadedImages", JSON.stringify(newImages));
  };

  return (
    <div>
      <div>
        <div className={classes.wrapper}>
          <Dropzone
            openRef={openRef}
            onDrop={handleDrop}
            className={classes.dropzone}
            radius="md"
            accept={["image/png", "image/jpeg"]}
            maxSize={30 * 1024 ** 2}
          >
            <div style={{ pointerEvents: "none" }}>
              <Group position="center">
                <Dropzone.Accept>
                  <IconDownload
                    size={rem(50)}
                    color={theme.colors[theme.primaryColor][6]}
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    size={rem(50)}
                    color={theme.colors.red[6]}
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconCloudUpload
                    size={rem(50)}
                    color={
                      theme.colorScheme === "dark"
                        ? theme.colors.dark[0]
                        : theme.black
                    }
                    stroke={1.5}
                  />
                </Dropzone.Idle>
              </Group>

              <Text ta="center" fw={700} fz="lg" mt="xl">
                <Dropzone.Accept>Drop files here</Dropzone.Accept>
                <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
                <Dropzone.Idle>Upload images</Dropzone.Idle>
              </Text>
              <Text ta="center" fz="sm" mt="xs" c="dimmed">
                Drag&apos;n&apos;drop files here to upload. We can accept only{" "}
                <i>.jpg or .png</i> files that are less than 30mb in size.
              </Text>
            </div>
          </Dropzone>

          <Button
            className={classes.control}
            size="md"
            radius="xl"
            onClick={() => openRef.current?.()}
          >
            Select images
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {uploadedImages.map((imageSrc, index) => (
            <Container key={index} my="md" style={{ flex: 1 }}>
              <SimpleGrid
                cols={2}
                spacing="md"
                breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                style={{ aspectRatio: "4 / 3" }} // Set a 1:1 aspect ratio
              >
                <img
                  src={imageSrc}
                  alt={`Uploaded ${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center", // Center the image
                  }}
                />
              </SimpleGrid>
            </Container>
          ))}
        </div>
      </div>
      <Button
        fullWidth
        className={classes.button_1}
        onClick={handleClick}
        color={uploadedImages.length === 3 ? "teal" : theme.primaryColor}
        disabled={uploadedImages.length !== 3} // Disable if not exactly 3 images
      >
        <div className={classes.label}>
          {uploadedImages.length === 3
            ? "Next"
            : loaded
            ? "Files uploaded"
            : "Please upload at least 3 images"}
        </div>

        {progress !== 0 && (
          <Progress
            value={progress}
            className={classes.progress}
            color={theme.colors[theme.primaryColor][2]}
            radius="sm"
          />
        )}
      </Button>
      <Button
        fullWidth
        className={classes.button_1}
        onClick={() => handleImageRemove(uploadedImages.length - 1)}
        color="red"
      >
        Remove Image
      </Button>
    </div>
  );
}

export default ImageUpload;
