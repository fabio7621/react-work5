import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [smallIsLoading, setSmallLoading] = useState(false);
  //加入購物車
  const addToCart = async (product_id, qty) => {
    setSmallLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/v2/api/${apiPath}/cart`, {
        data: { product_id, qty: Number(qty) },
      });

      setSmallLoading(false);
    } catch (error) {
      alert("加入購物車失敗", `${error}`);
    }
  };

  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/v2/api/${apiPath}/products`);
      setProducts(res.data.products);
    } catch (error) {
      alert("取得產品失敗", `${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <>
      <div className="container">
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
                    <Link to={`/products/${item.id}`} className="btn btn-outline-secondary">
                      查看更多
                    </Link>
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
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </>
  );
}
