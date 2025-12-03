import React, { useEffect } from "react";
import { getProductDetails } from "../../../../features/products/productsServices";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Badge,
  Button,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  Spinner,
  UncontrolledTooltip,
} from "reactstrap";
import BlockLoader from "../../../../common/components/Loaders/BlockLoader";
import ProductDetailsCarousel from "../../../../common/components/Carousel/ProductDetailsCarousel";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import useWishlist from "../../../../common/hooks/wishlist/useWishlist";
import RatingStars from "../../../../common/components/Shared/RatingStars";
import ProductsTabbedSection from "./ProductsTabbedSection";
import ProductsInSameCategorySection from "./ProductsInSameCategorySection";
import useAddToCart from "../../../../common/hooks/cart/useAddToCart";

const ProductInfoSection = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();

  useEffect(() => {
    dispatch(getProductDetails(productId));
  }, [productId, dispatch]);

  const { productDetails } = useSelector((state) => state.products);

  const {
    userWishList,
    isMutation,
    isLoggedIn,
    handleRemoveFromWishlist,
    handleAddToWishlist,
  } = useWishlist();

  const product = productDetails?.product || {};
  const variants = product.variants || [];
  const uniqueColors = [...new Set(variants.map(v => v.color).filter(Boolean))];

  // Hook useAddToCart, mình khởi tạo colorIdx và sizeIdx là null trong hook nhé
  const {
    colorIdx,
    sizeIdx,
    variantsQuantity,
    handleSelectColor,
    handleSelectSize,
    handleQtyChange,
    handleAddToCart,
    cartState,
  } = useAddToCart(product);

  const sizesForSelectedColor = colorIdx !== null
    ? variants
        .filter(v => v.color === uniqueColors[colorIdx])
        .map(v => v.size)
    : [];

  const selectedColor = colorIdx !== null ? uniqueColors[colorIdx] : null;
  const selectedSize = sizeIdx !== null ? sizesForSelectedColor[sizeIdx] : null;
  const variantKey = selectedColor && selectedSize ? `${selectedColor}-${selectedSize}` : null;

  const stockForSelection = variantKey
    ? variants.find(v => v.color === selectedColor && v.size === selectedSize)?.stock || 0
    : 0;

  const quantitySelected = variantKey ? variantsQuantity[variantKey] || 1 : 1;

  const isAddToCartDisabled =
    !selectedColor || !selectedSize || quantitySelected <= 0 || quantitySelected > stockForSelection;

  return (
    <section className="products-info-section">
      {productDetails?.loading ? (
        <BlockLoader minHeight={300} />
      ) : productDetails?.error ? (
        typeof productDetails?.error === "string" ? (
          <Alert color="danger">{productDetails?.error}</Alert>
        ) : (
          productDetails?.error?.map((err, idx) => (
            <Alert color="danger" key={idx}>
              {err.msg}
            </Alert>
          ))
        )
      ) : (
        <>
          <Row>
            <Col md={5}>
              <ProductDetailsCarousel
                sliderImages={product.sliderImages}
                image={product.image}
              />
            </Col>
            <Col md={7}>
              <ListGroup flush>
                <ListGroupItem>
                  <div className="name-wish-container d-flex align-items-center justify-content-between">
                    <h3 className="m-0">{product.name}</h3>
                    {!isLoggedIn ? (
                      <>
                        <AiOutlineHeart size={30} id="ScheduleUpdateTooltip" />
                        <UncontrolledTooltip
                          placement="top"
                          target="ScheduleUpdateTooltip"
                          trigger="click"
                        >
                          Đăng nhập để sử dụng
                        </UncontrolledTooltip>
                      </>
                    ) : isMutation?.loading || userWishList?.loading ? (
                      <Spinner size={"sm"} />
                    ) : userWishList?.wishlist?.findIndex(
                        (item) => item._id === product._id
                      ) === -1 ? (
                      <AiOutlineHeart
                        size={30}
                        onClick={() => handleAddToWishlist(product._id)}
                      />
                    ) : (
                      <AiFillHeart
                        size={30}
                        color={"red"}
                        onClick={() => handleRemoveFromWishlist(product._id)}
                      />
                    )}
                  </div>
                </ListGroupItem>

                <ListGroupItem>
                  <p className="id-container m-0">
                    Mã sản phẩm - <span className="text-muted">{product._id}</span>
                  </p>
                </ListGroupItem>

                <ListGroupItem>
                  <div className="cat-subCat-container d-flex flex-column">
                    <span>
                      DANH MỤC - <Badge color="info" className="p-1 rounded">{product.category?.name}</Badge>
                    </span>
                    {product.subcategories?.length > 0 && (
                      <span className="mt-2">
                        NHÓM PHỤ -{" "}
                        {product.subcategories.map((item) => (
                          <Badge
                            color="danger"
                            className="p-1 rounded me-2"
                            key={item._id}
                          >
                            {item.name}
                          </Badge>
                        ))}
                      </span>
                    )}
                  </div>
                </ListGroupItem>

                <ListGroupItem>
                  <span style={{ color: "#ff6262" }}>
                    ${product.price - product.discount}
                  </span>{" "}
                  {product.discount > 0 && (
                    <span className="text-muted text-decoration-line-through">
                      ${product.price}
                    </span>
                  )}
                </ListGroupItem>

                <ListGroupItem>
                  <div className="d-flex align-items-center">
                    <RatingStars size={24} ratingAverage={product.ratingAverage} />
                    <span className="pt-1 text-muted">
                      ({product.reviewsNumber} đánh giá)
                    </span>
                  </div>
                </ListGroupItem>

                <ListGroupItem>
                  <div>
                    ĐÃ BÁN - <span className="pt-1 text-muted">({product.sold})</span>
                  </div>
                </ListGroupItem>

                {/* Màu sắc */}
                {uniqueColors.length > 0 && (
                  <ListGroupItem>
                    <div className="color-list-container">
                      <h5>Màu sắc</h5>
                      <ul className="list-block d-flex flex-wrap">
                        {uniqueColors.map((item, idx) => (
                          <li
                            key={idx}
                            onClick={() => handleSelectColor(idx, item)}
                            className="color me-2 mb-2"
                            style={{
                              cursor: "pointer",
                              height: "35px",
                              width: "35px",
                              borderRadius: "100%",
                              backgroundColor: item,
                              boxShadow:
                                colorIdx === idx
                                  ? "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset"
                                  : "none",
                              border: colorIdx === idx ? "1px solid whitesmoke" : "none",
                            }}
                          />
                        ))}
                      </ul>
                    </div>
                  </ListGroupItem>
                )}

                {/* Size cho màu đã chọn */}
                {sizesForSelectedColor.length > 0 && (
                  <ListGroupItem>
                    <div className="size-list-container">
                      <h5>Kích cỡ</h5>
                      <ul className="list-block d-flex flex-wrap">
                        {sizesForSelectedColor.map((item, idx) => (
                          <li
                            key={idx}
                            onClick={() => handleSelectSize(idx, item)}
                            className="color me-2 mb-2"
                            style={{
                              cursor: "pointer",
                              border: "1px solid black",
                              padding: "8px",
                              backgroundColor: sizeIdx === idx ? "black" : "white",
                              color: sizeIdx === idx ? "white" : "black",
                            }}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ListGroupItem>
                )}

                {/* Số lượng tồn kho cho lựa chọn */}
                {variantKey && (
                  <ListGroupItem>
                    <div>
                      Tồn kho: <span className="text-muted">{stockForSelection}</span>
                    </div>
                  </ListGroupItem>
                )}

                <ListGroupItem>
                  {product.quantityInStock <= 0 ? (
                    <div>
                      <Button disabled color="dark" className="w-100">
                        Thêm vào giỏ hàng
                      </Button>
                    </div>
                  ) : (
                    <Row>
                      <Col md={2} xs={3}>
                        {variantKey ? (
                          <select
                            id="qtySelect"
                            name="select"
                            style={{ padding: "10px 10px", width: "100%" }}
                            value={quantitySelected}
                            onChange={(e) => handleQtyChange(e.target.value)}
                          >
                            {[...Array(stockForSelection).keys()].map((i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div>Vui lòng chọn màu và kích cỡ</div>
                        )}
                      </Col>
                      <Col md={10} xs={9}>
                        {cartState?.isMutation?.loading ? (
                          <Button color="dark" className="w-100" disabled>
                            <Spinner size={"sm"} />
                          </Button>
                        ) : (
                          <Button
                            color="dark"
                            className="w-100"
                            onClick={handleAddToCart}
                            disabled={isAddToCartDisabled}
                          >
                            Thêm vào giỏ hàng
                          </Button>
                        )}
                      </Col>
                    </Row>
                  )}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>

          <ProductsTabbedSection
            description={product.description}
            productId={product._id}
          />

          <ProductsInSameCategorySection categoryId={product.category?._id} />
        </>
      )}
    </section>
  );
};

export default ProductInfoSection;
