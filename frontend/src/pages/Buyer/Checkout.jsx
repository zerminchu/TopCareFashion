import React, { useState } from "react";
import { Stepper, Button, Group, Text, Table } from "@mantine/core";

import ILProductImage from "../../assets/illustrations/il_category_top.jpg";

function Checkout() {
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const elements = [{ position: 6, mass: 12.011, symbol: "C", name: "Carbon" }];

  const rows = elements.map((element) => (
    <tr key={element.name}>
      <td>{element.position}</td>
      <td>{element.name}</td>
      <td>{element.symbol}</td>
      <td>{element.mass}</td>
    </tr>
  ));

  const renderCheckoutItems = () => {
    return (
      <div>
        <Text>Pickup address</Text>
        <Text>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s
        </Text>

        <Text>STORE NAME</Text>
        <Button>Chat with seller</Button>

        <div>
          <Text>Product ordered</Text>
          <Table>
            <thead>
              <tr>
                <th>Product ordered</th>
                <th>Unit price</th>
                <th>Amount</th>
                <th>Item subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr key="my key">
                <td>
                  <img src={ILProductImage} width={50} height={50} />
                </td>
                <td>$78.67</td>
                <td>3</td>
                <td>mass</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step label="First step" description="Create an account">
          Step 1 content: Create an account
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify email">
          Step 2 content: Verify email
        </Stepper.Step>
        <Stepper.Step label="Final step" description="Get full access">
          Step 3 content: Get full access
        </Stepper.Step>
        <Stepper.Completed>
          Completed, click back button to get to previous step
        </Stepper.Completed>
      </Stepper>
      {renderCheckoutItems()}
    </div>
  );
}

export default Checkout;
