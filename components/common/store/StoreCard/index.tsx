import { Button, Card } from "@mantine/core";
import { IconMapPin } from "@tabler/icons-react";
import React from "react";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { MapPin } from "lucide-react";

export const StoreCard = ({ storeName, location, imageUrl }) => {
  return (
    <Card className="w-full md:w-72 overflow-hidden" bg={"white"}>
      {/* Image Section */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={imageUrl || "/api/placeholder/400/320"}
          alt={storeName}
          className="w-full h-full object-cover"
        />
      </div>

      <Card.Section className="p-4">
        {/* Store Name */}
        <h3 className="font-semibold text-lg mb-2">{storeName}</h3>

        {/* Location with Icon */}
        <div className="flex items-center text-gray-600 mb-4">
          <IconMapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{location}</span>
        </div>
      </Card.Section>

      <Button className="w-full p-4 pt-0" variant="">
        View Details
      </Button>
    </Card>
  );
};
