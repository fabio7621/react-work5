import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";

import axios from "axios";
import { Modal } from "bootstrap";

import "./App.css";

const apiUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function App() {
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState([]);
  const [cart, setCart] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const [smallIsLoading, setSmallLoading] = useState(false);

  const getCart = async () => {
    try {
      await axios.get(`${apiUrl}/v2/api/${apiPath}/cart`).then((res) => {
        setCart(res.data.data);
      });
    } catch (error) {
      alert("取得購物車失敗", `${error}`);
    }
  };

  //數量
  const [qtySelect, setQtySelect] = useState(1);
  //model
  const prodModel = useRef(null);
  const productRef = useRef(null);

  const openProductModal = () => prodModel.current.show();
  const closeProductModal = () => prodModel.current.hide();
  useEffect(() => {
    prodModel.current = new Modal(productRef.current);
  }, []);

  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/v2/api/${apiPath}/products`);
      setProducts(res.data.products);
      setLoading(false);
    } catch (error) {
      alert("取得產品失敗", `${error}`);
    }
  };

  //詳細
  const wtachMore = (product) => {
    setTempProduct(product);
    openProductModal();
  };
  //加入購物車
  const addToCart = async (product_id, qty) => {
    setSmallLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/v2/api/${apiPath}/cart`, {
        data: { product_id, qty: Number(qty) },
      });
      setQtySelect(1);
      getCart();
      setSmallLoading(false);
    } catch (error) {
      alert("加入購物車失敗", `${error}`);
    }
  };
  //清除全部
  const removeCart = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`${apiUrl}/v2/api/${apiPath}/carts`);

      getCart();
    } catch (error) {
      alert("清除清除購物車失敗", `${error}`);
    } finally {
      setLoading(false);
    }
  };
  //單項刪除
  const removeCartItem = async (id) => {
    setLoading(true);
    try {
      const res = await axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${id}`);
      getCart();
      setLoading(false);
    } catch (error) {
      alert("刪除購物車單項失敗", `${error}`);
    }
  };
  //更新購物車
  const updateCart = async (cart_Id, product_id, qty) => {
    setLoading(true);
    try {
      const res = await axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${cart_Id}`, {
        data: { product_id, qty: Number(qty) },
      });
      getCart();
    } catch (error) {
      alert("更新購物車失敗", `${error}`);
    } finally {
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    const { message, ...user } = data;
    const userData = { data: { user, message } };
    checkout(userData);
  });

  const checkout = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/v2/api/${apiPath}/order`, data);
      reset();
      setLoading(false);
    } catch (error) {
      alert("訂單失敗", `${error}`);
    }
  };

  useEffect(() => {
    getProducts();
    getCart();
  }, []);

  return (
    <div id="app">
      <div className="container">
        <div className="mt-4">
          {/* 產品Modal */}
          <div ref={productRef} style={{ backgroundColor: "rgba(0,0,0,0.5)" }} className="modal fade" id="productModal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title fs-5">產品名稱：{tempProduct.title}</h2>
                  <button onClick={closeProductModal} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <img src={tempProduct.imageUrl} alt={tempProduct.title} className="img-fluid" />
                  <p>內容：{tempProduct.content}</p>
                  <p>描述：{tempProduct.description}</p>
                  <p>
                    價錢：{tempProduct.price} <del>{tempProduct.origin_price}</del> 元
                  </p>
                  <div className="input-group align-items-center">
                    <label htmlFor="qtySelect">數量：</label>
                    <select value={qtySelect} onChange={(e) => setQtySelect(e.target.value)} id="qtySelect" className="form-select">
                      {Array.from({ length: 10 }).map((_, index) => (
                        <option key={index} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    disabled={smallIsLoading}
                    onClick={() => addToCart(tempProduct.id, qtySelect)}
                    type="button"
                    className="btn btn-primary d-flex align-items-center"
                  >
                    加入購物車
                    {smallIsLoading && (
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <table className="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.title}>
                  <td style={{ width: "200px" }}>
                    <div
                      style={{
                        height: "100px",
                        backgroundImage: `url(${item.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  </td>
                  <td>{item.title}</td>
                  <td>
                    <div className="h5">{item.price}</div>
                    <del className="h6">{item.origin_price}</del>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button onClick={() => wtachMore(item)} type="button" className="btn btn-outline-secondary">
                        查看更多
                      </button>
                      <button
                        onClick={() => {
                          addToCart(item.id, 1);
                        }}
                        type="button"
                        className="btn btn-outline-danger"
                        disabled={smallIsLoading}
                      >
                        加到購物車
                        {smallIsLoading && (
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span class="visually-hidden">Loading...</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {cart.carts?.length > 0 && (
            <div>
              <div className="text-end">
                <button onClick={() => removeCart()} className="btn btn-outline-danger" type="button">
                  清空購物車
                </button>
              </div>
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th></th>
                    <th>品名</th>
                    <th style={{ width: "150px" }}>數量/單位</th>
                    <th>單價</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.carts?.map((cartItem) => (
                    <tr key={cartItem.id}>
                      <td>
                        <button onClick={() => removeCartItem(cartItem.id)} type="button" className="btn btn-outline-danger btn-sm">
                          x
                        </button>
                      </td>
                      <td>{cartItem.product.title}</td>
                      <td style={{ width: "150px" }}>
                        <div className="d-flex align-items-center">
                          <div className="btn-group me-2" role="group">
                            <button
                              onClick={() => updateCart(cartItem.id, cartItem.product_id, cartItem.qty - 1)}
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                              disabled={cartItem.qty === 1}
                            >
                              -
                            </button>
                            <span className="btn border border-dark" style={{ width: "50px", cursor: "auto" }}>
                              {cartItem.qty}
                            </span>
                            <button
                              onClick={() => updateCart(cartItem.id, cartItem.product_id, cartItem.qty + 1)}
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                            >
                              +
                            </button>
                          </div>
                          <span className="input-group-text bg-transparent border-0">{cartItem.product.unit}</span>
                        </div>
                      </td>
                      <td className="text-end">{cartItem.total}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end">
                      總計
                    </td>
                    <td className="text-end">{cart.total}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="text-end text-success">
                      折扣價
                    </td>
                    <td className="text-end text-success"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
        <div className="my-5 row justify-content-center">
          <form onSubmit={onSubmit} className="col-md-6">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                {...register("email", {
                  required: "email必填",
                  pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "格式錯誤" },
                })}
                id="email"
                type="email"
                className={`form-control ${errors.email && "is-invalid"}`}
                placeholder="請輸入 Email"
              />
              {errors.email && <p className="text-danger my-2">{errors.email?.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                收件人姓名
              </label>
              <input
                {...register("name", {
                  required: " 請輸入姓名",
                })}
                id="name"
                type="text"
                className={`form-control ${errors.name && "is-invalid"}`}
                placeholder="請輸入姓名"
              />
              {errors.name && <p className="text-danger my-2">{errors.name?.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">
                收件人電話
              </label>
              <input
                {...register("tel", {
                  required: "電話必填",
                  pattern: {
                    value: /^(0[2-8]\d{7}|09\d{8})$/,
                    message: "格式錯誤，請輸入正確的電話號碼",
                  },
                })}
                id="tel"
                type="tel"
                className={`form-control ${errors.tel && "is-invalid"}`}
                placeholder="請輸入電話"
              />
              {errors.tel && <p className="text-danger my-2">{errors.tel?.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                收件人地址
              </label>
              <input
                {...register("address", {
                  required: " 請輸入地址",
                })}
                id="address"
                type="text"
                className="form-control"
                placeholder="請輸入地址"
              />
              {errors.address && <p className="text-danger my-2">{errors.address?.message}</p>}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">
                留言
              </label>
              <textarea {...register("message")} id="message" className="form-control" cols="30" rows="10"></textarea>
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">
                送出訂單
              </button>
            </div>
          </form>
        </div>
      </div>
      {isLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.3)",
            zIndex: 999,
          }}
        >
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
    </div>
  );
}

export default App;
