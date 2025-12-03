import React from "react";
import PageBreadcrumbs from "../../../common/components/Shared/PageBreadcrumbs";
import PageHelmet from "../../../common/components/Shared/PageHelmet";

import CategoriesSection from "./sections/CategoriesSection";
import {Container} from "reactstrap";

const Categories = () => {
  return (
    <>
      <PageHelmet title={"Categories"} />
      <Container className="my-4">
        <PageBreadcrumbs
          pages={[
            {page: "Cửa hàng", link: "/"},
            {page: "Danh mục", isActive: true},
          ]}
        />
        <CategoriesSection withSlice={false} />
      </Container>
    </>
  );
};

export default Categories;
