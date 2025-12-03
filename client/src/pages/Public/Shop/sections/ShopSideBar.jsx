import React, {useState} from "react";
import CollapseItem from "../../../../common/components/Shared/CollapseItem";
import RangeSlider from "react-bootstrap-range-slider";
import {Alert, Button, Form, Input} from "reactstrap";
import {starsSettings} from "../helpers.js";
import ReactStars from "react-rating-stars-component";
import useGetCategories from "../../../../common/hooks/categories/useGetCategories";

const ShopSideBar = ({
  handleRate,
  handlePrice,
  handleSearch,
  handleCategory,
}) => {
  // Lấy danh mục
  const {allCategories} = useGetCategories();

  // Trạng thái đóng/mở từng mục
  const [categoryIsOpen, setCategoryIsOpen] = useState(false);
  const toggleCategory = () => setCategoryIsOpen(!categoryIsOpen);

  const [priceIsOpen, setPriceIsOpen] = useState(false);
  const togglePrice = () => setPriceIsOpen(!priceIsOpen);

  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const toggleSearch = () => setSearchIsOpen(!searchIsOpen);

  const [ratingIsOpen, setRatingIsOpen] = useState(false);
  const toggleRating = () => setRatingIsOpen(!ratingIsOpen);

  // Giá
  const [priceVal, setPriceVal] = useState(0);

  // Tìm kiếm
  const [searchVal, setSearchVal] = useState("");
  const handleSubmitSearch = (e) => {
    e.preventDefault();
    handleSearch(searchVal);
  };

  return (
    <aside className="bg-light rounded p-2">
      {/* Lọc theo giá */}
      <CollapseItem head={"Giá"} toggle={togglePrice} isOpen={priceIsOpen}>
        <RangeSlider
          value={priceVal}
          onChange={(e) => setPriceVal(e.target.value)}
          onAfterChange={(e) => handlePrice(e.target.value)}
          min={0}
          max={4000}
          tooltip="on"
          tooltipLabel={(currentValue) => `${currentValue} $`}
          tooltipPlacement="top"
          step={50}
        />
      </CollapseItem>

      {/* Lọc theo danh mục */}
      <CollapseItem
        head={"Danh mục"}
        toggle={toggleCategory}
        isOpen={categoryIsOpen}
      >
        {allCategories?.error ? (
          <Alert color="danger">{allCategories?.error}</Alert>
        ) : (
          allCategories?.categories.map((item, idx) => (
            <div className="d-flex mb-2" key={idx}>
              <input
                onChange={(e) => handleCategory(e)}
                type="checkbox"
                value={item._id}
              />
              <div
                className="filter-cat ms-2"
                style={{textTransform: "capitalize"}}
              >
                {item.name}
              </div>
            </div>
          ))
        )}
      </CollapseItem>

      {/* Lọc theo đánh giá sao */}
      <CollapseItem head={"Đánh giá"} toggle={toggleRating} isOpen={ratingIsOpen}>
        <div className="d-flex mb-2">
          <input
            onChange={(e) => handleRate(e.target.value)}
            type="radio"
            id={"all"}
            value={"all"}
            name="rating"
          />
          <div className="ms-2">
            <span>Tất cả</span>
          </div>
        </div>
        {starsSettings.map((setting, idx) => (
          <div className="d-flex mb-2" key={idx}>
            <input
              onChange={(e) => handleRate(e.target.value)}
              type="radio"
              id={setting.value}
              value={setting.value}
              name="rating"
            />
            <div className="ms-2 d-flex align-items-center">
              <ReactStars {...setting} />
              <span className="text-muted" style={{fontSize: "13px"}}>
                ({setting.value - 1}&#8594;{setting.value} sao)
              </span>
            </div>
          </div>
        ))}
      </CollapseItem>

      {/* Tìm kiếm */}
      <CollapseItem head={"Tìm kiếm"} toggle={toggleSearch} isOpen={searchIsOpen}>
        <Form onSubmit={handleSubmitSearch}>
          <Input
            id="search"
            name="search"
            placeholder="Tìm kiếm sản phẩm..."
            type="search"
            bsSize="sm"
            className="mb-2"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <Button size="sm" color="dark" type="submit" block>
            Tìm kiếm
          </Button>
        </Form>
      </CollapseItem>
    </aside>
  );
};

export default ShopSideBar;
