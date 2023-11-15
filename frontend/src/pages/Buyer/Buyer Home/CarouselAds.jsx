import React, { useEffect, useState, useRef } from "react";
import { Carousel } from "@mantine/carousel";
import axios from "axios";
import CarouselItem from "../../../components/Home Page/CarouselItem";
import { useDispatch } from "react-redux";
import { Loader } from "@mantine/core";

function CarouselAds() {
  const [productAdvertisementList, setproductAdvertisementList] = useState();
  const dispatch = useDispatch();

  const itemOnClick = () => {
    navigate("/buyer/product-detail", {
      state: { data: props },
    });
  };

  useEffect(() => {
    const retrieveAdvertisementListing = async () => {
      try {
        const gender = window.location.pathname.includes("/women")
          ? "women"
          : "men";

        const url =
          import.meta.env.VITE_NODE_ENV == "DEV"
            ? import.meta.env.VITE_API_DEV
            : import.meta.env.VITE_API_PROD;

        const response = await axios.get(
          `${url}/listing/advertisement/${gender}/`
        );
        setproductAdvertisementList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    retrieveAdvertisementListing();
  }, []);

  const renderListingAdvertisement = () => {
    if (productAdvertisementList) {
      if (productAdvertisementList.length > 0) {
        return productAdvertisementList.map((ads, index) => {
          return (
            <Carousel.Slide key={index}>
              <CarouselItem
                category={ads.sub_category}
                title={ads.title}
                itemId={ads.item_id}
                image={ads.image_urls[0]}
                price={ads.price}
              />
            </Carousel.Slide>
          );
        });
      }

      return <Text>There is no advertisement products</Text>;
    }

    return <Loader color="blue" />;
  };

  return (
    <Carousel
      withIndicators
      draggable
      height={400}
      slideSize="25%"
      slideGap="md"
      loop
      align="start"
      slidesToScroll={1}
      inViewThreshold={0.5}
      speed={500}
      withControls
    >
      {renderListingAdvertisement()}
    </Carousel>
  );
}

export default CarouselAds;
