/* eslint-disable no-empty */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import {
  Badge,
  Button,
  Container,
  Modal,
  MultiSelect,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  createStyles,
  rem,
  useMantineTheme,
} from "@mantine/core";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { BiUpload } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { retrieveUserInfo } from "../../../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../../../utils/ShowNotification";
import { useForm } from "@mantine/form";

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

function useFormInput(initialValue, validateFunction) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    setError(validateFunction(newValue));
  };

  return {
    value,
    onChange: handleChange,
    error,
  };
}

function ListItem() {
  const theme = useMantineTheme();
  const location = useLocation();
  const uploadedImagesFromRoute = location.state?.uploadedImages || [];
  const predictedCategoryFromRoute = location.state?.predictedCategory || "";
  const predictedSubCategoryFromRoute =
    location.state?.predictedSubCategory || "";
  const correctCategory = location.state?.correctCategory || "";
  const [subCategoryFromBackend, setSubCategoryFromBackend] = useState("");

  const { classes } = useStyles();
  const [uploadedImages, setUploadedImages] = useState(uploadedImagesFromRoute);
  const [category, setCategory] = useState(predictedCategoryFromRoute);
  const [sub_category, setSubCategory] = useState(
    predictedSubCategoryFromRoute
  );
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
  const [additionalUploadedImages, setAdditionalUploadedImages] = useState([
    ["", ""],
  ]);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const sizeOptions = ["XS", "S", "M", "L", "X-Large", "XXL", "Free Size"];
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(true);

  const handleSizeChange = (value) => {
    setSelectedSizes([value]);
  };

  const [showCategoryMismatchModal, setShowCategoryMismatchModal] =
    useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (location.state?.sub_category) {
      setSubCategory(location.state.sub_category);
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const categoryToSave = correctCategory !== "" ? correctCategory : category;
    setFormSubmitted(true);

    if (!isFormValid) {
      const categoryError = validateCategory(categoryToSave);
      const conditionError = validateCondition(condition);
      const colourError = validateColour(colour);
      const titleError = validateTitle(title);
      const descriptionError = validateDescription(description);
      const priceError = validatePrice(price);
      const quantityAvailableError =
        validateQuantityAvailable(quantity_available);
      const sizeError = validateSize(selectedSizes.join(","));
      const collectionAddressError =
        validateCollectionAddress(collection_address);
      const availStatusError = validateAvailStatus(avail_status);

      const allErrors = {
        categoryError,
        conditionError,
        colourError,
        titleError,
        descriptionError,
        priceError,
        quantityAvailableError,
        sizeError,
        collectionAddressError,
        availStatusError,
      };

      const anyErrors = Object.values(allErrors).some((error) => !!error);
      if (anyErrors) {
        showNotifications({
          status: "error",
          title: "Form Validation Error",
          message: "Please fix the form validation errors before saving.",
        });
        return;
      }
    } else
      try {
        dispatch({ type: "SET_LOADING", value: true });

        const uploadedFiles = await Promise.all(
          uploadedImages.map(async (blobUrl) => {
            const response = await fetch(blobUrl);
            return new Blob([await response.blob()]);
          })
        );

        const additionalImagesFiles = await Promise.all(
          additionalUploadedImages.flat().map(async (blobUrl) => {
            if (blobUrl) {
              const response = await fetch(blobUrl);
              return new Blob([await response.blob()]);
            }
            return null;
          })
        );

        const formData = new FormData();

        uploadedFiles.forEach((file, index) => {
          formData.append("files", file);
        });

        additionalImagesFiles.forEach((file, index) => {
          formData.append("files", file);
        });

        formData.append("gender", gender);
        formData.append("category", categoryToSave);
        formData.append("sub_category", sub_category);
        formData.append("condition", condition);
        formData.append("colour", colour);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("quantity_available", quantity_available);
        formData.append("collection_address", collection_address);
        formData.append("user_id", currentUser.user_id);
        formData.append("avail_status", avail_status);
        formData.append("size", selectedSizes.join(","));

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        await axios.post(`${url}/add-product/`, formData);

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
        console.log(error);
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
      if (!/^[a-zA-Z0-9\s]+$/.test(value))
        return "Category should not contain special characters";
    }
    return null;
  };

  const validateCondition = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Condition should not be blank";
      if (/^\s$|^\s+.|.\s+$/.test(value))
        return "Condition should not contain trailing/leading whitespaces";
      if (!/^[a-zA-Z0-9\s]+$/.test(value))
        return "Condition should not contain special characters";
    }
    return null;
  };

  const validateColour = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Colour should not be blank";
      if (/^\s$|^\s+.|.\s+$/.test(value))
        return "Colour should not contain trailing/leading whitespaces";
      if (!/^[a-zA-Z0-9\s]+$/.test(value))
        return "Colour should not contain special characters";
    }
    return null;
  };

  const validateTitle = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Title should not be blank";
      if (/^\s$|^\s+.|.\s+$/.test(value))
        return "Title should not contain trailing/leading whitespaces";
      if (!/^[a-zA-Z0-9\s]+$/.test(value))
        return "Title should not contain special characters";
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
      if (/^\s$|^\s+.|.\s+$/.test(value))
        return "Price should not contain trailing/leading whitespaces";
      if (!/^[0-9.]+$/.test(value))
        return "Price should not contain special characters (except decimal point)";
    }
    return null;
  };

  const validateQuantityAvailable = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Quantity Available should not be blank";
      if (/^\s$|^\s+.|.\s+$/.test(value))
        return "Quantity Available should not contain trailing/leading whitespaces";
      if (!/^\d+$/.test(value))
        return "Quantity Available should only contain digits";
    }
    return null;
  };

  const validateSize = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Size should not be empty";
    }
    return null;
  };

  const validateCollectionAddress = (value) => {
    if (formSubmitted) {
      if (value.trim() === "") {
        return "Collection Address should not be blank";
      }

      if (/^\s$|^\s+.|.\s+$/.test(value)) {
        return "Collection Address should not contain trailing/leading whitespaces";
      }

      const postalCodeMatch = value.match(/\d{6}/);
      if (!postalCodeMatch) {
        return "Please include a 6-digit postal code in the collection address.";
      }

      const postalCode = postalCodeMatch[0];
      if (!/^\d{6}$/.test(postalCode)) {
        return "Please enter a valid 6-digit postal code in the collection address.";
      }
    }
    return null;
  };

  const validateAvailStatus = (value) => {
    if (formSubmitted) {
      if (value.length === 0) return "Available Status should not be blank";
      if (/^\s$|^\s+.|.\s+$/.test(value))
        return "Available Status should not contain trailing/leading whitespaces";
      if (!/^[a-zA-Z0-9\s]+$/.test(value))
        return "Available Status should not contain special characters";
    }
    return null;
  };

  const handleAdditionalImageChange = async (containerIndex, index, event) => {
    const files = event.target.files;
    setSelectedContainerIndex(containerIndex);
    setSelectedImageIndex(index);

    if (files.length > 0) {
      const newImages = [...additionalUploadedImages];
      newImages[containerIndex][index] = URL.createObjectURL(files[0]);
      setAdditionalUploadedImages(newImages);

      try {
        const response = await fetch(newImages[containerIndex][index]);
        const blob = new Blob([await response.blob()]);
        const formData = new FormData();
        formData.append("image", blob);

        const url =
          import.meta.env.VITE_NODE_ENV === "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        axios.post(`${url}/classify-image/`, formData).then((response) => {
          const data = response.data;

          if (data.predicted_class !== category) {
            setShowCategoryMismatchModal(true);
          }
        });
      } catch (error) {}
    }
  };

  const handleReuploadImage = () => {
    const newImages = [...additionalUploadedImages];
    newImages[selectedContainerIndex][selectedImageIndex] = "";
    setAdditionalUploadedImages(newImages);

    setShowCategoryMismatchModal(false);
  };

  const fetchSubCategory = (correctCategory) => {
    let params = {};
    params["category"] = correctCategory;

    const url =
      import.meta.env.VITE_NODE_ENV === "DEV"
        ? import.meta.env.VITE_API_DEV
        : import.meta.env.VITE_API_PROD;

    axios
      .get(`${url}/get-subcategory/`, { params })
      .then((response) => {
        const subCategory = response.data.subcategory[0];
        setSubCategoryFromBackend(subCategory);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (correctCategory) {
      fetchSubCategory(correctCategory);
    }
  }, [correctCategory]);

  const [errors, setErrors] = useState({});

  const handleInputChange = (event, fieldName, validationFunction) => {
    const value = event.target.value;
    const error = validationFunction(value);
    setFormErrors({ ...formErrors, [fieldName]: error });
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
            {additionalUploadedImages.map((imageRow, containerIndex) =>
              imageRow.map((imageSrc, index) => (
                <div
                  key={`additional-${containerIndex}-${index}`}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginBottom: "16px",
                    padding: "16px",
                    border: "1px solid #ccc",
                    borderRadius: theme.radius.md,
                    justifyContent: "center",
                    textAlign: "center",
                    overflow: "hidden",
                  }}
                >
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
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
                      <input
                        id={`image-upload-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          handleAdditionalImageChange(
                            containerIndex,
                            index,
                            event
                          )
                        }
                        style={{ display: "none" }}
                      />
                    </label>
                  )}
                  <Modal
                    opened={showCategoryMismatchModal}
                    onClose={() => setShowCategoryMismatchModal(false)}
                    contentlabel="Category Mismatch Modal"
                  >
                    <div className={classes.modalTitle}>
                      Oops, a Category Mix-up!
                    </div>

                    <div className={classes.confirmation}>
                      <div className={classes.confirmationPrompt}>
                        <Text fw={500}>
                          The uploaded image doesn't align with the intended
                          category for your listing. Please upload the correct
                          image.
                        </Text>
                      </div>
                      <div className={classes.buttonConfirmation}>
                        <Button
                          variant="filled"
                          color="red"
                          onClick={() => setShowCategoryMismatchModal(false)}
                        >
                          I'm A-okay with that!
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleReuploadImage(selectedContainerIndex, index)
                          }
                        >
                          Re-upload
                        </Button>
                      </div>
                    </div>
                  </Modal>
                </div>
              ))
            )}
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
            value={correctCategory !== "" ? correctCategory : category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Top"
            classNames={classes}
            error={validateCategory(category)}
            disabled={true}
          />
          <div>
            <Badge
              color="violet"
              style={{
                position: "absolute",
                top: "50%",
                right: "5px",
                transform: "translateY(-50%)",
                fontSize: "80%",
              }}
            >
              Apparel Type: {subCategoryFromBackend || sub_category}
            </Badge>
          </div>
        </div>
        <Select
          mt="md"
          withinPortal
          data={[
            { value: "Brand New", label: "Brand New" },
            { value: "Lightly Used", label: "Lightly Used" },
            { value: "Well Used", label: "Well Used" },
          ]}
          placeholder="Select Condition"
          label="Condition"
          value={condition}
          classNames={classes}
          style={{ width: "50%" }}
          onChange={(selectedValue) => setCondition(selectedValue)}
          error={validateCondition(condition)}
        />
        <br />
        <TextInput
          label="Colour"
          value={colour}
          onChange={(event) => {
            setColour(event.target.value);
          }}
          placeholder="Enter Colour (e.g., Red)"
          classNames={classes}
          style={{ width: "50%" }}
          error={validateColour(colour)}
        />
        <Select
          mt="md"
          withinPortal
          data={[
            { value: "women", label: "Women" },
            { value: "men", label: "Men" },
          ]}
          placeholder="Select Item's Gender"
          label="Product Gender Specification"
          value={gender}
          classNames={classes}
          style={{ width: "50%" }}
          onChange={(selectedValue) => {
            setGender(selectedValue);
          }}
          error={validateCondition(gender)}
        />
        <br />
        <TextInput
          label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter Title (e.g., Oversized T-Shirt)"
          classNames={classes}
          style={{ width: "50%" }}
          error={validateTitle(title)}
        />
        <br />
        <TextInput
          label="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Provide Item Description"
          classNames={classes}
          style={{ width: "50%" }}
          error={validateDescription(description)}
        />
        <br />
        <TextInput
          label="Price"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Enter Price (e.g., 123)"
          classNames={classes}
          style={{ width: "50%" }}
          error={validatePrice(price)}
        />
        <br />
        <MultiSelect
          label="Sizes"
          placeholder="Select Sizes (e.g., XS, S, M)"
          data={sizeOptions}
          value={handleSizeChange}
          onChange={setSelectedSizes}
          hidepickedoptions
          classNames={classes}
          style={{ width: "50%" }}
          error={validateSize(selectedSizes)}
        />
        <br />
        <TextInput
          label="Quantity Available"
          value={quantity_available}
          onChange={(event) => {
            setQuantityAvailable(event.target.value);
            validateQuantityAvailable(event.target.value);
          }}
          placeholder="Enter Quantity Available (e.g., 10)"
          classNames={classes}
          style={{ width: "50%" }}
          error={validateQuantityAvailable(quantity_available)}
        />
        <br />
        <TextInput
          label="Collection Address including Postal Code"
          value={collection_address}
          onChange={(event) => {
            setCollectionAddress(event.target.value);
          }}
          placeholder="Enter Address (e.g., Address Line 1, 200901)"
          classNames={classes}
          style={{ width: "50%" }}
          error={validateCollectionAddress(collection_address, formSubmitted)}
        />

        <br />
        <Select
          mt="mt"
          withinPortal
          data={[
            { value: "Available", label: "Available" },
            { value: "Unavailable", label: "Unavailable" },
          ]}
          placeholder="Select Availability Status"
          label="Availability Status"
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
