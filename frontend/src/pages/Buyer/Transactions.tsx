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
    padding: '8px 30px',
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
  buyer: string;
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
    buyer: 'John Tan',
    product_title: 'Blue Cardigan',
    price: '$132.50',
    quantity: 'x2',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'Red Dress',
    price: '$99.99',
    quantity: 'x1',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'Black T-Shirt',
    price: '$19.99',
    quantity: 'x3',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'Green Skirt',
    price: '$45.00',
    quantity: 'x4',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'Yellow Sweater',
    price: '$89.95',
    quantity: 'x1',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'White Blouse',
    price: '$29.99',
    quantity: 'x2',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'Striped Pants',
    price: '$65.00',
    quantity: 'x3',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'Pink Shirt',
    price: '$24.99',
    quantity: 'x2',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'Orange Jacket',
    price: '$79.50',
    quantity: 'x1',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'Gray Hoodie',
    price: '$54.99',
    quantity: 'x2',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'Brown Pants',
    price: '$38.00',
    quantity: 'x3',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'Purple Dress',
    price: '$69.95',
    quantity: 'x1',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'Navy Blue Jeans',
    price: '$49.99',
    quantity: 'x2',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'Beige Sweater',
    price: '$62.50',
    quantity: 'x3',
    status: 'paid',
  },
  {
    buyer: 'John Tan',
    product_title: 'Crimson Shirt',
    price: '$29.99',
    quantity: 'x2',
    status: 'paid',
  },
  
];



export function Transactions() {
  const { classes } = useStyles();
  const [search, setSearch] = React.useState('');
  const [sortedData, setSortedData] = React.useState(sampleData);
  const [sortBy, setSortBy] = React.useState<keyof RowData | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = React.useState(false);

  const setSorting = (field: keyof RowData) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(sampleData, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(sampleData, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const handleRateButtonClick= () => {
    console.log("pressed rate");
  };

  const rows = sortedData.map((row) => (
    <tr key={row.buyer}>
      <td>{row.buyer}</td>
      <td>{row.product_title}</td>
      <td>{row.price}</td>
      <td>{row.quantity}</td> {/* New column for quantity */}
      <td>{row.status}</td>   {/* New column for status */}
      <td>
      <td>
      <UnstyledButton className={`${classes.rateButton} ${classes.rateButtonHover}`} onClick={handleRateButtonClick }>
        RATE
      </UnstyledButton>
    </td>
      </td>
    </tr>
  ));

  return (
    <div className={classes.container}> {/* Container div */}
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
            <Th sorted={sortBy === 'buyer'} reversed={reverseSortDirection} onSort={() => setSorting('buyer')}>
              Buyer
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
