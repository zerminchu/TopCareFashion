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
          width: "400px",
          backgroundColor: "white",
          borderRadius: "8px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flex: 1, // Center content vertically
            padding: "20px", // Add padding for better spacing
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
            The conversational fashion recommender feature is a premium feature.
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
        </div>
      </Paper>
    </Modal>
  );
}

export default PremiumPopup;
