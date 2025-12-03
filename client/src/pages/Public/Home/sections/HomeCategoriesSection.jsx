import React from "react";
import { Link } from "react-router-dom";
import { Alert, Col, Container, Row } from "reactstrap";
import BlockLoader from "../../../../common/components/Loaders/BlockLoader";
import ImageLoader from "../../../../common/components/Loaders/ImgLoader";
import useGetCategories from "../../../../common/hooks/categories/useGetCategories";

const HomeCategoriesSection = () => {
  const { allCategories } = useGetCategories();

  return (
    <section className="categories-section">
      <Container className="my-5">
        {allCategories?.loading ? (
          <BlockLoader minHeight={300} />
        ) : allCategories?.error ? (
          <Alert color="danger">Đã xảy ra lỗi khi tải danh mục: {allCategories?.error}</Alert>
        ) : (
          <>
            <h2 className="text-center mb-4">Danh mục sản phẩm</h2>
            <Row md={4} xs={2}>
              {allCategories?.categories?.slice(0, 4).map((item, idx) => (
                <Col key={idx} className="mb-3 text-center">
                  <Link to={`/categories/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <ImageLoader
                      image={item?.image}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <p className="mt-2">{item?.name}</p> {/* Hiển thị tên danh mục nếu có */}
                  </Link>
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </section>
  );
};

export default HomeCategoriesSection;
