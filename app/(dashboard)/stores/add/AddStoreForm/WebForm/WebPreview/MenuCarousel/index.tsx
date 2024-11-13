import React from "react";
import { Carousel } from "@mantine/carousel";
import RestaurantMenu2 from "./RestaurantMenu2";

interface MenuCarouselProps {
  images: string[];
  currentIndex?: number;
  onClose?: () => void;
  storeInfo: any;
}

const MenuCarousel: React.FC<MenuCarouselProps> = ({
  currentIndex = 0,
  onClose,
  storeInfo,
}) => {
  return (
    <Carousel
      withIndicators
      height="100vh"
      initialSlide={currentIndex}
      loop
      align="start"
      slidesToScroll={1}
      styles={{
        root: {
          width: "100%",
        },
        viewport: {
          height: "100%",
        },
        container: {
          height: "100%",
        },
        slide: {
          height: "100%",
          width: "100%",
        },
        indicators: {
          bottom: "2rem",
        },
      }}
    >
      <Carousel.Slide key={1}>
        <div className="h-full w-full overflow-auto">
          <RestaurantMenu2 title={"OUR MENU"} storeInfo={storeInfo} />
        </div>
      </Carousel.Slide>
      <Carousel.Slide key={2}>
        <div className="h-full w-full overflow-auto">
          <RestaurantMenu2 />
        </div>
      </Carousel.Slide>
    </Carousel>
  );
};

export default MenuCarousel;
