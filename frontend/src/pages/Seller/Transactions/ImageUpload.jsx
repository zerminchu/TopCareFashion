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
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import axios from "axios";

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
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [newlyUploadedIndex, setNewlyUploadedIndex] = useState(null);

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
    setShowButtons(true); // Show buttons when images are uploaded
  };

  useEffect(() => {
    const storedImages = localStorage.getItem("uploadedImages");
    if (storedImages) {
      setUploadedImages(JSON.parse(storedImages));
      setShowButtons(true); // Show buttons if there are stored images
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

  // Route restriction only for seller
  useEffect(() => {
    if (currentUser && currentUser.role !== "seller") {
      navigate("/", { replace: true });
    }
  }, [currentUser]);

  const handleClick = () => {
    if (uploadedImages.length > 0) {
      const firstImageUrl = uploadedImages[0];

      fetch(firstImageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          // Create a FormData object and append the first image as a File
          const formData = new FormData();
          formData.append(
            "image",
            new File([blob], `image.png`, { type: "image/png" })
          );
          axios
            .post("http://localhost:8000/classify-image/", formData)
            .then((response) => {
              const data = response.data;
              console.log(data);

              if (uploadedImages.length === 3) {
                const imageFiles = uploadedImages.map((blobUrl, index) => {
                  const blob = fetch(blobUrl).then((r) => r.blob());
                  return new File([blob], `image_${index}.png`, {
                    type: "image/png",
                  });
                });
                navigate("/seller/create-listing", {
                  state: {
                    uploadedImages: imageFiles,
                    predictedCategory: data.category,
                  },
                });
              } else {
                console.log("Less than three images uploaded.");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        });
    } else if (loaded) {
      setLoaded(false);
      setUploadedImages([]);
      setShowButtons(false);
    } else if (!interval.active) {
      interval.start();
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newImages = [...uploadedImages];
    const [reorderedItem] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, reorderedItem);

    setUploadedImages(newImages);
    localStorage.setItem("uploadedImages", JSON.stringify(newImages));
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

    if (newImages.length === 0) {
      setShowButtons(false); // Hide buttons when images are removed
    }
  };

  return (
    <div>
      <div>
        <div className={classes.wrapper}>
          <div
            style={{
              width: "500px",
              margin: "0 auto",
              marginTop: "80px",
              padding: "0 20px",
            }}
          >
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
                  <i>.jpg or .png</i> and a maximum of 3 images are allowed.
                </Text>
              </div>
            </Dropzone>
          </div>

          <Button
            className={classes.control}
            size="md"
            radius="xl"
            onClick={() => openRef.current?.()}
          >
            Select images
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="uploaded-images" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {uploadedImages.map((imageSrc, index) => (
                  <Draggable
                    key={index}
                    draggableId={`image-${index}`} // Use a unique identifier for each draggable item
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          width: "200px", // Set the width of each image container
                          height: "200px", // Set the height of each image container
                          border: `1px solid ${theme.colors.gray[3]}`, // Add a border
                          margin: "10px", // Add margin to space out the images
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={imageSrc}
                          alt={`Uploaded ${index}`}
                          style={{
                            maxWidth: "100%", // Ensure the image fits within the container
                            maxHeight: "100%", // Ensure the image fits within the container
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {showButtons && uploadedImages.length === 3 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "70px",
            }}
          >
            <Button
              className={classes.button_1}
              size="md"
              radius="md"
              onClick={handleClick}
              color="teal"
              style={{
                width: "200px", // Set a fixed width for both buttons
                margin: "0 auto", // Center align horizontally
              }}
            >
              <div className={classes.label}>Next</div>
            </Button>
            <br />
          </div>
        )}

        {showButtons && uploadedImages.length > 0 && (
          <div
            style={{
              marginTop: "30px",
              width: "200px", // Set a fixed width for both buttons
              margin: "0 auto", // Center align horizontally
              textAlign: "center",
            }}
          >
            <Button
              className={classes.button_1}
              size="md"
              radius="md"
              onClick={() => handleImageRemove(uploadedImages.length - 1)}
              color="red"
              style={{
                marginBottom: "5px",
                width: "200px", // Set a fixed width for both buttons
                margin: "0 auto", // Center align horizontally
              }}
            >
              Remove Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
