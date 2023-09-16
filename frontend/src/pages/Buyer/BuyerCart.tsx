import React, { useState } from "react";
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
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch } from '@tabler/icons-react';
import blueShirt from "../../assets/images/blue_shirt.jpg";
//import

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  icon: {
    width: rem(21),
    height: rem(21),
    borderRadius: rem(21),
  },

  rateButton: {
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
    padding: '8px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease', // Add a transition for hover effect
    borderRadius: '10px',
  },

  rateButtonHover: {
    
  },

  container: {
    maxWidth: '1200px', // Set the maximum width for the container
    margin: '20px auto',  // Center the container horizontally and add a top margin
    border: '1px solid #ccc', // Add an outline border
    padding: '20px', // Add padding to the container
  },
}));

interface RowData {
  image: string,
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
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
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
const rateWord = "rate";

const dontSort = () => {
  console.log("nothing");
};

const sampleData: RowData[] = [
  {
    image: blueShirt,
    title: 'Blue Shirt',
    type: 'Top Wear',
    color: 'Blue',
    size: '28',
    price: '$28.00',
    quantity: '1',
  },
  
  
];



export function Transactions() {
  const { classes } = useStyles();
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState<RowData[]>(sampleData);
  const [sortBy, setSortBy] = useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [updatedData, setUpdatedData] = useState<RowData[]>(sampleData);

  const [editedQuantity, setEditedQuantity] = useState<Record<string, string>>( //sets the initial value into the text field
    sampleData.reduce((acc, item) => {
      acc[item.title] = item.quantity;
      return acc;
    }, {})
  );


  const setSorting = (field: keyof RowData) => { //sorting 
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

  

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => { //handle searches
    const { value } = event.currentTarget;
    setSearch(value);
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

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>, title: string) => {
    const { value } = event.currentTarget;
  
    // Use a regular expression to check if the value is a number
    if (/^\d+$/.test(value) || value === '') {
      setEditedQuantity((prevQuantity) => ({
        ...prevQuantity,
        [title]: value,
      }));
    } else {
      // Display an error message or handle invalid input as needed
      console.log(`Invalid input for ${title}: ${value}`);
    }
  };


  const handleBuyButtonClick= () => {
    console.log("pressed Buy Now");
  };

  const rows = sortedData.map((row) => (
    <tr key={row.title}>
      <td>
        <img src={row.image} alt={row.title} width="50" height="50" />
      </td>
      <td>{row.title}</td>
      <td>{row.type}</td>
      <td>{row.color}</td>
      <td>{row.size}</td>
      <td>{row.price}</td>
      <td>
      <input
        type="text"
        value={editedQuantity[row.title]}
        onChange={(e) => handleQuantityChange(e, row.title)}
        style={{ width: '40px' }} // Limit the width to 20px
      />
    </td>
      <td>
        <UnstyledButton
          className={`${classes.rateButton} ${classes.rateButtonHover}`}
          onClick={handleBuyButtonClick}
        >
          Buy Now
        </UnstyledButton>
      </td>
    </tr>
  ));

  return (
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
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} sx={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <Th sorted={sortBy === 'image'} reversed={reverseSortDirection} onSort={() => setSorting('image')}>
                {/* no title */}
              </Th>
              <Th sorted={sortBy === 'title'} reversed={reverseSortDirection} onSort={() => setSorting('title')}>
                Title
              </Th>
              <Th sorted={sortBy === 'type'} reversed={reverseSortDirection} onSort={() => setSorting('type')}>
                Type
              </Th>
              <Th sorted={sortBy === 'color'} reversed={reverseSortDirection} onSort={() => setSorting('color')}>
                Color
              </Th>
              <Th sorted={sortBy === 'size'} reversed={reverseSortDirection} onSort={() => setSorting('size')}>
                Size
              </Th>
              <Th sorted={sortBy === 'price'} reversed={reverseSortDirection} onSort={() => setSorting('price')}>
                Price
              </Th>
              <Th sorted={sortBy === 'quantity'} reversed={reverseSortDirection} onSort={() => setSorting('quantity')}>
                Quantity
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
