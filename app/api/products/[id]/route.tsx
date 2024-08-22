import fs from "fs";
import path from "path";
import { ProductType } from "@/app/page";
import { NextRequest, NextResponse } from "next/server";

export interface PropType {
  params: {
    id: string | number;
  };
}

export const GET = async (req: NextRequest, { params }: PropType) => {
  const { id } = params;
  const filePath = path.join(process.cwd(), "database/products.json");
  const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const foundProduct = products.find((item: ProductType) => item.id === +id);
  return NextResponse.json(
    foundProduct
      ? foundProduct
      : { message: "Lỗi không thể lấy được sản phẩm theo id" }
  );
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const filePath = path.join(process.cwd(), "database/products.json");
    const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const foundIndex = products.findIndex(
      (item: ProductType) => item.id === +id
    );

    if (foundIndex === -1) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm cần sửa" },
        { status: 404 }
      );
    }

    const editProduct = await req.json();
    products[foundIndex] = { ...products[foundIndex], ...editProduct };

    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf8");
    return NextResponse.json({ message: "Sửa sản phẩm thành công" });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { message: "Lỗi không thể sửa sản phẩm" },
      { status: 500 }
    );
  }
};
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const filePath = path.join(process.cwd(), "database/products.json");
    const products = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const updatedProducts = products.filter(
      (item: ProductType) => item.id !== +id
    );

    if (products.length === updatedProducts.length) {
      return NextResponse.json(
        { message: "Không tìm thấy sản phẩm cần xóa" },
        { status: 404 }
      );
    }

    fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2), "utf8");
    return NextResponse.json({ message: "Xóa sản phẩm thành công" });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { message: "Lỗi không thể xóa sản phẩm" },
      { status: 500 }
    );
  }
};
