import React, { useEffect, useState } from "react";
import { Carousel } from "@mantine/carousel";
import axios from "axios";

import classes from "./CarouselAds.module.css";
import CarouselItem from "../../components/CarouselItem";

function CarouselAds() {
  const [productAdvertisementList, setproductAdvertisementList] = useState([]);

  const itemOnClick = () => {
    navigate("/buyer/product-detail", {
      state: { data: props },
    });
  };

  useEffect(() => {
    const retrieveAdvertisementListing = async () => {
      try {
        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(`${url}/listing/advertisement`);
        setproductAdvertisementList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    retrieveAdvertisementListing();
  }, []);

  const renderListingAdvertisement = () => {
    return productAdvertisementList.map((ads, index) => {
      return (
        <Carousel.Slide key={index}>
          <CarouselItem itemId={ads.item_id} image={ads.image_urls[0]} />
        </Carousel.Slide>
      );
    });
  };

  return (
    <Carousel
      withIndicators
      height={250}
      slideSize="33.333333%"
      slideGap="md"
      loop
      align="start"
      slidesToScroll={3}
    >
      {renderListingAdvertisement()}
    </Carousel>
  );
}

export default CarouselAds;
