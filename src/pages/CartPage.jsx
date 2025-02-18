import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";

import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const getCart = async () => {
    try {
      await axios.get(`${apiUrl}/v2/api/${apiPath}/cart`).then((res) => {
        setCart(res.data.data);
      });
    } catch (error) {
      alert("取得購物車失敗", `${error}`);
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
    reset,
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
      getCart();
    } catch (error) {
      alert("訂單失敗", `${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);
  return (
    <>
      <div className="container">
        <div className="mt-4">
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
    </>
  );
}
