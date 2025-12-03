import React, { useState } from "react";
import {
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../../assets/imgs/dark-logo.png";
import { Nav, NavLinks, IconLinks } from "./styles";
import { BsPersonFill } from "react-icons/bs";
import { TfiMenu } from "react-icons/tfi";
import { MdOutlineClose } from "react-icons/md";
import BadgedCartIcon from "../../common/components/Icons/BadgedCartIcon";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";
import useUserCart from "../../common/hooks/cart/useUserCart";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const { userProfile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userCart } = useUserCart();

  const isAdmin = userProfile?.user?.role === "admin";

  return (
    <header className="bg-light">
      <Container>
        <div className="navbar py-2">
          {/* Logo */}
          <LinkContainer style={{ cursor: "pointer" }} to={isAdmin ? "/admin/orders" : "/"}>
            <img src={logo} alt="Logo" width={50} height={50} />
          </LinkContainer>

          {/* Navbar */}
          <Nav>
            <NavLinks isOpen={isOpen}>
              {!isAdmin && ( // Chỉ hiển thị khi KHÔNG phải admin
                <>
                  {[
                    { label: "Trang chủ", to: "/" },
                    { label: "Cửa hàng", to: "/shop" },
                    { label: "Danh mục", to: "/categories" },
                  ].map((el, idx) => (
                    <NavItem key={idx} toggle={toggle}>
                      <NavLink className={"nav-link"} to={el.to}>
                        {el.label}
                      </NavLink>
                    </NavItem>
                  ))}
                </>
              )}
              <span className="d-block d-md-none bg-light p-2 rounded-circle">
                <MdOutlineClose onClick={toggle} size={25} />
              </span>
            </NavLinks>
            <IconLinks>
              {!isAdmin && ( // Ẩn giỏ hàng cho admin
                <li>
                  <NavLink className={"nav-link"} to={"/cart"}>
                    <BadgedCartIcon
                      numOfItems={userCart?.cart?.cartItems?.length}
                    />
                  </NavLink>
                </li>
              )}
              {!userProfile.loading &&
                (userProfile.user ? (
                  <li>
                    <UncontrolledDropdown>
                      <DropdownToggle
                        className="p-0 bg-secondary"
                        color="light"
                      >
                        <img
                          src={userProfile?.user?.image}
                          alt="user-img"
                          width={40}
                          className="rounded-circle"
                        />
                      </DropdownToggle>
                      <DropdownMenu>
                        {!isAdmin && (
                          <DropdownItem onClick={() => navigate("/profile")}>
                            Hồ sơ
                          </DropdownItem>
                        )}
                        {isAdmin && (
                          <>
                            <DropdownItem onClick={() => navigate("/admin/orders")}>
                              Quản trị
                            </DropdownItem>
                          </>
                        )}
                        <DropdownItem divider />
                        <DropdownItem onClick={() => dispatch(logout())}>
                          Đăng xuất
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </li>
                ) : (
                  <li>
                    <NavLink className={"nav-link"} to={"/login"}>
                      <BsPersonFill title="Đăng nhập" />
                    </NavLink>
                  </li>
                ))}
              {!isAdmin && (
                <li
                  className="d-block d-md-none bg-light p-2 rounded-circle"
                  style={{ cursor: "pointer" }}
                  onClick={toggle}
                >
                  <TfiMenu />
                </li>
              )}
            </IconLinks>
          </Nav>
        </div>
      </Container>
    </header>
  );
};

export default Header;

function NavItem({ toggle, children }) {
  return <li onClick={toggle}>{children}</li>;
}
