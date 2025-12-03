import React from "react";
import BannersCarousel from "../../../../common/components/Carousel/BannersCarousel";

const HomeBannersSection = () => {
  return (
    <section className="banners-section">
      <h2 className="text-center mb-4">Khuyến mãi nổi bật</h2>
      <BannersCarousel />
    </section>
  );
};

export default HomeBannersSection;
