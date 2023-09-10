import { TextInput, Text, Textarea, Select, Button } from "@mantine/core";
import { useForm } from "@mantine/form";

import classes from "./BusinessProfileForm.module.css";
import { useNavigate } from "react-router-dom";

function BusinessProfileForm() {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      businessName: "John77 Shop",
      businessDescription:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sedeuismod, diam Lorem ipsum dolor sit amet, consectetur adipiscingelit. Sed euismod, diam. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Sed euismod, diam Lorem ipsum dolor sit amet,consectetur adipiscing elit. Sed euismod, diam",
      businessType: "retailer",
      location: "New York, NY",
      socialMedia: "instagram.com/sellername",
      contactInformation: "555-666-777",
    },
  });

  const cancelOnClick = () => {
    navigate("/", { replace: true });
  };

  const saveOnClick = () => {
    console.log(form.values);
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <Text fw={700} fz="lg">
          Business profile
        </Text>
        <TextInput
          value={form.values.businessName}
          label="Business Name"
          placeholder="Business Name"
          {...form.getInputProps("businessName")}
        />
        <Select
          value={form.values.businessType}
          label="Business Type"
          placeholder="Business Type"
          data={[
            { value: "retailer", label: "Retailer" },
            { value: "manufacturer", label: "Manufacturer" },
            { value: "distributor", label: "Distributor" },
          ]}
          onChange={(value) => form.setValues({ businessType: value })}
        />
        <TextInput
          value={form.values.location}
          label="Location"
          placeholder="Location"
          {...form.getInputProps("location")}
        />
        <TextInput
          value={form.values.contactInformation}
          label="Contact Information"
          placeholder="Contact Information"
          {...form.getInputProps("contactInformation")}
        />
        <TextInput
          value={form.values.socialMedia}
          label="Social Media Link"
          placeholder="Social Media Link"
          {...form.getInputProps("socialMedia")}
        />
        <Textarea
          value={form.values.businessDescription}
          placeholder="Description"
          label="Description"
          {...form.getInputProps("businessDescription")}
        />
        <div className={classes.bottom}>
          <Button onClick={saveOnClick}>Save Changes</Button>
          <Button variant="outline" onClick={cancelOnClick}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BusinessProfileForm;
