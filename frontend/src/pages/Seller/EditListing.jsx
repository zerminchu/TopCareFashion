/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import {
  SimpleGrid,
  Container,
  useMantineTheme,
  createStyles,
  rem,
  TextInput,
  Button,
} from "@mantine/core";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useForm } from "@mantine/form";
import { showNotifications } from "../../utils/ShowNotification";
import { BiUpload } from "react-icons/bi";

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

function EditListing() {
  const theme = useMantineTheme();
  const { id, item_id } = useParams();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [item, setItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImages, setSelectedImages] = useState(Array(3).fill(null));
  const [selectedImageUrls, setSelectedImageUrls] = useState([]);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const form = useForm({
    initialValues: {
      category: "",
      condition: "",
      colour: "",
      title: "",
      description: "",
      price: "",
      collection_address: "",
      quantity_available: "",
      avail_status: "",
      image_urls: "",
    },
    validate: {
      category: (value) => {
        if (value.length === 0) return "Category is empty.";
        if (/^\s*$|^\s+.*|.*\s+$/.test(value))
          return "Category contains trailing/leading whitespaces";
        return null;
      },
    },
  });

  const handleImageChange = async (index, event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedImageFile(file);

      const reader = new FileReader();

      reader.onload = async (e) => {
        const newSelectedImages = [...selectedImages];
        newSelectedImages[index] = e.target.result;

        const newSelectedImageUrls = [...selectedImageUrls];
        newSelectedImageUrls[index] = null;

        setSelectedImages(newSelectedImages);
        setSelectedImageUrls(newSelectedImageUrls);

        if (index === 0) {
          try {
            const formData = new FormData();
            formData.append("image", file);

            const response = await axios.post(
              "http://localhost:8000/classify-image/",
              formData
            );
            const classifiedCategory = response.data.category;

            form.setValues({ ...form.values, category: classifiedCategory });
          } catch (error) {
            console.error("Error classifying image:", error);
          }
        }
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/view-item/${id}/${item_id}/`
        );
        const itemData = response.data;
        setItem(itemData);
        form.setValues({ category: itemData.category });
        form.setValues({ condition: itemData.condition });
        form.setValues({ colour: itemData.colour });
        form.setValues({ title: itemData.title });
        form.setValues({ description: itemData.description });
        form.setValues({ price: itemData.price });
        form.setValues({ quantity_available: itemData.quantity_available });
        form.setValues({ avail_status: itemData.avail_status });
        form.setValues({ collection_address: itemData.collection_address });

        setSelectedImages(itemData.image_urls);
        setSelectedImageUrls(itemData.image_urls);

        console.log(itemData);
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
    try {
      const response = await axios.put(
        `http://localhost:8000/edit-item/${id}/${item_id}/`,
        form.values
      );

      setIsEditing(false);

      showNotifications({
        status: response.data.status,
        title: "Updated Sucessfully",
        message: response.data.message,
      });

      navigate(`/`);
    } catch (error) {
      console.error("Error updating item:", error);

      /*   notifications.show({
      title: "Error Updating F&B Item",
      message: error.response.data,
      autoClose: 3000,
    }); */
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
      await axios.delete(`http://localhost:8000/delete-item/${id}/${item_id}/`);
      navigate(`/`);
    } catch (error) {
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
            {selectedImages.map((imageUrl, index) => (
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
                <img
                  src={imageUrl || item.image_urls[index]}
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
              </div>
            ))}
            {item.image_urls.length === 0 && <div>No images available</div>}
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
          value={item.category}
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("category")}
        />
        <br />
        <TextInput
          label="Condition"
          value={item.condition}
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("condition")}
        />
        <br />
        <TextInput
          label="Colour"
          value={item.colour}
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("colour")}
        />
        <br />
        <TextInput
          label="Title"
          value={item.title}
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("title")}
        />
        <br />
        <TextInput
          label="Description"
          value={item.description}
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("description")}
        />
        <br />
        <TextInput
          label="Price"
          value={"S$" + " " + item.price}
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("price")}
        />
        <br />
        <TextInput
          label="Quantity"
          value={item.quantity_available}
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("quantity_available")}
        />
        <br />
        <TextInput
          label="Collection Address"
          value={item.collection_address}
          style={{ width: "50%" }}
          classNames={classes}
          disabled={!isEditing}
          {...form.getInputProps("collection_address")}
        />
        <br />
        <TextInput
          label="Status"
          value={item.avail_status}
          style={{ width: "50%" }}
          classNames={classes}
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
      </div>
    </form>
  );
}

export default EditListing;
