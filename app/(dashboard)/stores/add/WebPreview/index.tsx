import React, { useState, useEffect } from "react";
import { Card, Group, Text, Modal } from "@mantine/core";
import {
  IconChevronRight,
  IconClock,
  IconMapPin,
  IconMenu2,
  IconSearch,
  IconShoppingCart,
  IconX,
  IconChevronLeft,
} from "@tabler/icons-react";
import Image from "next/image";
import IPhoneFrame from "./IPhoneFrame";

const ImageCarousel = ({ images, currentIndex, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  const goToNext = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <IconX size={24} />
        </button>

        {/* Previous button */}
        <button
          onClick={goToPrev}
          className="absolute left-4 z-10 bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <IconChevronLeft size={24} />
        </button>

        {/* Next button */}
        <button
          onClick={goToNext}
          className="absolute right-4 z-10 bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <IconChevronRight size={24} />
        </button>

        {/* Image */}
        <div className="w-full h-full p-12 flex items-center justify-center">
          <img
            src={images[activeIndex].preview}
            alt={`Image ${activeIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex ? "w-4 bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MobileWebPreview = ({ storeInfo }) => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!storeInfo?.logo) return;
    const file = storeInfo.logo;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  }, [storeInfo?.logo]);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    return `${hours % 12 || 12}:${minutes
      ?.toString()
      .padStart(2, "0")} ${ampm}`;
  };

  const groupedHours = storeInfo?.businessHours?.reduce((acc, hour) => {
    const { day, openTime, closeTime } = hour;
    const key = `${openTime}-${closeTime}`;
    if (!acc[key]) {
      acc[key] = { days: [day], openTime, closeTime };
    } else {
      acc[key].days.push(day);
    }
    return acc;
  }, {});

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setShowCarousel(true);
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showCarousel) return;

      switch (e.key) {
        case "ArrowRight":
          setSelectedImageIndex((prev) =>
            prev === (storeInfo?.menuImages?.length || 0) - 1 ? 0 : prev + 1
          );
          break;
        case "ArrowLeft":
          setSelectedImageIndex((prev) =>
            prev === 0 ? (storeInfo?.menuImages?.length || 0) - 1 : prev - 1
          );
          break;
        case "Escape":
          setShowCarousel(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showCarousel, storeInfo?.menuImages?.length]);

  return (
    <IPhoneFrame>
      <div
        className="flex flex-col min-h-screen w-full max-w-md mx-auto rounded-xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: storeInfo?.websiteTheme.primaryColor }}
      >
        {/* Header Section */}
        <div className="relative pt-8 pb-4">
          <div className="flex justify-center">
            {!logoPreview ? (
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <Text
                  className="text-2xl font-bold"
                  style={{ color: storeInfo?.websiteTheme.primaryColor }}
                >
                  {storeInfo?.name?.slice(0, 2).toUpperCase()}
                </Text>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg">
                <img
                  src={logoPreview}
                  alt="Store logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div
          className="flex-grow rounded-t-3xl px-6 py-8"
          style={{ backgroundColor: storeInfo?.websiteTheme.secondaryColor }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {storeInfo?.name}
            </h1>
            <p className="text-white/80">{storeInfo?.tagLine}</p>
          </div>

          {/* Menu Images */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {storeInfo?.menuImages?.map((img, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden shadow-md cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={img.preview}
                  alt={`Menu ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
            <Card className="bg-white/10 border-0 p-4">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="font-semibold text-lg text-white">About Us</h2>
              </div>
              <p className="text-white/80">{storeInfo?.description}</p>
            </Card>

            <Card className="bg-white/10 border-0 p-4">
              <div className="flex items-center gap-3 mb-2">
                <IconMapPin className="w-5 h-5 text-white" />
                <h2 className="font-semibold text-lg text-white">Location</h2>
              </div>
              <p className="text-white/80">
                {[
                  storeInfo?.address,
                  storeInfo?.city,
                  storeInfo?.state,
                  storeInfo?.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </Card>

            <Card className="bg-white/10 border-0 p-4">
              <div className="flex items-center gap-3 mb-2">
                <IconClock className="w-5 h-5 text-white" />
                <h2 className="font-semibold text-lg text-white">
                  Our Timings
                </h2>
              </div>
              <div className="space-y-2">
                {groupedHours &&
                  Object.values(groupedHours).map(
                    ({ days, openTime, closeTime }) => (
                      <div
                        key={`${openTime}-${closeTime}`}
                        className="text-white/80"
                      >
                        <span className="font-medium">
                          {days.length > 1
                            ? `${days.slice(0, -1).join(", ")} and ${
                                days[days.length - 1]
                              }`
                            : days[0]}
                        </span>
                        : {formatTime(openTime)} - {formatTime(closeTime)}
                      </div>
                    )
                  )}
              </div>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-6 px-6">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-400">
                © {new Date().getFullYear()} {storeInfo?.name}
              </p>
              <p className="text-gray-500 text-sm">Powered by Your Company</p>
            </div>
          </div>
        </footer>

        {/* Custom Image Carousel */}
        {showCarousel && (
          <ImageCarousel
            images={storeInfo?.menuImages}
            currentIndex={selectedImageIndex}
            onClose={() => setShowCarousel(false)}
          />
        )}
      </div>
    </IPhoneFrame>
  );
};

export default MobileWebPreview;
