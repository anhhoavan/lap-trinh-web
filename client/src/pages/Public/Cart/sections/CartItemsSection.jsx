import React, {useState} from "react";
import OverlayLoader from "../../../../common/components/Loaders/OverlayLoader";
import useUserCart from "../../../../common/hooks/cart/useUserCart";
import {Col, Row, Button, Alert, Input, Form} from "reactstrap";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import CartItemCard from "../../../../common/components/Cards/CartItemCard";
import {Link} from "react-router-dom";
import {applyCoupon, clearCart} from "../../../../features/cart/cartServices";
import pushNotification from "../../../../common/components/Shared/Notification";

const CartItemsSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {userCart, isMutation} = useUserCart();

  const [couponCode, setCouponCode] = useState("");
  const [productId, setProductId] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode || !productId) {
      pushNotification("Vui lòng nhập mã giảm giá và mã sản phẩm", "error");
    } else {
      dispatch(applyCoupon({productId, couponCode}));
    }
    setCouponCode("");
    setProductId("");
  };

  return (
    <>
      <OverlayLoader active={isMutation?.loading} />
      <section className="cart-items-section">
        {userCart.loading || userCart.cart?.cartItems?.length > 0 ? (
          <>
            {/* CartHead */}
            {userCart.cart?.cartItems?.length > 0 && (
              <>
                <Row xs={5} className="my-4 bg-light">
                  {["Hình ảnh", "Tên sản phẩm", "Màu sắc / Size", "Số lượng", "Giá"].map(
                    (item, idx) => (
                      <Col className="text-center py-3" key={idx}>
                        <h6 className="m-0" style={{letterSpacing: "0.5px"}}>
                          {item}
                        </h6>
                      </Col>
                    )
                  )}
                </Row>

                {/* CartItems */}
                {userCart.cart?.cartItems?.map((item, idx) => (
                  <CartItemCard item={item} key={idx} />
                ))}
              </>
            )}

            {/* ApplyCoupon & TotalPrice */}
            {userCart.cart?.totalPrice > 0 && (
              <Row md={2} xs={1} className="my-4">
                <Col>
                  <h3 className="mb-3">Áp dụng mã giảm giá</h3>
                  <Form className="d-flex flex-column gap-3" onSubmit={handleApplyCoupon}>
                    <Input
                      type="text"
                      placeholder="Nhập mã sản phẩm"
                      onChange={(e) => setProductId(e.target.value)}
                      value={productId}
                      bsSize="sm"
                    />
                    <Input
                      type="text"
                      placeholder="Nhập mã giảm giá"
                      onChange={(e) => setCouponCode(e.target.value)}
                      value={couponCode}
                      bsSize="sm"
                    />
                    <Button type="submit" color="info" size="sm">
                      Áp dụng
                    </Button>
                  </Form>
                </Col>
                <Col>
                  <div className="bg-light p-3 rounded d-flex flex-column gap-3">
                    {/* TotalPrice */}
                    <p
                      style={{
                        fontFamily: "sans-serif",
                        textDecoration: userCart.cart?.totalPriceAfterCouponDiscount
                          ? "line-through"
                          : "none",
                        color: userCart.cart?.totalPriceAfterCouponDiscount
                          ? "gray"
                          : "black",
                      }}
                    >
                      Tổng tạm tính: $ {userCart.cart?.totalPrice}
                    </p>

                    {userCart.cart?.totalPriceAfterCouponDiscount > 0 && (
                      <p style={{color: "red", fontFamily: "sans-serif"}}>
                        Tổng sau giảm giá: ${" "}
                        {userCart.cart?.totalPriceAfterCouponDiscount}
                      </p>
                    )}

                    {/* Checkout */}
                    <Button
                      block
                      size="sm"
                      color="dark"
                      onClick={() => navigate("/checkout")}
                    >
                      Thanh toán
                    </Button>
                    <Button
                      block
                      size="sm"
                      color="primary"
                      onClick={() => navigate("/shop")}
                    >
                      Tiếp tục mua sắm
                    </Button>

                    {/* ClearCart */}
                    <Button
                      block
                      size="sm"
                      color="danger"
                      onClick={() => dispatch(clearCart())}
                    >
                      Xóa giỏ hàng
                    </Button>
                  </div>
                </Col>
              </Row>
            )}
          </>
        ) : (
          <Alert color="info">
            Giỏ hàng của bạn đang trống, <Link to={"/shop"}>tiếp tục mua sắm</Link>
          </Alert>
        )}
      </section>
    </>
  );
};

export default CartItemsSection;
