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
  image: string;
  title: string;
  type: string;
  color: string;
  size: string;
  price: string;
  quantity: string;
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

const sampleData: RowData[] = [
  {
    image: blueShirt,
    title: "Blue Shirt",
    type: "Top Wear",
    color: "Blue",
    size: "M",
    price: "$28.00",
    quantity: "1",
  },
  {
    image:
      "https://images.unsplash.com/photo-1597350584914-55bb62285896?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
    title: "Trendy White Sneakers",
    type: "Foot Wear",
    color: "White",
    size: "XL",
    price: "$300.00",
    quantity: "3",
  },
  {
    image:
      "https://images.unsplash.com/photo-1606480192262-e3b6a9f37142?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVkJTIwZ293bnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    title: "Red Dress",
    type: "Top Wear",
    color: "Red",
    size: "L",
    price: "$211.56",
    quantity: "2",
  },
];

export function Transactions() {
  const navigate = useNavigate();
  const { classes } = useStyles();

  const [currentUser, setCurrentUser] = useState();
  const [search, setSearch] = useState("");
  const [sortedData, setSortedData] = useState<RowData[]>([]);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [filteredOutItems, setFilteredOutItems] = useState<RowData[]>([]); // Specify the type explicitly
  //const [filteredOutTitles, setFilteredOutTitles] = useState<string[]>([]);

  useEffect(() => {
    setSortedData([
      {
        image: blueShirt,
        title: "Blue Shirt",
        type: "Top Wear",
        color: "Blue",
        size: "M",
        price: "$28.00",
        quantity: "1",
      },
      {
        image:
          "https://images.unsplash.com/photo-1597350584914-55bb62285896?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
        title: "Trendy White Sneakers",
        type: "Foot Wear",
        color: "White",
        size: "XL",
        price: "$300.00",
        quantity: "3",
      },
      {
        image:
          "https://images.unsplash.com/photo-1606480192262-e3b6a9f37142?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVkJTIwZ293bnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        title: "Red Dress",
        type: "Top Wear",
        color: "Red",
        size: "L",
        price: "$211.56",
        quantity: "2",
      },
    ]);
  }, []);

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

  const [editedQuantity, setEditedQuantity] = useState<Record<string, string>>( //sets the initial value into the text field
    sampleData.reduce((acc, item) => {
      acc[item.title] = item.quantity;
      return acc;
    }, {})
  );

  const setSorting = (field: keyof RowData) => {
    //sorting
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    // Use the edited quantity when sorting
    setSortedData(
      sortData(
        sampleData.map((item) => ({
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

  const handleQuantityChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    title: string
  ) => {
    const { value } = event.currentTarget;
    console.log("This is invoked", value);

    // Use a regular expression to check if the value is a number
    if (/^\d+$/.test(value) || value === "") {
      setEditedQuantity((prevQuantity) => ({
        ...prevQuantity,
        [title]: value,
      }));
      console.log("Updated quantity", editedQuantity);
    } else {
      // Display an error message or handle invalid input as needed
      console.log(`Invalid input for ${title}: ${value}`);
    }
  };

  const handleBuyButtonClick = (title) => {
    const data = DUMMY_CART_PRODUCT;

    const filteredData = data.filter((item) => item.title === title);
    console.log("pressed buy" + title); //title passes the param

    navigate("/buyer/checkout", {
      state: { data: filteredData },
    });
  };

  const handleTrashClick = (title) => {
    // Find the item with the specified title
    const itemToFilterOut = sampleData.find((item) => item.title === title);
    // Filter out the item with the specified title from the current sortedData
    const updatedData = sortedData.filter((item) => item.title !== title);

    // Update the sortedData state with the filtered data
    setSortedData(updatedData);

    // Add the filtered-out item to the filteredOutItems state
    setFilteredOutItems((prevFilteredOutItems) => [
      ...(prevFilteredOutItems || []), // Use a default empty array if prevFilteredOutItems is undefined
      itemToFilterOut!,
    ]);
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
    return sortedData.map((item) => {
      return (
        <CartItem
          title={item.title}
          image={item.image}
          type={item.type}
          color={item.color}
          size={item.size}
          price={item.price}
          quantity={editedQuantity[item.title]}
          handleQuantityChange={handleQuantityChange}
          handleTrashClick={handleTrashClick}
          handleBuyButtonClick={handleBuyButtonClick}
        />
      );
    });
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
                  onSort={() => setSorting("image")}
                >
                  {/* no title */}
                </Th>
                <Th
                  sorted={sortBy === "title"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("title")}
                >
                  Title
                </Th>
                <Th
                  sorted={sortBy === "type"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("type")}
                >
                  Type
                </Th>
                <Th
                  sorted={sortBy === "color"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("color")}
                >
                  Color
                </Th>
                <Th
                  sorted={sortBy === "size"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("size")}
                >
                  Size
                </Th>
                <Th
                  sorted={sortBy === "price"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("price")}
                >
                  Price
                </Th>
                <Th
                  sorted={sortBy === "quantity"}
                  reversed={reverseSortDirection}
                  onSort={() => setSorting("quantity")}
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
        <Button onClick={handleProceedCheckoutClick}>
          Proceed to checkout
        </Button>
      </div>
    </div>
  );
}

export default Transactions;
