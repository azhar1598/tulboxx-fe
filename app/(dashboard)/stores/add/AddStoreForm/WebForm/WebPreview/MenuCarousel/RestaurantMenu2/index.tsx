import React from "react";

import { Text } from "@mantine/core";
import { IconCurrencyRupee } from "@tabler/icons-react";

const RestaurantMenu2 = ({ title, storeInfo }: any) => {
  return (
    <div className="min-h- bg-black/30 backdrop-blur-sm  py-3 mx-3 text-white rounded-sm menu-bg2">
      <div className="max-w- mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {/* <h2 className="text-md text-gray-300">Paucek and Lage Restaurant</h2> */}
        </div>

        {/* Main Course Section */}
        <div className="flex justify-between items-center mb-12 ">
          <div className="w-64 mr-4 pl-4">
            <div
              className="text-md inline-block   px-3 py-2 rounded-md mb-4"
              style={{ backgroundColor: storeInfo?.websiteTheme.primaryColor }}
            >
              <Text
                c={"white"}
                size={"14px"}
                fw={600}
                className="text-black font-bold"
              >
                {" "}
                MAIN COURSE
              </Text>
            </div>
            <div className="space-y-2">
              <MenuItem name="Cheeseburger" price={34} />
              <MenuItem name="Cheese sandwich" price={22} />
              <MenuItem name="Chicken burgers" price={23} />
              <MenuItem name="Spicy chicken" price={33} />
              <MenuItem name="Hot dog" price={24} />
            </div>
          </div>
          <div className="w-[170px] h-[170px] relative">
            <div
              className="absolute inset-4  rounded-lg"
              style={{ backgroundColor: storeInfo?.websiteTheme.primaryColor }}
            />
            <img
              src="https://img-global.cpcdn.com/recipes/9544754ba07a6b31/1200x630cq70/photo.jpg"
              alt="Main course"
              className="absolute pr-4 inset-0 rounded-lg object-cover h-48"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-12 ">
          <div className="w-[170px] h-[170px] relative">
            <div
              className="absolute pr-4 inset-0rounded-lg"
              style={{ backgroundColor: storeInfo?.websiteTheme.primaryColor }}
            />
            <img
              src="https://www.masalakorb.com/wp-content/uploads/2017/02/Chicken-Biryani-Pressure-Cooker-Recipe-V1.jpg"
              alt="Main course"
              className="absolute inset-2 rounded-lg object-cover"
            />
          </div>
          <div className="w-64 ml-4 pr-4">
            <div
              className="text-md inline-block  px-3 py-2 rounded-md mb-4"
              style={{ backgroundColor: storeInfo?.websiteTheme.primaryColor }}
            >
              <Text
                c={"white"}
                size={"14px"}
                fw={600}
                className="text-black font-bold"
              >
                {" "}
                APPETIZERS
              </Text>
            </div>
            <div className="space-y-2">
              <MenuItem name="Cheeseburger" price={34} />
              <MenuItem name="Cheese sandwich" price={22} />
              <MenuItem name="Chicken burgers" price={23} />
              <MenuItem name="Spicy chicken" price={33} />
              <MenuItem name="Hot dog" price={24} />
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="flex justify-center gap-6">
          <div className="bg-[#901414] text-black px-4 py-2 rounded-md flex items-center gap-2">
            <Phone size={20} />
            123-456-7890
          </div>
          <div className="bg-[#901414] text-black px-4 py-2 rounded-md flex items-center gap-2">
            <MapPin size={20} />
            123 Anywhere St., Any City
          </div>
        </div> */}
      </div>
    </div>
  );
};

// MenuItem component for consistent styling
const MenuItem = ({ name, price }: any) => (
  <div className="flex justify-between items-center">
    <span className="text-[12px]">{name}</span>
    <div className="flex items-center">
      <span className="flex text-[12px]">
        <IconCurrencyRupee stroke={1} size={16} /> {price}
      </span>
    </div>
  </div>
);

export default RestaurantMenu2;
