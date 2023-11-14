import { Tabs } from "@mantine/core";
import React from "react";
import AdminBuyer from "./AdminBuyer";
import AdminCategory from "./AdminCategory";
import AdminFeedback from "./AdminFeedback";
import AdminSeller from "./AdminSeller";

import classes from "./AdminHome.module.css";

function AdminHome() {
  return (
    <div className={classes.container}>
      <h1>System Administrator Dashboard</h1>
      <Tabs defaultValue="buyer">
        <Tabs.List>
          <Tabs.Tab value="buyer">Buyer</Tabs.Tab>
          <Tabs.Tab value="seller">Seller</Tabs.Tab>
          <Tabs.Tab value="category">Fashion Categories</Tabs.Tab>
          <Tabs.Tab value="feedback">Feedback</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="buyer">
          <AdminBuyer />
        </Tabs.Panel>
        <Tabs.Panel value="seller">
          <AdminSeller />
        </Tabs.Panel>
        <Tabs.Panel value="category">
          <AdminCategory />
        </Tabs.Panel>
        <Tabs.Panel value="feedback">
          <AdminFeedback />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

export default AdminHome;
