/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import {
  Badge,
  Button,
  Container,
  Modal,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  createStyles,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { BiUpload } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../../../utils/ShowNotification";

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

function EditListing() {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useMantineTheme();

  const { id, item_id } = useParams();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [item, setItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImages, setSelectedImages] = useState(Array(3).fill(null));
  const [showCategoryMismatchModal, setShowCategoryMismatchModal] =
    useState(false);
  const predictedClassRef = useRef(null);

  const validateField = (fieldName, value) => {
    if (value.length === 0) return `${fieldName} is empty`;
    if (/^\s*$|^\s+.*|.*\s+$/.test(value))
      return `${fieldName} contains trailing/leading whitespaces`;
    return null;
  };

  const form = useForm({
    initialValues: {
      category: "",
      condition: "",
      colour: "",
      title: "",
      gender: "",
      description: "",
      price: "",
      collection_address: "",
      quantity_available: "",
      avail_status: "",
      image_urls: "",
      sub_category: "",
    },
    validate: {
      gender: (value) => validateField("Gender", value),
      category: (value) => validateField("Category", value),
      condition: (value) => validateField("Condition", value),
      colour: (value) => validateField("Colour", value),
      title: (value) => validateField("Title", value),
      description: (value) => validateField("Description", value),
      price: (value) => validateField("Price", value),
      collection_address: (value) => validateField("Collection Address", value),
      quantity_available: (value) => validateField("Quantity Available", value),
      avail_status: (value) => validateField("Available Status", value),
    },
  });

  const handleImageChange = (index, event) => {
    const file = event.target.files[0];

    if (file) {
      const newSelectedImages = [...selectedImages];
      newSelectedImages[index] = URL.createObjectURL(file);
      setSelectedImages(newSelectedImages);

      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      const formData = new FormData();
      formData.append("image", file);

      try {
        dispatch({ type: "SET_LOADING", value: true });

        axios
          .put(`${url}/replace-image/${id}/${item_id}/${index}/`, formData)
          .then((response) => {
            newSelectedImages[index] = response.data.imageUrl;
            setSelectedImages(newSelectedImages);

            axios
              .post(`${url}/classify-image/`, formData)
              .then((classifier_response) => {
                const data = classifier_response.data;

                predictedClassRef.current = data.predicted_subcategory;

                if (data.predicted_subcategory !== form.values.sub_category) {
                  setShowCategoryMismatchModal(true);
                }
                setItem((prevItem) => {
                  const newItem = { ...prevItem };
                  newItem.image_urls[index] = response.data.imageUrl;
                  return newItem;
                });
                dispatch({ type: "SET_LOADING", value: false });
              })

              .catch((error) => {
                console.error("Error classifying image:", error);
                dispatch({ type: "SET_LOADING", value: false });
              });
          });
      } catch (error) {
        console.error("Error replacing image:", error);
      }
    }
  };

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
    const fetchItemDetails = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(`${url}/view-item/${id}/${item_id}/`);
        const itemData = response.data;
        setItem(itemData);

        form.setValues({ gender: itemData.gender });
        form.setValues({ category: itemData.category });
        form.setValues({ sub_category: itemData.sub_category });
        form.setValues({ condition: itemData.condition });
        form.setValues({ colour: itemData.colour });
        form.setValues({ title: itemData.title });
        form.setValues({ description: itemData.description });
        form.setValues({ price: itemData.price });
        form.setValues({ quantity_available: itemData.quantity_available });
        form.setValues({ avail_status: itemData.avail_status });
        form.setValues({ collection_address: itemData.collection_address });
      } catch (error) {
        console.error("Error fetching Item details:", error);
      }
    };

    fetchItemDetails();
  }, []);

  if (item === null) {
    return <div>Loading...</div>;
  }
  const handleSubmit = async () => {
    const errors = form.validate();

    if (!form.validate().hasErrors) {
      try {
        dispatch({ type: "SET_LOADING", value: true });

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.put(
          `${url}/edit-item/${id}/${item_id}/`,
          form.values
        );

        dispatch({ type: "SET_LOADING", value: false });

        const predictedClass = predictedClassRef.current;

        if (predictedClass !== form.values.category) {
          showNotifications({
            status: "warning",
            title: "Category Mismatch",
            message:
              "The uploaded image doesn't match the selected category. Please re-upload the image.",
          });
        } else {
          showNotifications({
            status: "success",
            title: "Updated Successfully",
            message: response.data.message,
          });

          setIsEditing(false);

          navigate(`/`);
        }
      } catch (error) {
        console.error("Error updating item:", error);
        dispatch({ type: "SET_LOADING", value: false });
      }
    } else {
      showNotifications({
        status: "error",
        title: "Form Validation Error",
        message: "Please fix the form validation errors before saving.",
      });
    }
  };

  const handleSaveClick = () => {
    if (isEditing) {
      handleSubmit();
    } else {
      setIsEditing(true);
    }
  };

  const handleDeleteClick = async () => {
    try {
      dispatch({ type: "SET_LOADING", value: true });

      const url =
        import.meta.env.VITE_NODE_ENV == "DEV"
          ? import.meta.env.VITE_API_DEV
          : import.meta.env.VITE_API_PROD;

      await axios.delete(`${url}/delete-item/${id}/${item_id}/`);

      dispatch({ type: "SET_LOADING", value: false });

      navigate(`/`);
    } catch (error) {
      dispatch({ type: "SET_LOADING", value: false });
      console.error("Error deleting item:", error);
    }
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
            Preview Images
          </div>
          <SimpleGrid cols={3} breakpoints={[{ maxWidth: "xs", cols: 1 }]}>
            {item.image_urls.map((imageUrl, index) => (
              <div
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                style={{
                  width: "100%",
                  height: "300px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "16px",
                  padding: "16px",
                  borderRadius: theme.radius.md,
                  justifyContent: "center", // Center content vertically and horizontally
                  textAlign: "center", // Center text horizontally
                  overflow: "hidden", // Clip image to container boundaries
                  cursor: "pointer", // Change cursor on hover
                  border: `2px solid ${
                    selectedImageIndex === index ? theme.colors.teal[6] : "#ccc"
                  }`,
                }}
              >
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={`Uploaded ${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        overflow: "hidden",
                      }}
                    />
                    <label
                      htmlFor={`image-upload-${index}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: "8px",
                        cursor: "pointer",
                        color: theme.colors.blue[6],
                      }}
                    >
                      <BiUpload size={24} />
                    </label>
                    <input
                      id={`image-upload-${index}`}
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleImageChange(index, event)}
                      style={{ display: "none" }}
                    />
                  </>
                ) : (
                  <div>No image available</div>
                )}
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
          }}
        >
          <TextInput
            label="Category"
            classNames={classes}
            disabled={true}
            {...form.getInputProps("sub_category")}
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
            Apparel Type: {form.values.category}
          </Badge>
        </div>
        {/*   <TextInput
          label="Condition"
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("condition")} */}
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
          classNames={classes}
          disabled={!isEditing}
          style={{ width: "50%" }}
          value={item.condition}
          {...form.getInputProps("condition")}
        />
        <br />
        <TextInput
          label="Colour"
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("colour")}
        />
        <Select
          mt="md"
          withinPortal
          data={[
            { value: "men", label: "Men" },
            { value: "women", label: "Women" },
          ]}
          placeholder="Men"
          label="Product Gender Specification"
          disabled={!isEditing}
          classNames={classes}
          style={{ width: "50%" }}
          {...form.getInputProps("gender")}
        />
        <br />
        <TextInput
          label="Title"
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("title")}
        />
        <br />
        <TextInput
          label="Description"
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("description")}
        />
        <br />
        <TextInput
          label="Price"
          value={"S$" + (isEditing ? form.values.price : item.price)}
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("price")}
        />
        <br />
        <TextInput
          label="Quantity Available"
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("quantity_available")}
        />
        <br />
        <TextInput
          label="Collection Address (with Postal)"
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("collection_address")}
        />
        <br />
        {/* <TextInput
          label="Available Status"
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("avail_status")} */}
        <Select
          mt="mt"
          withinPortal
          data={[
            { value: "Available", label: "Available" },
            { value: "Unavailable", label: "Unavailable" },
          ]}
          placeholder="Available"
          label="Available Status"
          value={item.avail_status}
          classNames={classes}
          style={{ width: "50%" }}
          disabled={!isEditing}
          {...form.getInputProps("avail_status")}
        />
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: "16px",
            marginBottom: "16px",
          }}
        >
          <div style={{ marginRight: "8px" }}>
            <Button
              type="button"
              variant="outline"
              color="red"
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </div>
          <div style={{ marginRight: "8px" }}>
            <Button type="button" onClick={handleSaveClick}>
              {isEditing ? "Save" : "Update"}
            </Button>
          </div>
          <Button type="button" onClick={() => navigate("/")} variant="outline">
            Cancel
          </Button>
        </div>
        <Modal
          opened={showCategoryMismatchModal}
          onClose={() => setShowCategoryMismatchModal(false)}
          contentlabel="Category Mismatch Modal"
        >
          <div className={classes.modalTitle}>Oops, a Category Mix-up!</div>

          <div className={classes.confirmation}>
            <div className={classes.confirmationPrompt}>
              <Text fw={500}>
                The uploaded image doesn't align with the intended category for
                your listing. Please upload the correct image.
              </Text>
            </div>
            <div className={classes.buttonConfirmation}>
              <Button
                variant="filled"
                color="red"
                onClick={() => setShowCategoryMismatchModal(false)}
              >
                Ok
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </form>
  );
}

export default EditListing;
