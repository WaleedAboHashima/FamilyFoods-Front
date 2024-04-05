import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllSr } from "../../../apis/Accountant/GetAllSr";
import { useState } from "react";
import { fetchAllProducts } from "../../../apis/Products/AllProducts";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { fetchAddSROrder } from "../../../apis/Orders/AddSrOrders";
function Addsrorder() {
  const [SR, setSR] = useState();
  const dispatch = useDispatch();
  const [selectedSr, setSelectedSr] = useState(0);
  const [products, setProducts] = useState();
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const handleSubmit = () => {
    const finalproducts = [];
    cart.forEach((item) => {
      const products = {
        product: item._id,
        SRQuantity: quantity,
        totalPrice: quantity * item.price,
      };
      finalproducts.push(products);
    });
    dispatch(fetchAddSROrder({ _id: selectedSr, products: finalproducts })).then((res) => {
      if (res.payload) {
        if (res.payload === 201) {
          window.location.pathname = '/srorders'
        }
      }
    })
  };
  useEffect(() => {
    dispatch(fetchAllSr()).then((res) => {
      if (res.payload.data) {
        setSR(res.payload.data.SRs);
      }
    });
    dispatch(fetchAllProducts()).then((res) => {
      if (res.payload.data) {
        if (cart.length === 0) {
          setProducts(res.payload.data.Products);
        } else {
          const products = res.payload.data.Products;
          setProducts(products.filter((product) => cart.includes(product._id)));
        }
      }
    });
  }, [dispatch]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) {
      if (source.droppableId === "products") {
        const newProducts = [...products];
        const [removed] = newProducts.splice(source.index, 1);
        newProducts.splice(destination.index, 0, removed);
        setProducts(newProducts);
      } else {
        const newCart = [...cart];
        const [removed] = newCart.splice(source.index, 1);
        newCart.splice(destination.index, 0, removed);
        setCart(newCart);
      }
    } else {
      if (source.droppableId === "products") {
        const newProducts = [...products];
        const [removed] = newProducts.splice(source.index, 1);
        setProducts(newProducts);
        setCart((prevCart) => [...prevCart, removed]);
      } else {
        const newCart = [...cart];
        const [removed] = newCart.splice(source.index, 1);
        setCart(newCart);
        setProducts((prevProducts) => {
          const productIndex = prevProducts.findIndex(
            (product) => product._id === removed._id
          );
          if (productIndex > -1) {
            return prevProducts;
          } else {
            return [...prevProducts, removed];
          }
        });
      }
    }
  };

  return (
    <Box>
      <Select
        value={selectedSr}
        fullWidth
        onChange={(e) => setSelectedSr(e.target.value)}
      >
        <MenuItem disabled value={0}>
          Please Select a SR.
        </MenuItem>
        {SR &&
          SR.map((sr) => (
            <MenuItem key={sr._id} value={sr._id}>
              {sr.username}
            </MenuItem>
          ))}
      </Select>
      {selectedSr ? (
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          gap={5}
          height={"60vh"}
          p={2}
        >
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="products">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    border: "2px solid green",
                    borderRadius: 2,
                    height: "100%",
                    p: 2,
                    overflowY: "scroll",
                    width: "50%",
                  }}
                >
                  {products &&
                    products.map((product, index) => (
                      <Draggable
                        key={product._id}
                        draggableId={product._id.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              cursor: "grab",
                              backgroundColor: snapshot.isDragging
                                ? "#d5d5d580"
                                : "white",
                              borderRadius: 2,
                              p: 1,
                              border: "1px solid black",
                              color: "black",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <img
                              width={"60px"}
                              height={"60px"}
                              src={product.img}
                            />
                            <Box
                              display={"flex"}
                              alignItems={"center"}
                              justifyContent={"space-evenly"}
                              width={"100%"}
                            >
                              <Typography>Name : {product.name}</Typography>
                              <Typography>Price : {product.price}</Typography>
                              <Typography>
                                Quantity : {product.quantity}
                              </Typography>
                              <Typography>Weight : {product.weight}</Typography>
                            </Box>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
            <Droppable droppableId="cart">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    border: "2px solid green",
                    borderRadius: 2,
                    height: "100%",
                    p: 2,
                    overflowY: "scroll",
                    width: "50%",
                  }}
                >
                  {cart.map((product, index) => (
                    <Draggable
                      key={product._id}
                      draggableId={product._id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            cursor: "grab",
                            backgroundColor: snapshot.isDragging
                              ? "#d5d5d580"
                              : "white",
                            borderRadius: 2,
                            p: 1,
                            border: "1px solid black",
                            color: "black",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <img
                            width={"60px"}
                            height={"60px"}
                            src={product.img}
                          />
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"space-evenly"}
                            width={"100%"}
                          >
                            <Typography>Name : {product.name}</Typography>
                            <Typography>Price : {product.price}</Typography>
                            <Typography>
                              Quantity : {product.quantity}
                            </Typography>
                            <Typography>Weight : {product.weight}</Typography>
                            <Box
                              display={"flex"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              width={"30%"}
                              gap={0.5}
                            >
                              <IconButton onClick={() => setQuantity(quantity - 1)} sx={{ background: "black", ':hover' : {backgroundColor: '#00000090'} }} size={'small'}>
                                <RemoveIcon />
                              </IconButton>
                              <TextField
                                focused
                                variant="outlined"
                                type="number"
                                value={quantity}
                                sx={{
                                  "& input[type=number]": {
                                    "MozAppearance": "textfield",
                                    "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button":
                                      {
                                        "WebkitAppearance": "none",
                                        margin: 0,
                                    },
                                    textAlign: 'center',
                                    color: 'black',
                                    width: '100%'
                                  },
                                }}
                                onChange={(e) => setQuantity(e.target.value)}
                              />
                              <IconButton onClick={() => setQuantity(quantity + 1)} sx={{ background: "black", ':hover' : {backgroundColor: '#00000090'} }} size={'small'}>
                                <AddIcon />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Box>
      ) : null}
      {cart.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </Box>
      )}
    </Box>
  );
}
export default Addsrorder;
