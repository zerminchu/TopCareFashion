import {
  Button,
  Center,
  Group,
  ScrollArea,
  Table,
  Text,
  TextInput,
  UnstyledButton,
  createStyles,
  rem,
} from "@mantine/core";
import { keys } from "@mantine/utils";
import React, { useEffect, useState } from "react";

import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconSelector,
} from "@tabler/icons-react";

import axios from "axios";
import Cookies from "js-cookie";
import { MdShoppingCartCheckout } from "react-icons/md";
import { useNavigate } from "react-router";
import CartItem from "../../components/Cart & Checkout Managment/CartItem";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../../utils/ShowNotification";
import style from "./BuyerCart.module.css";



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
  colour: string;
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
  const [fullData, setFullData] = useState<RowData[]>();
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
        
        setFullData(response.data.data);
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

  useEffect(() => {
    const generateSearchResults = () => {
      const searchResults = fullData.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(search.toLowerCase());
        const colourMatch = item.colour.toLowerCase().includes(search.toLowerCase());
        const categoryMatch = item.category.toLowerCase().includes(search.toLowerCase());
        const quantityMatch = item.cart_quantity.toString().includes(search); 
        const priceMatch = item.price.toString().includes(search); 

        return titleMatch || categoryMatch || quantityMatch || priceMatch || colourMatch;
      })

      setSortedData(searchResults);
    }

    if(search && fullData){
      generateSearchResults();
    }
  }, [search])
  

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
  };

  const handleQuantityChange = (cart_item_id: string, quantity: Number) => {
    setSortedData((prevData) => {
      return prevData.map((item) =>
        item.cart_item_id === cart_item_id
          ? { ...item, cart_quantity: quantity }
          : item
      );
    });
  };

  const handleBuyButtonClick = (cartItemId: string) => {
    if (sortedData) {
      let filteredData = sortedData.filter(
        (item) => item.cart_item_id === cartItemId
      );

      let data = filteredData[0];

      const date = new Date();

      const year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();

      month = month.length === 1 ? "0" + month : month;
      day = day.length === 1 ? "0" + day : day;

      const today = `${year}-${month}-${day}`;
      const subTotal = data.cart_quantity * data.price;

      data.created_at = today;
      data.sub_total = parseFloat(subTotal).toFixed(2);

      filteredData = [data];

      navigate("/buyer/checkout", {
        state: { data: filteredData },
      });
    }
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
    if (fullData) {
      const date = new Date();

      const year = date.getFullYear();
      let month = (date.getMonth() + 1).toString();
      let day = date.getDate().toString();

      month = month.length === 1 ? "0" + month : month;
      day = day.length === 1 ? "0" + day : day;

      const today = `${year}-${month}-${day}`;

      const filteredData = fullData.map((item) => {
        const subTotal = item.cart_quantity * item.price;

        item.created_at = today;
        item.sub_total = parseFloat(subTotal).toFixed(2);

        return item;
      });

      navigate("/buyer/checkout", {
        state: { data: filteredData },
      });
    }
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
            quantity={item.cart_quantity}
            colour={item.colour}
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
        <Button rightIcon={<MdShoppingCartCheckout  size={25} />} onClick={handleProceedCheckoutClick} style={{marginTop: "20px"}}>
          Proceed To Checkout
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
Item Name                </Th>
                <Th
                  sorted={sortBy === "type"}
                  reversed={reverseSortDirection}
                  onSort={() => console.log("sort type")}
                >
                  Type
                </Th>
                <Th
                  sorted={sortBy === "size"}
                  reversed={reverseSortDirection}
                  onSort={() => console.log("sort size")}
                >
                  Size
                </Th>
                <Th
                
                >
                  Colour
                </Th>
                <Th
                  sorted={sortBy === "price"}
                  reversed={reverseSortDirection}
                  onSort={() => console.log("sort price")}
                >
                  Unit Price
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
