import React, { useEffect, useState } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  Button,
} from "@mantine/core";
import { keys } from "@mantine/utils";

import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import IconTrashBin from "../../assets/icons/ic_trash.svg";
import blueShirt from "../../assets/images/blue_shirt.jpg";

import { DUMMY_CART_PRODUCT } from "../../data/Products";
import { useNavigate } from "react-router";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import Cookies from "js-cookie";
import { showNotifications } from "../../utils/ShowNotification";
import CartItem from "../../components/CartItem";
import style from "./BuyerCart.module.css";
import axios from "axios";

const useStyles = createStyles((theme) => ({
  th: {
    padding: "0 !important",
  },

  control: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21),
  },

  rateButton: {
    backgroundColor: "black",
    color: "white",
    border: "none",
    padding: "8px 15px",
    cursor: "pointer",
    transition: "background-color 0.3s ease", // Add a transition for hover effect
    borderRadius: "10px",
  },

  rateButtonHover: {},

  container: {
    borderRadius: "5px",
    margin: "20px auto", // Center the container horizontally and add a top margin
    border: "1px solid #ccc", // Add an outline border
    padding: "2%", // Add padding to the container
    width: "100%", // Add padding to the container
  },
}));

interface RowData {
  cart_id: string;
  cart_item_id: string;
  images: string[];
  title: string;
  category: string;
  color: string;
  size: string;
  price: string;
  quantity: Number;
  //rate: string; // New property for the rate value
}

interface TableSortProps {
  data: RowData[];
}

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const { classes } = useStyles();
  const Icon = sorted
    ? reversed
      ? IconChevronUp
      : IconChevronDown
    : IconSelector;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size="0.9rem" stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data: RowData[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => item[key].toLowerCase().includes(query))
  );
}

function sortData(
  data: RowData[],
  payload: { sortBy: keyof RowData | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[sortBy].localeCompare(a[sortBy]);
      }

      return a[sortBy].localeCompare(b[sortBy]);
    }),
    payload.search
  );
}

