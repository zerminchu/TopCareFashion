import {
  Container,
  SimpleGrid,
  Text,
  Title,
  createStyles,
  rem,
} from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
    marginLeft: "auto",
    marginRight: "auto",
  },

  title: {
    fontWeight: 900,
    fontSize: rem(34),
    marginBottom: theme.spacing.xl,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    whiteSpace: "nowrap",

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(32),
    },
  },

  text: {
    whiteSpace: "nowrap",
  },

  control: {
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },

  mobileImage: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },

  desktopImage: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));

function NotFoundImage() {
  const { classes } = useStyles();

  return (
    <Container className={classes.root}>
      <SimpleGrid
        spacing={80}
        cols={2}
        breakpoints={[{ maxWidth: "sm", cols: 1, spacing: 40 }]}
      >
        <div>
          <Title className={classes.title}>Something is not right...</Title>
          <Text className={classes.text} color="dimmed" size="lg">
            No Listings were found.
          </Text>
        </div>
      </SimpleGrid>
    </Container>
  );
}
export default NotFoundImage;
