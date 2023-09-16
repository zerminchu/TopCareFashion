/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  Image,
  Text,
  Group,
  createStyles,
  rem,
  Menu,
} from "@mantine/core";
import axios from "axios";
import BusinessProfile from "./BusinessProfile";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import classes from "./SellerHome.module.css";
import { Select } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Burger } from "@mantine/core";
import { IconSettings, IconSearch, IconCopy } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    marginBottom: theme.spacing.md,
  },

  imageSection: {
    padding: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  label: {
    marginBottom: theme.spacing.xs,
    lineHeight: 1,
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    letterSpacing: rem(-0.25),
    textTransform: "uppercase",
  },

  section: {
    padding: theme.spacing.md,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  icon: {
    marginRight: rem(5),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[5],
  },
}));

function SellerCards() {
  const { id, item_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const { classes } = useStyles();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [opened, { toggle }] = useDisclosure(false);
  const label = opened ? "Close navigation" : "Open navigation";
  const [openedMenus, setOpenedMenus] = useState(
    new Array(filteredItems.length).fill(false)
  );
  const [isShareModalOpen, setShareModalOpen] = useState(false);
  const [selectedItemForShare, setSelectedItemForShare] = useState(null);

  const [currentUser, setCurrentUser] = useState();

  const [itemURL, setItemURL] = useState("");
  const [itemTitle, setItemTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/view-item/${id}/`
        );
        const fetchedItems = response.data;
        setItems(fetchedItems);
        setFilteredItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching Items:", error);
      }
    };

    fetchData();
  }, [id]);

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
    const checkOnBoardingCompleted = async () => {
      try {
        const url =
          import.meta.env.VITE_API_DEV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        if (currentUser && currentUser.stripe_id) {
          const response = await axios.post(`${url}/seller/check-onboarding/`, {
            stripe_id: currentUser.stripe_id,
          });

          if (!response.data.onBoardingCompleted) {
            dispatch({ type: "SET_EXISTING_SELLER_ON_BOARD", value: true });
          } else {
            console.log("onboarding completed");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser && currentUser.stripe_id === "") {
      dispatch({ type: "SET_SELLER_ON_BOARD", value: true });
      console.log("you havent onboard");
    } else {
      checkOnBoardingCompleted();
    }
  }, [currentUser]);

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    filterItems(selectedCategory, searchText);
  };

  const handleSearchTextChange = (value) => {
    setSearchText(value);
    filterItems(category, value); // Update filter with category and search text
  };

  const filterItems = (selectedCategory, search) => {
    let filtered = items;

    // Filter by category
    if (selectedCategory !== "") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search text
    if (search !== "") {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleBurgerClick = (index) => {
    const updatedMenus = [...openedMenus];
    updatedMenus[index] = !updatedMenus[index];
    setOpenedMenus(updatedMenus);
  };

  /*  const openShareModal = (item) => {
    if (!isShareModalOpen) {
      setSelectedItemForShare(item);
      setShareModalOpen(true);
    }
  };

  const closeShareModal = () => {
    setSelectedItemForShare(null);
    setShareModalOpen(false);
  }; */

  const handleShareClick = (item) => {
    const itemURL = `https://topcarefashion/listing/${item.item_id}`;

    // Copy the URL to clipboard
    copy(itemURL);

    toast.success("URL copied to clipboard!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div>
      <div
        style={{
          marginTop: "16px",
          marginLeft: "20px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Select
          placeholder="Select by category"
          searchable
          nothingFound="No options"
          data={["Top", "Bottom", "Footwear"]}
          value={category}
          onChange={(value) => handleCategoryChange(value)}
          style={{ marginRight: "16px" }}
        />

        <TextInput
          placeholder="Search by item"
          icon={<IconSearch size="1rem" />}
          rightSectionWidth={90}
          styles={{ rightSection: { pointerEvents: "none" } }}
          value={searchText}
          onChange={(event) => handleSearchTextChange(event.target.value)}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredItems.map((item, index) => (
          <Card
            withBorder
            radius="md"
            className={classes.card}
            key={index}
            style={{
              flex: "0 0 calc(25% - 1rem)",
              margin: "0.5rem",
              padding: "0.5rem",
            }}
          >
            <Card.Section className={classes.imageSection}>
              <Image
                src={item.image_urls[0]}
                alt={item.category}
                width={150}
                height={180}
              />
            </Card.Section>

            <Group position="apart" mt="md">
              <div>
                <Text>{item.condition}</Text>
              </div>
            </Group>

            <Card.Section className={classes.section} mt="md">
              <Text fz="sm" c="dimmed" className={classes.label}>
                {item.title}
              </Text>

              <Group spacing={8} mb={-8}>
                {/* Add your features here */}
              </Group>
            </Card.Section>

            <Card.Section className={classes.section}>
              <Group spacing={30}>
                <div>
                  <Text fz="xl" fw={700} sx={{ lineHeight: 1 }}></Text>S$
                  {item.price}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "auto",
                  }}
                >
                  <Burger
                    opened={openedMenus[index]}
                    onClick={() => handleBurgerClick(index)}
                    aria-label={label}
                  />
                </div>
                <div className={classes.optionsContainer}>
                  {openedMenus[index] && (
                    <Menu position="bottom" shadow="xs">
                      <Menu.Item icon={<IconSettings size={14} />}>
                        <Link
                          to={`/edit-listing/${item.user_id}/${item.item_id}`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          Edit
                        </Link>
                      </Menu.Item>
                      <Menu.Item
                        icon={<IconCopy size={14} />}
                        onClick={() => handleShareClick(item)}
                      >
                        Copy
                        <ToastContainer
                          position="top-right"
                          autoClose={3000}
                          hideProgressBar
                        />
                      </Menu.Item>
                    </Menu>
                  )}
                </div>
              </Group>
            </Card.Section>
          </Card>
        ))}
      </div>
      {/*  {selectedItemForShare && (
        <Modal
          isOpen={isShareModalOpen}
          onRequestClose={closeShareModal}
          contentLabel="Share Modal"
          className="share-modal"
          overlayClassName="share-modal-overlay"
        >
          <div className="modal-header">
            <button className="close-button" onClick={closeShareModal}>
              <AiOutlineClose size={24} />
            </button>
          </div>
          <div className="modal-content">
            <h2>Share this item</h2>
            <div className="social-icons">
              <FacebookShareButton url={itemURL} quote={itemTitle}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={itemURL} title={itemTitle}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <WhatsappShareButton url={itemURL} title={itemTitle}>
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
            </div>
          </div>
        </Modal> 
      )} */}
    </div>
  );
}
export default SellerCards;
