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
          <Text size="lg" weight={700} style={{ marginBottom: "20px" }}>
            Elevate Your Style with Premium Access!
          </Text>
          <Text size="sm" style={{ marginBottom: "20px" }}>
            Unlock the full potential of our Conversational Fashion Recommender
            – a premium feature designed just for you. Discover the latest
            trends, receive personalised recommendations, and stay ahead in the
            fashion game.
            <br />
            <br />
            <Text weight={700} color="#555">
              UNLIMITED LIFETIME ACCESS
            </Text>{" "}
            for an incredible price of only
            <Text weight={700} color="#555">
              S$4.99
            </Text>
            <br />
            <i>Limited Time Only</i>
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
