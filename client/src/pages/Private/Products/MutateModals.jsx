import Multiselect from "multiselect-react-dropdown";
import MultipleValueTextInput from "react-multivalue-text-input";
import {SwatchesPicker} from "react-color";
import {VscSymbolColor} from "react-icons/vsc";
import ImageUploading from "react-images-uploading";
import {AiOutlineCloudUpload} from "react-icons/ai";
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import FormInput from "../../../common/components/Shared/FormInput";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import pushNotification from "../../../common/components/Shared/Notification";
import {
  createProduct,
  updateProduct,
} from "../../../features/products/productsServices";
import useGetNestedSubcategories from "../../../common/hooks/subcategories/useGetNestedSubcategories";





export const CreateProductModal = ({
  modalState,
  toggle,
  ModalHead,
  allCategories,
}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [size, setSize] = useState([]);
  const [colors, setColors] = useState([]);
  const [image, setImage] = useState(null);
  const [sliderImages, setSliderImages] = useState(null);
  const [variantsStock, setVariantsStock] = useState({});

  const { nestedSubcategories } = useGetNestedSubcategories(category);

  // Handle change
  const handleChangeName = (e) => setName(e.target.value);
  const handleChangePrice = (e) => setPrice(e.target.value);
  const handleChangeDiscount = (e) => setDiscount(e.target.value);
  const handleChangeDescription = (e) => setDescription(e.target.value);
  const handleChangeCategory = (e) => setCategory(e.target.value);

  const subcategoriesSelectOptions = {
    options: nestedSubcategories.subcategories,
  };

  const handleSelectSubcategory = (_, selectedItem) => {
    setSubcategories((prevState) => [...prevState, selectedItem._id]);
  };
  const handleRemoveSubcategory = (_, removedItem) => {
    setSubcategories((prevState) =>
      prevState.filter((item) => item !== removedItem._id)
    );
  };

  const handleSize = (item, allItems) => setSize(allItems);

  const [activeColorPalette, setActiveColorPallet] = useState(false);
  const handleSelectColor = (color) => {
    if (!colors.includes(color.hex)) {
      setColors((prevState) => [...prevState, color.hex]);
    }
  };
  const handleRemoveColor = (color) => {
    setColors((prevState) => prevState.filter((item) => item !== color));
  };

  const handleChangeImage = (imageList) => setImage(imageList);
  const handleChangeSliderImages = (imageList) => setSliderImages(imageList);

  const handleCreateProduct = () => {
    if (
      !name ||
      !price ||
      !category ||
      !description ||
      colors.length === 0 ||
      size.length === 0 ||
      !image ||
      image.length < 1
    ) {
      pushNotification("Please fill the main fields");
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price);
    formData.set("discount", discount);
    formData.set("description", description);
    formData.set("category", category);
    const totalQuantity = Object.values(variantsStock).reduce(
    (sum, val) => sum + Number(val || 0),
    0
  );
  formData.set("quantityInStock", totalQuantity);
    // Append subcategories
    subcategories.forEach((el) => formData.append("subcategories[]", el));

    // Build variants array
    const variants = [];
    colors.forEach((color) => {
      size.forEach((sz) => {
        variants.push({
          color,
          size: sz,
          stock: variantsStock[`${color}-${sz}`] || 0,
        });
      });
    });
    formData.append("variants", JSON.stringify(variants));



    // Images
    if (image && image.length > 0) {
      formData.set("image", image[0].file);
    }
    if (sliderImages && sliderImages.length > 0) {
      sliderImages.forEach((el) => formData.append("sliderImages", el.file));
    }

    dispatch(createProduct(formData));
  };
  return (
    <Modal isOpen={modalState} toggle={toggle} centered fullscreen>
      <ModalHeader toggle={toggle}>{ModalHead}</ModalHeader>
      <ModalBody>
        <div className="d-flex flex-column gap-3">
          <Row>
            {/* Name */}
            <Col lg={4} md={6} xs={6}>
              <div className="Input-Item">
                <Label>Tên sản phẩm</Label>
                <FormInput
                  type="text"
                  name="name"
                  placeholder="Tên sản phẩm"
                  handleChange={handleChangeName}
                />
              </div>
            </Col>
            {/* Category */}
            <Col lg={2} md={3} xs={6}>
              <div className="Input-Item">
                <Label>Danh Mục sản phẩm</Label>
                <Input
                  id="category"
                  name="select"
                  type="select"
                  bsSize="sm"
                  onChange={handleChangeCategory}
                  defaultValue=""
                >
                  <option value="" disabled hidden>
                    Chọn danh mục
                  </option>
                  {allCategories.categories?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name.toUpperCase()}
                    </option>
                  ))}
                </Input>
              </div>
            </Col>

            {/* Quantity In Stock
            <Col lg={2} md={3} xs={4}>
              <div className="Input-Item">
                <Label>Số lượng</Label>
                <FormInput
                  type="number"
                  name="quantityInStock"
                  placeholder="Nhập số lượng sản phẩm"
                  handleChange={handleChangeQuantityInStock}
                />
              </div>
            </Col> */}

            {/* Price */}
            <Col lg={2} md={3} xs={4}>
              <div className="Input-Item">
                <Label>Giá bán</Label>
                <FormInput
                  type="number"
                  name="price"
                  placeholder="Nhập giá bán"
                  handleChange={handleChangePrice}
                />
              </div>
            </Col>
            {/* Discount */}
            <Col lg={2} md={3} xs={4}>
              <div className="Input-Item">
                <Label>Giảm giá</Label>
                <FormInput
                  type="number"
                  name="discount"
                  placeholder="Giảm giá"
                  handleChange={handleChangeDiscount}
                />
              </div>
            </Col>
          </Row>

          {/* Description */}
          <Row>
            <Col>
              <div className="Input-Item">
                <Label>Mô tả sản phẩm</Label>
                <Input
                  type="textarea"
                  name="description"
                  placeholder="Nhập mô tả"
                  rows="4"
                  cols="50"
                  onChange={handleChangeDescription}
                />
              </div>
            </Col>
          </Row>

          {/* Subcategories */}
          <div className="Input-Item">
            <Label>Danh mục con</Label>
            <Multiselect
              options={subcategoriesSelectOptions.options} // Options to display in the dropdown
              selectedValues={subcategoriesSelectOptions.selectedValue} // Preselected value to persist in dropdown
              onSelect={handleSelectSubcategory} // Function will trigger on select event
              onRemove={handleRemoveSubcategory} // Function will trigger on remove event
              displayValue="name" // Property name to display in the dropdown options
            />
          </div>

          {/* Sizes */}
          <div className="Input-Item">
            <Label>Sizes</Label>
            <MultipleValueTextInput
              onItemAdded={handleSize}
              onItemDeleted={handleSize}
              className="multiple-select-text-input rounded"
              name="sizes-input"
              placeholder="Nhập Size và nhấn Enter để lưu loại size!"
            />
          </div>

          {/* Colors */}
          <div className="Input-Item">
            <Label>Màu</Label>
            <div className="d-flex flex-wrap gap-3">
              {colors.length > 0 ? (
                colors.map((color, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "100%",
                      border: "1px solid gray",
                      background: color,
                      cursor: "pointer",
                    }}
                    onClick={() => handleRemoveColor(color)}
                  />
                ))
              ) : (
                <span className="text-muted">No Colors Selected Yet !</span>
              )}
              <VscSymbolColor
                size={30}
                onClick={() => setActiveColorPallet(!activeColorPalette)}
              />
              {activeColorPalette && (
                <SwatchesPicker onChangeComplete={handleSelectColor} />
              )}
            </div>
            {/* Variants Table */}