export function Transactions() {
  const navigate = useNavigate();
  const { classes } = useStyles();

  const [currentUser, setCurrentUser] = useState();
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<RowData[]>();
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [filteredOutItems, setFilteredOutItems] = useState<RowData[]>([]);

  useEffect(() => {
    const retrieveCartDetails = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(
          `${url}/buyer/cart-details/${currentUser.user_id}/`
        );

        setSortedData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (currentUser) {
      retrieveCartDetails();
    }
  }, [currentUser]);

  // Check current user
  useEffect(() => {
    const setUserSessionData = async () => {
      try {
        const user = await retrieveUserInfo();
        setCurrentUser(user);
      } catch (error) {
        showNotifications({
          status: "error",
          title: "Error",
          message: error.response.data.message,
        });
      }
    };

    if (Cookies.get("firebaseIdToken")) {
      setUserSessionData();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  // Route restriction only for buyer
  useEffect(() => {
    if (currentUser && currentUser.role !== "buyer") {
      navigate("/", { replace: true });
    }
  }, [currentUser]);

  const setSorting = (field: keyof RowData) => {
    //sorting
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    // Use the edited quantity when sorting
    setSortedData(
      sortData(
        sortedData.map((item) => ({
          ...item,
          quantity: editedQuantity[item.title] || item.quantity,
        })),
        { sortBy: field, reversed, search }
      )
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //handle searches
    const { value } = event.currentTarget;
    setSearch(value);
    console.log(value); //can use this, set as the title (filter out the title)
    setSortedData(
      sortData(
        sampleData.map((item) => ({
          ...item,
          quantity: editedQuantity[item.title] || item.quantity,
        })),
        { sortBy, reversed: reverseSortDirection, search: value }
      )
    );
  };

  const handleQuantityChange = (cart_item_id: string, quantity: Number) => {
    setSortedData((prevData) => {
      return prevData.map((item) =>
        item.cart_item_id === cart_item_id
          ? { ...item, quantity: quantity }
          : item
      );
    });
  };

  const handleBuyButtonClick = (title) => {
    const data = DUMMY_CART_PRODUCT;

    const filteredData = data.filter((item) => item.title === title);
    console.log("pressed buy" + title); //title passes the param

    navigate("/buyer/checkout", {
      state: { data: filteredData },
    });
  };

  const handleTrashClick = (cart_item_id: string) => {
    if (sortedData) {
      // Find the item with the specified title
      const itemToFilterOut = sortedData.find(
        (item) => item.cart_item_id === cart_item_id
      );

      // Filter out the item with the specified title from the current sortedData
      const updatedData = sortedData.filter(
        (item) => item.cart_item_id !== cart_item_id
      );

      // Update the sortedData state with the filtered data
      setSortedData(updatedData);

      // Add the filtered-out item to the filteredOutItems state
      setFilteredOutItems((prevFilteredOutItems) => [
        ...(prevFilteredOutItems || []), // Use a default empty array if prevFilteredOutItems is undefined
        itemToFilterOut!,
      ]);
    }
  };

  const handleProceedCheckoutClick = () => {
    const data = DUMMY_CART_PRODUCT;

    // Filter out the items with titles that are in filteredOutItems
    const filteredData = data.filter(
      (item) =>
        !filteredOutItems.some(
          (filteredItem) => filteredItem.title === item.title
        )
    );

    navigate("/buyer/checkout", {
      state: { data: filteredData },
    });
  };

  const renderCartItems = () => {
    if (sortedData) {
      if (sortedData.length === 0) {
        return <Text>You do not have any item on cart</Text>;
      }

      return sortedData.map((item) => {
        return (
          <CartItem
            cartId={item.cart_id}
            cartItemId={item.cart_item_id}
            title={item.title}
            image={item.images[0]}
            category={item.category}
            size={item.size}
            price={item.price}
            quantity={item.quantity}
            handleQuantityChange={handleQuantityChange}
            handleTrashClick={handleTrashClick}
            handleBuyButtonClick={handleBuyButtonClick}
          />
        );
      });
    }

    return <Text>Loading ...</Text>;
  };

  const renderCheckoutButton = () => {
    if (sortedData && sortedData.length > 0) {
      return (
        <Button onClick={handleProceedCheckoutClick}>
          Proceed to checkout
        </Button>
      );
    }

    return null;
  };

  return (
    <div className={style.biggerContainer}>
      <div className={classes.container}>
        <Text weight={700} underline size="32px" mb="sm">
          Cart
        </Text>
        <ScrollArea>
          <TextInput
            placeholder="Search by any field"
            mb="md"
            icon={<IconSearch size="0.9rem" stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
          <Table
            horizontalSpacing="md"
            verticalSpacing="xs"
            miw={700}
            sx={{ tableLayout: "fixed" }}
          >
            <thead>
              <tr>
                <Th
                  sorted={sortBy === "image"}
                  reversed={reverseSortDirection}
                  onSort={() => console.log("sort image")}
                >
                  {/* no title */}
                </Th>
                <Th
                  sorted={sortBy === "title"}
                  reversed={reverseSortDirection}
                  onSort={() => console.log("sort title")}
                >
                  Title
                </Th>
                <Th
                  sorted={sortBy === "type"}
                  reversed={reverseSortDirection}
                  onSort={() => console.log("sort type")}
                >
                  Category
                </Th>
                <Th
                  sorted={sortBy === "size"}
                  reversed={reverseSortDirection}
                  onSort={() => console.log("sort size")}
                >
                  Size
                </Th>
                <Th
                  sorted={sortBy === "price"}
                  reversed={reverseSortDirection}
                  onSort={() => console.log("sort price")}
                >
                  Price
                </Th>
                <Th
                  sorted={sortBy === "quantity"}
                  reversed={reverseSortDirection}
                  onSort={() => console.log("sort quantity")}
                >
                  Quantity
                </Th>
                {/*<Th
                sorted={sortBy === null}
                reversed={reverseSortDirection}
                onSort={() => dontSort}
              >}
              </Th>*/}
              </tr>
            </thead>
            <tbody>{renderCartItems()}</tbody>
          </Table>
        </ScrollArea>
        {renderCheckoutButton()}
      </div>
    </div>
  );
}

export default Transactions;
