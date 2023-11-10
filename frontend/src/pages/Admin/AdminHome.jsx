import React, { useState } from "react";
import { Tabs } from "@mantine/core";
import AdminBuyer from "./AdminBuyer";
import AdminSeller from "./AdminSeller";
import AdminCategory from "./AdminCategory";
import AdminFeedback from "./AdminFeedback";

import classes from "./AdminHome.module.css";

function AdminHome() {
  return (
    <div className={classes.container}>
      <h1>System Administrator</h1>
      <Tabs defaultValue="buyer">
        <Tabs.List>
          <Tabs.Tab value="buyer">Buyer</Tabs.Tab>
          <Tabs.Tab value="seller">Seller</Tabs.Tab>
          <Tabs.Tab value="category">Category</Tabs.Tab>
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
