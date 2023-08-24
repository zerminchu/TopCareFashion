import { SimpleGrid, Container, useMantineTheme } from "@mantine/core";
import { useLocation } from "react-router-dom";

/* 
const getChild = (height) => (
  <Skeleton height={height} radius="md" animate={false} />
);
const BASE_HEIGHT = 360;
const getSubHeight = (children, spacing) =>
  BASE_HEIGHT / children - spacing * ((children - 1) / children); */

function ListItem() {
  const theme = useMantineTheme();
  const location = useLocation();
  const uploadedImages = location.state?.uploadedImages || [];

  return (
    <Container my="md">
      <SimpleGrid cols={4} breakpoints={[{ maxWidth: "xs", cols: 1 }]}>
        {uploadedImages.map((imageSrc, index) => (
          <Container key={index}>
            <img
              src={imageSrc}
              alt={`Uploaded ${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                borderRadius: theme.radius.md,
              }}
            />
          </Container>
        ))}
      </SimpleGrid>
    </Container>
  );
}

export default ListItem;
