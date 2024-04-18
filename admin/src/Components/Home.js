import React from "react";
import bannerImage from "../Images/banner_image.jpg";

export default function Home() {
  return (
    <div>
      <div className="image-container">
        <img src={bannerImage} alt="Banner" className="width100" />
        <div className="overlay">Welcome to Admin View</div>
      </div>
    </div>
  );
}
