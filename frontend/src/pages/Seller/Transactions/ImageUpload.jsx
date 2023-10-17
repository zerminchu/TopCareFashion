/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import { useRef, useState, useEffect } from "react";
import { Text, Group, Button, createStyles, rem, Modal } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons-react";
import { useInterval } from "@mantine/hooks";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  confirmation: {
    display: "flex",
    flexDirection: "column",
    /* padding: rem(10),
    gap: rem(5),
    width: rem(200),
    borderRadius: rem(5),
    backgroundColor: theme.colors.blue[0], */
  },

  buttonConfirmation: {
    display: "flex",
    flexDirection: "row",
    gap: rem(5),
    justifyContent: "center",
  },

  deleteContainer: {
    display: "flex",
    flexDirection: "column",
    gap: rem(10),
  },

  confirmationPrompt: {
    paddingBottom: "2.5%",
  },

  modalTitle: {
    fontSize: rem(18),
    fontWeight: 700,
    textAlign: "center",
    margin: `${rem(10)} 0`,
  },
}));

function ImageUpload() {
  const { classes, theme } = useStyles();
  const openRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [showModal, setShowModal] = useState(false);
  const [predictedCategory, setPredictedCategory] = useState("");
  const [predictedSubCategory, setPredictedSubCategory] = useState("");

  const [imageUploaded, setImageUploaded] = useState(false);
  const [correctCategory, setCorrectCategory] = useState("");
  const [showCorrectCategoryModal, setShowCorrectCategoryModal] =
    useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [fetchedCategory, setFetchedCategory] = useState("");
  const navigate = useNavigate();

  /*   useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const subCategory = searchParams.get("subCategories");
    setFetchedCategory(subCategory);
  }, []); */

  const handleDrop = (files) => {
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg"];
    const newImages = [...uploadedImages];

    for (const file of files) {
      if (allowedFormats.includes(file.type) && newImages.length < 1) {
        newImages.push(URL.createObjectURL(file));
        setImageUploaded(true);
      }
    }

    setUploadedImages(newImages);
    localStorage.setItem("uploadedImages", JSON.stringify(newImages));
    setShowButtons(true);
  };

  useEffect(() => {
    const storedImages = localStorage.getItem("uploadedImages");
    if (storedImages) {
      setUploadedImages(JSON.parse(storedImages));
      setShowButtons(true);
    }
  }, []);

  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
        const sellerPreferences = user.seller_preferences || {};
        const selectedSubCategories =
          sellerPreferences.selectedSubCategories || [];
        setFetchedCategory(selectedSubCategories.join(","));
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

  const handleClick = async () => {
    if (uploadedImages.length > 0) {
      const firstImageUrl = uploadedImages[0];

      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
        console.log(user);
      } catch (error) {
        console.log(error);
      }

      fetch(firstImageUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const formData = new FormData();

          formData.append(
            "image",
            new File([blob], `image.jpeg`, { type: "image/jpeg" })
          );

          const url =
            import.meta.env.VITE_NODE_ENV == "DEV"
              ? import.meta.env.VITE_API_DEV
              : import.meta.env.VITE_API_PROD;

          axios.post(`${url}/classify-image/`, formData).then((response) => {
            const data = response.data;
            setPredictedCategory(data.predicted_class);
            setPredictedSubCategory(data.predicted_subcategory);

            if (fetchedCategory.includes(data.predicted_subcategory)) {
              setShowModal(true);
            } else {
              setShowWarningModal(true);
            }
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

  const closeModal = () => {
    setShowModal(false);
    setShowWarningModal(false);
  };

  const proceedToCreateListing = () => {
    const imageFiles = uploadedImages.map((blobUrl, index) => {
      const blob = fetch(blobUrl).then((r) => r.blob());
      return new File([blob], `image_${index}.png`, {
        type: "image/png",
      });
    });

    navigate("/seller/create-listing", {
      state: {
        uploadedImages: imageFiles,
        predictedCategory: predictedCategory,
        predictedSubCategory: predictedSubCategory,
        correctCategory: correctCategory,
      },
    });
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
      setShowButtons(false);
    }

    setImageUploaded(false);
    setShowModal(false);
  };

  const handleSomethingIsWrong = () => {
    setShowCorrectCategoryModal(true);
    setShowModal(false);
  };

  const clothingCategories = [
    "Anorak",
    "Blazer",
    "Blouse",
    "Bomber",
    "Button-Down",
    "Caftan",
    "Capris",
    "Cardigan",
    "Chinos",
    "Coat",
    "Coverup",
    "Culottes",
    "Cutoffs",
    "Dress",
    "Flannel",
    "Gauchos",
    "Halter",
    "Henley",
    "Hoodie",
    "Jacket",
    "Jeans",
    "Jeggings",
    "Jersey",
    "Jodhpurs",
    "Joggers",
    "Jumpsuit",
    "Kaftan",
    "Kimono",
    "Leggings",
    "Onesie",
    "Parka",
    "Peacoat",
    "Poncho",
    "Robe",
    "Romper",
    "Sarong",
    "Shorts",
    "Skirt",
    "Sweater",
    "Sweatpants",
    "Sweatshorts",
    "Tank",
    "Tee",
    "Top",
    "Trunks",
    "Turtleneck",
  ];

  const handleCategorySelect = (category) => {
    setCorrectCategory(category);
  };

  const handleEditPreferences = (sellerPreferences) => {
    navigate("/seller/category-selection");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>
          Start the style revolution, by sharing your fashion treasures with us
          today!
        </h1>
      </div>

      <div>
        <div className={classes.wrapper}>
          <div
            style={{
              width: "500px",
              margin: "0 auto",
              marginTop: "50px",
              padding: "0 20px",
            }}
          >
            <Dropzone
              openRef={openRef}
              onDrop={handleDrop}
              className={classes.dropzone}
              radius="md"
              accept={["image/png", "image/jpeg", "image/jpg"]}
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
                  <Dropzone.Idle>Upload an image</Dropzone.Idle>
                </Text>
                <Text ta="center" fz="sm" mt="xs" c="dimmed">
                  Drag&apos;n&apos;drop files here to upload. We can accept only{" "}
                  <i>.jpg or .png</i> and a maximum of 1 image are allowed.
                </Text>
              </div>
            </Dropzone>
          </div>
          <Button
            className={classes.control}
            size="md"
            radius="xl"
            onClick={() => openRef.current?.()}
            disabled={uploadedImages.length > 0}
          >
            Select image
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

        {showButtons && uploadedImages.length === 1 && (
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
              onClick={() => handleClick(true)}
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
      <Modal
        opened={showWarningModal}
        onClose={closeModal}
        size="lg"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1
            style={{
              color: "#ff5454",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Please review your selections...
          </h1>
          <p style={{ color: "#333", fontSize: "18px", fontWeight: "bold" }}>
            We've noticed some variations between your preferences and the item
            you've uploaded.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="filled"
            color="red"
            marginleft="-100px"
            onClick={closeModal}
            style={{
              backgroundColor: "#ff5454",
              color: "white",
              padding: "12px 24px",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            Got it, thanks!
          </Button>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "-1px",
              marginLeft: "50px",
            }}
          >
            <Button
              onClick={handleEditPreferences}
              style={{
                fontSize: "14px",
                fontWeight: "bold",
              }}
              color="blue "
            >
              Edit my category preferences
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        opened={showModal}
        onClose={closeModal}
        contentlabel="Predicted Category Modal"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          className={classes.modalTitle}
          style={{ fontSize: "18px", fontWeight: 700 }}
        >
          Perfect! You are one step closer...
        </div>
        <div className={classes.confirmation}>
          <div className={classes.confirmationPrompt}>
            <Text fw={500}>
              Our system has identified the item you uploaded as a:
            </Text>
            <Text fw={700} style={{ fontSize: "24px", color: "violet" }}>
              {predictedCategory}
            </Text>
          </div>
        </div>
        <div
          className={classes.buttonConfirmation}
          style={{ justifyContent: "center", display: "flex" }}
        >
          <Button
            variant="filled"
            color="green"
            onClick={proceedToCreateListing}
          >
            Proceed
          </Button>
          <Button
            variant="outline"
            onClick={() => handleImageRemove(uploadedImages.length - 1)}
          >
            Re-upload
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "right",
            marginTop: "20px",
          }}
        >
          <Link
            to="#"
            onClick={handleSomethingIsWrong}
            style={{ alignSelf: "flex-end" }}
          >
            Something is wrong?
          </Link>
        </div>
      </Modal>
      <Modal
        opened={showCorrectCategoryModal}
        onClose={() => setShowCorrectCategoryModal(false)}
        contentlabel="Correct Category Modal"
        style={{
          display: "flex",
          alignItems: "center",
          maxWidth: "400px",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div
          className={classes.modalTitle}
          style={{ fontSize: "18px", fontWeight: "bold", margin: "10px 0" }}
        >
          Kindly assist us in enhancing our categorisation by refining the
          category
        </div>
        <div style={{ margin: "20px 0" }}>
          <select
            value={correctCategory}
            onChange={(e) => setCorrectCategory(e.target.value)}
            style={{
              padding: "10px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "4px",
              outline: "none",
            }}
          >
            <option value="" disabled>
              Select the Most Appropriate Category
            </option>
            {clothingCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Button
            variant="filled"
            color="green"
            onClick={proceedToCreateListing}
            style={{
              padding: "10px",
              width: "100%",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Continue
          </Button>
        </div>
        <div style={{ marginTop: "20px", fontSize: "14px", lineHeight: "1.5" }}>
          <p>
            Your valuable input in refining categories is indispensable and
            contributes significantly to the continuous improvement of our
            services. Thank you for your role in enhancing our service.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default ImageUpload;
