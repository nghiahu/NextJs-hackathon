"use client";
import { baseURL } from "@/api/baseURL";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export interface ProductType {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const Home = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [product, setProduct] = useState<ProductType>({
    id: 0,
    name: "",
    price: 0,
    image: "",
    quantity: 0,
  });
  const [isEdit, setIsEdit] = useState(false);

  const resetInput = () =>
    setProduct({
      id: 0,
      name: "",
      price: 0,
      image: "",
      quantity: 0,
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEdit) {
      handleEdit();
    } else {
      const newProduct = { ...product, id: products.length };
      try {
        const response = await baseURL.post("/api/products", newProduct);
        setProducts((prev) => [...prev, response.data]);
        resetInput();
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  const handleEdit = async () => {
    if (!product.name || !product.price || !product.image || !product.quantity) {
      return;
    }

    try {
      const response = await baseURL.put(
        `/api/products/${product.id}`,
        product
      );
      if (response.status === 200) {
        setProducts((prev) =>
          prev.map((item) => (item.id === product.id ? response.data : item))
        );
        setIsEdit(false);
        resetInput();
      } else {
        console.error("Sửa lỗi:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi, không thể chỉnh sửa:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await baseURL.delete(`/api/products/${id}`);
      if (response.status === 200) {
        setProducts((prev) => prev.filter((item) => item.id !== id));
      } else {
        console.error("Xóa thất bại:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi, không thể xóa:", error);
    }
  };

  const handleEditClick = (product: ProductType) => {
    setProduct(product);
    setIsEdit(true);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await baseURL.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("lỗi", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="flex flex-col md:flex-row gap-8 p-6">
      <Table className="border border-gray-400 shadow-md">
        <TableHeader>
          <TableRow>
            <TableHead className="text-center border border-gray-400">STT</TableHead>
            <TableHead className="text-center border border-gray-400">Tên sản phẩm</TableHead>
            <TableHead className="text-center border border-gray-400">Hình ảnh</TableHead>
            <TableHead className="text-center border border-gray-400">Giá</TableHead>
            <TableHead className="text-center border border-gray-400">Số lượng</TableHead>
            <TableHead className="text-center border border-gray-400">Chức năng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell className="text-center border border-gray-400">{index + 1}</TableCell>
              <TableCell className="text-center border border-gray-400">{product.name}</TableCell>
              <TableCell className="text-center border border-gray-400">
                <img
                  className="w-[60px] h-[60px] rounded object-cover mx-auto"
                  src={product.image}
                  alt={product.name}
                />
              </TableCell>
              <TableCell className="text-center border border-gray-400">
                {product.price
                  ? product.price.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })
                  : "N/A"}
              </TableCell>

              <TableCell className="text-center border border-gray-400">{product.quantity}</TableCell>
              <TableCell className="text-center flex justify-center">
                <Button
                  onClick={() => handleEditClick(product)}
                  className="mr-2 bg-blue-500 text-white hover:bg-blue-600"
                >
                  Sửa
                </Button>
                <Button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white hover:bg-red-600"
                  variant="destructive"
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <form
        onSubmit={handleAdd}
        className="w-full md:w-1/2 bg-white p-6 rounded shadow-md"
      >
        <h2 className="text-lg font-bold mb-4">
          {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm mới sản phẩm"}
        </h2>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Tên sản phẩm</label>
          <input
            value={product.name}
            onChange={handleChange}
            name="name"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            type="text"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Hình ảnh (URL)</label>
          <input
            value={product.image}
            onChange={handleChange}
            name="image"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            type="text"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Giá (VND)</label>
          <input
            value={product.price}
            onChange={handleChange}
            name="price"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            type="number"
            min={1000}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Số lượng</label>
          <input
            value={product.quantity}
            onChange={handleChange}
            name="quantity"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
            type="number"
            defaultValue={1}
            min={1}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {isEdit ? "Lưu thay đổi" : "Thêm sản phẩm"}
        </Button>
      </form>
    </main>
  );
};

export default Home;
