/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Image,
  Text,
  Group,
  Badge,
  createStyles,
  Center,
  Button,
  rem,
} from "@mantine/core";
import axios from "axios";

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
  const { id } = useParams();
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [colour, setColour] = useState("");
  const [image, setImage] = useState("");
  const { classes } = useStyles();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/view-item/${id}/`
        );
        const fetchedItems = response.data; // Array of items
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching Items:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {items.map((item, index) => (
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
              {item.category}
            </Text>

            <Group spacing={8} mb={-8}>
              {/* Add your features here */}
            </Group>
          </Card.Section>

          <Card.Section className={classes.section}>
            <Group spacing={30}>
              <div>
                <Text fz="xl" fw={700} sx={{ lineHeight: 1 }}>
                  $168.00
                </Text>
              </div>
            </Group>
          </Card.Section>
        </Card>
      ))}
    </div>
  );
}

export default SellerCards;