<div className="Input-Item">
  <Label>Số lượng theo từng Size + Màu</Label>
  <table className="table table-bordered">
    <thead>
      <tr>
        <th>Màu</th>
        <th>Size</th>
        <th>Số lượng</th>
      </tr>
    </thead>
    <tbody>
      {colors.map((color) =>
        size.map((sz) => (
          <tr key={`${color}-${sz}`}>
            <td>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  background: color,
                  border: "1px solid #ccc"
                }}
              />
            </td>
            <td>{sz}</td>
            <td>
              <input
                type="number"
                min="0"
                className="form-control"
                value={variantsStock[`${color}-${sz}`] || ""}
                onChange={(e) =>
                  setVariantsStock({
                    ...variantsStock,
                    [`${color}-${sz}`]: parseInt(e.target.value) || 0
                  })
                }
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

          </div>

          <Row>
            {/* image */}
            <Col md={6} xs={12} className="mb-4">
              <div className="Input-Item">
                <Label>
                  Image{" "}
                  <span className="text-muted" style={{fontSize: "12px"}}>
                    (Main image)
                  </span>
                </Label>
                <ImageUploading
                  multiple
                  value={image}
                  onChange={handleChangeImage}
                  maxNumber={1}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                      <div
                        className="d-flex flex-column align-items-center justify-content-center"
                        style={{
                          minHeight: "150px",
                          cursor: "pointer",
                          background: "whitesmoke",
                          boxShadow: isDragging
                            ? "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset"
                            : undefined,
                        }}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        <AiOutlineCloudUpload size={50} />
                        <p>Drag & drop or Click to browse </p>
                      </div>
                      &nbsp;
                      {imageList.map((image, index) => (
                        <div
                          key={index}
                          className="image-item d-flex flex-column align-items-center"
                        >
                          <img
                            src={image["data_url"]}
                            alt=""
                            width={100}
                            height={100}
                          />
                          <div className="image-item__btn-wrapper">
                            <Button
                              size="sm"
                              color="info"
                              onClick={() => onImageUpdate(index)}
                            >
                              Update
                            </Button>
                            <Button
                              size="sm"
                              color="dark"
                              onClick={() => onImageRemove(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ImageUploading>
              </div>
            </Col>

            {/* sliderImages */}
            <Col md={6} xs={12}>
              <div className="Input-Item">
                <Label>
                  Slider Images{" "}
                  <span className="text-muted" style={{fontSize: "12px"}}>
                    (Slider images , Max 3 images)
                  </span>
                </Label>
                <ImageUploading
                  multiple
                  value={sliderImages}
                  onChange={handleChangeSliderImages}
                  maxNumber={3}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    <div className="upload__image-wrapper">
                      <div
                        className="d-flex flex-column align-items-center justify-content-center"
                        style={{
                          minHeight: "150px",
                          cursor: "pointer",
                          background: "whitesmoke",
                          boxShadow: isDragging
                            ? "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset"
                            : undefined,
                        }}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        <AiOutlineCloudUpload size={50} />
                        <p>Drag & drop or Click to browse </p>
                      </div>
                      &nbsp;
                      <div className="d-flex flex-wrap gap-3">
                        {imageList.map((image, index) => (
                          <div
                            key={index}
                            className="image-item d-flex flex-column align-items-center"
                          >
                            <img
                              src={image["data_url"]}
                              alt=""
                              width={100}
                              height={100}
                            />
                            <div className="image-item__btn-wrapper">
                              <Button
                                size="sm"
                                color="info"
                                onClick={() => onImageUpdate(index)}
                              >
                                Update
                              </Button>
                              <Button
                                size="sm"
                                color="dark"
                                onClick={() => onImageRemove(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </ImageUploading>
              </div>
            </Col>
          </Row>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="info"
          onClick={() => {
            handleCreateProduct();
            toggle();
          }}
        >
          Thêm
        </Button>
        <Button color="primary" onClick={toggle}>
          Huỷ
        </Button>
      </ModalFooter>
    </Modal>
  );
};














export const UpdateProductModal = ({
  modalState,
  toggle,
  ModalHead,
  allCategories,
  product,
  setProduct,
}) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  
  const [category, setCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
// mỗi phần tử: { color: string, size: string, stock: number }
  const [variantsStock, setVariantsStock] = useState({});
  // NewImages
  const [image, setImage] = useState(null);
  const [sliderImages, setSliderImages] = useState(null);
  // Current Images
  const [productImage, setProductImage] = useState(null);
  const [productSliderImages, setProductSliderImages] = useState([]);
const [colors, setColors] = useState([]);
const [size, setSize] = useState([]);
const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setDiscount(product.discount);
      setDescription(product.description);
      setCategory(product.category._id);
      setSubcategories(product.subcategories)
      setProductImage(product.image);
      setProductSliderImages(product.sliderImages);

      if(product.variants) {
      const colorsFromVariants = [...new Set(product.variants.map(v => v.color))];
      const sizesFromVariants = [...new Set(product.variants.map(v => v.size))];
      setColors(colorsFromVariants);
      setSize(sizesFromVariants);

      const stockObj = {};
      product.variants.forEach(v => {
        stockObj[`${v.color}-${v.size}`] = v.stock;
      });
      setVariantsStock(stockObj);
      }
    }
  }, [product]);
  




  
   useEffect(() => {
    setVariants(prev => {
      const updatedVariants = [];

      colors.forEach(color => {
        size.forEach(sz => {
          // Tìm variant cũ có combo này không
          const exist = prev.find(v => v.color === color && v.size === sz);
          if (exist) {
            updatedVariants.push(exist);
          } else {
            updatedVariants.push({ color, size: sz, stock: 0 });
          }
        });
      });

      return updatedVariants;
    });
  }, [colors, size]);





  const handleChangeName = (e) => {
    setName(e.target.value);
  };
  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };
  const handleChangeDiscount = (e) => {
    setDiscount(e.target.value);
  };
  const handleChangeDescription = (e) => {
    setDescription(e.target.value);
  };
  // const handleChangeQuantityInStock = (e) => {
  //   setQuantityInStock(e.target.value);
  // };
  const handleChangeCategory = (e) => {
    setCategory(e.target.value);
  };
  const {nestedSubcategories} = useGetNestedSubcategories(category);
  const subcategoriesSelectOptions = {
    options: nestedSubcategories.subcategories,
    selectedValue: subcategories,
  };

  const handleSelectSubcategory = (_, selectedItem) => {
    setSubcategories((prevState) => {
      return [...prevState, selectedItem];
    });
  };
  const handleRemoveSubcategory = (_, removedItem) => {
    setSubcategories((prevState) => {
      return prevState.filter((item) => item._id !== removedItem._id);
    });
  };
  const handleSize = (item, allItems) => {
    setSize(allItems);
    setVariantsStock(prevStock => {
    const newStock = {};
    allItems.forEach(sz => {
      colors.forEach(color => {
        const key = `${color}-${sz}`;

        newStock[key] = prevStock[key] !== undefined ? prevStock[key] : 0;
      });
    });
    return newStock;
  });
  };

  const [activeColorPalette, setActiveColorPallet] = useState(false);
  const handleSelectColor = (color) => {
    if (colors.find((item) => item === color.hex)) return;
    setColors((prevState) => {
    const newColors = [...prevState, color.hex];
    setVariantsStock(prevStock => {
      const newStock = {...prevStock};
      size.forEach(sz => {
        const key = `${color.hex}-${sz}`;
        if (!(key in newStock)) {
          newStock[key] = 0;
        }
      });
      return newStock;
    });
    return newColors;
    });
  };
  const handleRemoveColor = (color) => {
    setColors(prevColors => {
    const updatedColors = prevColors.filter(c => c !== color);

    setVariantsStock(prevStock => {
      const newStock = {};
      size.forEach(sz => {
        updatedColors.forEach(c => {
          const key = `${c}-${sz}`;
          newStock[key] = prevStock[key] !== undefined ? prevStock[key] : 0;
        });
      });
      return newStock;
    });

    
    return updatedColors;
  });
  };

  const handleChangeImage = (imageList, addUpdateIndex) => {
    setImage(imageList);
  };
  const handleChangeSliderImages = (imageList, addUpdateIndex) => {
    setSliderImages(imageList);
  };
  const handleVariantStockChange = (color, size, value) => {
    setVariants(prevVariants => {
      const index = prevVariants.findIndex(v => v.color === color && v.size === size);
      if (index !== -1) {
        const updated = [...prevVariants];
        updated[index] = { ...updated[index], stock: Number(value) };
        return updated;
      } else {
        return [...prevVariants, { color, size, stock: Number(value) }];
      }
    });
  };
  
  const handleUpdateProduct = () => {
    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price);
    formData.set("discount", discount);
    formData.set("description", description);

    const totalQuantity = Object.values(variantsStock).reduce(
    (sum, val) => sum + Number(val || 0), 
    0
  );
    formData.set("quantityInStock", totalQuantity);
    
    formData.set("category", category);

    //Refactor selected subcategories to get form ["_id1", "_id2", ...]
    if (subcategories.length > 0) {
      const subIds = subcategories.map((item) => item._id);
      subIds.map((el) => formData.append("subcategories[]", el));
    }

    const variants = [];
    colors.forEach((color) => {
      size.forEach((sz) => {
        variants.push({
          color,
          size: sz,
          stock: variantsStock[`${color}-${sz}`] || 0,
        });
      });
    });
    formData.append("variants", JSON.stringify(variants));
   
   
    if (image && image.length > 0) {
      formData.set("image", image[0].file);
    }
    if (sliderImages && sliderImages.length > 0) {
      sliderImages.map((el) => formData.append("sliderImages", el.file));
    }
    dispatch(updateProduct({productId: product._id, body: formData}));
    setImage(null);
    setSliderImages(null);
    //RESET_PRODUCT_STATE
    setProduct(null);
  };

  return (
    <Modal isOpen={modalState} toggle={toggle} centered fullscreen>
      <ModalHeader toggle={toggle}>{ModalHead}</ModalHeader>
      <ModalBody>
        <div className="d-flex flex-column gap-3">
          <Row>
            {/* Name */}
            <Col lg={4} md={6} xs={6}>
              <div className="Input-Item">
                <Label>Tên sản phẩm</Label>
                <FormInput
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  handleChange={handleChangeName}
                />
              </div>
            </Col>
            {/* Category */}
            <Col lg={2} md={3} xs={6}>
              <div className="Input-Item">
                <Label>Danh mục</Label>
                <Input
                  id="category"
                  name="select"
                  type="select"
                  bsSize="sm"
                  value={category}
                  onChange={handleChangeCategory}
                >
                  <option value="">Select Category</option>
                  {allCategories.categories?.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name.toUpperCase()}
                    </option>
                  ))}
                </Input>
              </div>
            </Col>
            {/* Quantity In Stock */}
            {/* <Col lg={2} md={3} xs={4}>
              <div className="Input-Item">
                <Label>Quantity</Label>
                <FormInput
                  type="number"
                  name="quantityInStock"
                  placeholder="Quantity In Stock"
                  value={quantityInStock}
                  handleChange={handleChangeQuantityInStock}
                />
              </div>
            </Col> */}
            {/* Price */}
            <Col lg={2} md={3} xs={4}>
              <div className="Input-Item">
                <Label>Price</Label>
                <FormInput
                  type="number"
                  name="price"
                  value={price}
                  placeholder="Price"
                  handleChange={handleChangePrice}
                />
              </div>
            </Col>
            {/* Discount */}
            <Col lg={2} md={3} xs={4}>
              <div className="Input-Item">
                <Label>Discount</Label>
                <FormInput
                  type="number"
                  name="discount"
                  value={discount}
                  placeholder="Discount"
                  handleChange={handleChangeDiscount}
                />
              </div>
            </Col>
          </Row>
          {/* Description */}
          <Row>
            <Col>
              <div className="Input-Item">
                <Label>Description</Label>
                <Input
                  type="textarea"
                  name="description"
                  value={description}
                  placeholder="Description"
                  rows="4"
                  cols="50"
                  onChange={handleChangeDescription}
                />
              </div>
            </Col>
          </Row>

          {/* Subcategories */}
          <div className="Input-Item">
            <Label>Subcategories</Label>
            <Multiselect
              options={subcategoriesSelectOptions.options} // Options to display in the dropdown
              selectedValues={subcategoriesSelectOptions.selectedValue} // Preselected value to persist in dropdown
              onSelect={handleSelectSubcategory} // Function will trigger on select event
              onRemove={handleRemoveSubcategory} // Function will trigger on remove event
              displayValue="name" // Property name to display in the dropdown options
            />
          </div>

          {/* Sizes */}
          <div className="Input-Item">
            <Label>Sizes</Label>
            <MultipleValueTextInput
              values={size}
              onItemAdded={handleSize}
              onItemDeleted={handleSize}
              className="multiple-select-text-input rounded"
              name="item-input"
              placeholder="Enter whatever sizes you want; separate them with COMMA or ENTER"
            />
          </div>

          {/* Colors */}
          <div className="Input-Item">
            <Label>Màu</Label>
            <div className="d-flex flex-wrap gap-3">
              {colors?.length > 0 ? (
                colors.map((color, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "100%",
                      border: "1px solid gray",
                      background: color,
                      cursor: "pointer",
                    }}
                    onClick={() => handleRemoveColor(color)}
                  />
                ))
              ) : (
                <span className="text-muted">No Colors Selected Yet !</span>
              )}
              <VscSymbolColor
                size={30}
                onClick={() => setActiveColorPallet(!activeColorPalette)}
              />
              {activeColorPalette && (
                <SwatchesPicker onChangeComplete={handleSelectColor} />
              )}
            </div>
            






              {/* Variants Table */}
<div className="Input-Item">
  <Label>Số lượng theo từng Size + Màu</Label>
  <table className="table table-bordered">
    <thead>
      <tr>
        <th>Màu</th>
        <th>Size</th>
        <th>Số lượng</th>
      </tr>
    </thead>
    <tbody>
      {colors.map(color =>
  size.map(sz => (
    <tr key={`${color}-${sz}`}>
      <td><div style={{width:"20px", height:"20px", background: color, border:"1px solid #ccc"}}/></td>
      <td>{sz}</td>
      <td>
        <input
          type="number"
          min="0"
          className="form-control"
          value={variantsStock[`${color}-${sz}`] || ""}
          onChange={e => {
            setVariantsStock({
              ...variantsStock,
              [`${color}-${sz}`]: parseInt(e.target.value) || 0
            });
          }}
              />
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

          </div>

          <Row>
            {/* image */}
            <Col md={6} xs={12} className="mb-4">
              <div className="Input-Item">
                <Label>
                  Image{" "}
                  <span className="text-muted" style={{fontSize: "12px"}}>
                    (Main image)
                  </span>
                </Label>
                <ImageUploading
                  multiple
                  value={image}
                  onChange={handleChangeImage}
                  maxNumber={1}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                      <div
                        className="d-flex flex-column align-items-center justify-content-center"
                        style={{
                          minHeight: "150px",
                          cursor: "pointer",
                          background: "whitesmoke",
                          boxShadow: isDragging
                            ? "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset"
                            : undefined,
                        }}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        <AiOutlineCloudUpload size={50} />
                        <p>Drag & drop or Click to browse </p>
                      </div>
                      &nbsp;
                      {imageList.map((image, index) => (
                        <div
                          key={index}
                          className="image-item d-flex flex-column align-items-center"
                        >
                          <img
                            src={image["data_url"]}
                            alt=""
                            width={100}
                            height={100}
                          />
                          <div className="image-item__btn-wrapper">
                            <Button
                              size="sm"
                              color="info"
                              onClick={() => onImageUpdate(index)}
                            >
                              Update
                            </Button>
                            <Button
                              size="sm"
                              color="dark"
                              onClick={() => onImageRemove(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                      <h6 className="text-muted my-2">
                        The Current Main Image
                      </h6>
                      <div className="old-main-img">
                        <img
                          src={productImage}
                          alt="product-img"
                          width={100}
                          height={100}
                          className="rounded"
                        />
                      </div>
                    </div>
                  )}
                </ImageUploading>
              </div>
            </Col>

            {/* sliderImages */}
            <Col md={6} xs={12}>
              <div className="Input-Item">
                <Label>
                  Slider Images{" "}
                  <span className="text-muted" style={{fontSize: "12px"}}>
                    (Slider images , Max 3 images)
                  </span>
                </Label>
                <ImageUploading
                  multiple
                  value={sliderImages}
                  onChange={handleChangeSliderImages}
                  maxNumber={3}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    <div className="upload__image-wrapper">
                      <div
                        className="d-flex flex-column align-items-center justify-content-center"
                        style={{
                          minHeight: "150px",
                          cursor: "pointer",
                          background: "whitesmoke",
                          boxShadow: isDragging
                            ? "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset"
                            : undefined,
                        }}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        <AiOutlineCloudUpload size={50} />
                        <p>Drag & drop or Click to browse </p>
                      </div>
                      &nbsp;
                      <div className="d-flex flex-wrap gap-3">
                        {imageList.map((image, index) => (
                          <div
                            key={index}
                            className="image-item d-flex flex-column align-items-center"
                          >
                            <img
                              src={image["data_url"]}
                              alt=""
                              width={100}
                              height={100}
                            />
                            <div className="image-item__btn-wrapper">
                              <Button
                                size="sm"
                                color="info"
                                onClick={() => onImageUpdate(index)}
                              >
                                Update
                              </Button>
                              <Button
                                size="sm"
                                color="dark"
                                onClick={() => onImageRemove(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </ImageUploading>

                {/* _________________________ */}
                {productSliderImages && productSliderImages.length > 0 && (
                  <>
                    <h6 className="text-muted">The Current Slider Images</h6>
                    <div className="old-main-img d-flex gap-3">
                      {productSliderImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="product-img"
                          width={100}
                          height={100}
                          className="rounded"
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="info"
          onClick={() => {
            handleUpdateProduct();
            toggle();
          }}
        >
          Cập nhật
        </Button>
        <Button color="primary" onClick={toggle}>
          Huỷ
        </Button>
      </ModalFooter>
    </Modal>
  );
};
