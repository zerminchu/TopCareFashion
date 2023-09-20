import React, { useState, useEffect } from "react";
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
} from "@mantine/core";
import { retrieveUserInfo } from "../../utils/RetrieveUserInfoFromToken";
import { showNotifications } from "../../utils/ShowNotification";
import Cookies from "js-cookie";
import { keys } from "@mantine/utils";
import {
  IconSelector,
  IconChevronDown,
  IconChevronUp,
  IconSearch,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { DUMMY_TRANSACTION_PRODUCT } from "../../data/Products";

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
    padding: "8px 30px",
    cursor: "pointer",
    transition: "background-color 0.3s ease", // Add a transition for hover effect
    borderRadius: "10px",
  },

  rateButtonHover: {},

  detailButton: {
    backgroundColor: "black",
    color: "white",
    border: "none",
    padding: "8px 30px",
    cursor: "pointer",
    transition: "background-color 0.3s ease", // Add a transition for hover effect
    borderRadius: "10px",
  },

  detailButtonHover: {},

  container: {
    maxWidth: "1400px", // Set the maximum width for the container
    margin: "20px auto", // Center the container horizontally and add a top margin
    border: "1px solid #ccc", // Add an outline border
    padding: "20px", // Add padding to the container
  },
}));

interface RowData {
  image: string;
  product_title: string;
  price: string;
  quantity: string;
  status: string;
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

const dontSort = () => {
  console.log("nothing");
};

const sampleData: RowData[] = [
  
  {
    image:
      "https://images.unsplash.com/photo-1597350584914-55bb62285896?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
    product_title: "Trendy White Sneakers",
    price: "$300.00",
    quantity: "3",
    status: 'paid',
  },
  {
    image:
      "https://images.unsplash.com/photo-1606480192262-e3b6a9f37142?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVkJTIwZ293bnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    product_title: "Red Dress",
    price: "$211.56",
    quantity: "2",
    status: 'paid',
  },
  
  
];

export function Transactions() {
  const navigate = useNavigate();
  const { classes } = useStyles();

  const [currentUser, setCurrentUser] = useState();
  const [search, setSearch] = React.useState("");
  const [sortedData, setSortedData] = React.useState(sampleData);
  const [sortBy, setSortBy] = React.useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = React.useState(false);

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
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(sampleData, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(
      sortData(sampleData, {
        sortBy,
        reversed: reverseSortDirection,
        search: value,
      })
    );
  };


  const handleRateButtonClick = (product_title) => {
    const data = DUMMY_TRANSACTION_PRODUCT;

    const filteredData = data.filter((item) => item.title === product_title);
    console.log("pressed buy" +product_title) //title passes the param

    navigate("/buyer/product-rate", {
      state: { data: filteredData },
    });
  };

  const handleDetailsButonClick = (product_title) => {
    const data = DUMMY_TRANSACTION_PRODUCT;

    const filteredData = data.filter((item) => item.title === product_title);
    console.log("pressed buy" +product_title) //title passes the param

    navigate("/buyer/product-order-status", {
      state: { data: filteredData },
    });
  };

  const rows = sortedData.map((row) => (
    <tr key={row.product_title}>
      <td>
        <img src={row.image} alt={row.image} width="50" height="50" />
      </td>
      <td>{row.product_title}</td>
      <td>{row.price}</td>
      <td>{row.quantity}</td> {/* New column for quantity */}
      <td>{row.status}</td> {/* New column for status */}
      
        <td>
          <UnstyledButton
            className={`${classes.rateButton} ${classes.rateButtonHover}`}
            onClick={() => handleRateButtonClick(row.product_title)}
          >
            RATE
          </UnstyledButton>
        </td>
      
      <td>
          <UnstyledButton
            className={`${classes.detailButton} ${classes.detailButtonHover}`}
            onClick={() => handleDetailsButonClick(row.product_title)}
          >
            View Details
          </UnstyledButton>
        </td>
    </tr>
  ));

  return (
    <div className={classes.container}>
      {" "}
      {/* Container div */}
      <Text weight={700} underline size="24px" mb="sm">
        Orders
      </Text>
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        icon={<IconSearch size="0.9rem" stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} sx={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
          <Th
                sorted={sortBy === "image"}
                reversed={reverseSortDirection}
                onSort={() => setSorting("image")}
              >
                {/* no title */}
              </Th>
            <Th sorted={sortBy === 'product_title'} reversed={reverseSortDirection} onSort={() => setSorting('product_title')}>
              Product Title
            </Th>
            <Th sorted={sortBy === 'price'} reversed={reverseSortDirection} onSort={() => setSorting('price')}>
              Price
            </Th>
            <Th sorted={sortBy === 'quantity'} reversed={reverseSortDirection} onSort={() => setSorting('quantity')}>
            Quantity
          </Th>
          <Th sorted={sortBy === 'status'} reversed={reverseSortDirection} onSort={() => setSorting('status')}>
            Status
          </Th>
          <Th sorted={sortBy === null} reversed={reverseSortDirection} onSort={() => dontSort}>
            {/* No title for this column */}
          </Th>
          <Th sorted={sortBy === null} reversed={reverseSortDirection} onSort={() => dontSort}>
            {/* No title for this column */}
          </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            
              <tr>
                <td colSpan={Object.keys(sampleData[0]).length}>
                  <Text weight={500} align="center">
                    Nothing found
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </ScrollArea>
    </div>
  );
}

export default Transactions;
