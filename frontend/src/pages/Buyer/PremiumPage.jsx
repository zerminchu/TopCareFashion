/* eslint-disable react/prop-types */
import { Modal, Paper, Text, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function PremiumPopup({ isOpen, onClose }) {
  const navigate = useNavigate();

  const getStartedOnClick = () => {
    onClose();
    navigate("/buyer/premium-feature");
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Paper
        padding="md"
        shadow="xs"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "300px",
          backgroundColor: "white",
          borderRadius: "8px",
        }}
      >
        <Text
          size="xl"
          weight={700}
          style={{
            marginBottom: "20px",
          }}
        >
          Fashion Recommender
        </Text>
        <Text
          size="sm"
          style={{
            marginBottom: "20px",
          }}
        >
          The fashion recommender feature is a premium feature.
        </Text>
        <Button
          fullWidth
          size="lg"
          variant="gradient"
          gradient={{ from: "blue", to: "cyan" }}
          onClick={getStartedOnClick}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "4px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
          hoverStyle={{
            backgroundColor: "#0056b3",
          }}
        >
          Get Started
        </Button>
      </Paper>
    </Modal>
  );
}

export default PremiumPopup;
