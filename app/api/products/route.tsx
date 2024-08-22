import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const GET = async () => {
  const filePath = path.join(process.cwd(), "database/products.json");
  const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return NextResponse.json(
    products ? products : { message: "Lỗi không thể lấy được sản phẩm" }
  );
};

export const POST = async (req: NextRequest) => {
  try {
    const filePath = path.join(process.cwd(), "database/products.json");
    const products = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const newProduct = await req.json();
    products.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf8");
    return NextResponse.json({ message: "Thêm thành công" });
  } catch (err) {
    return NextResponse.json({ message: "Thêm thất bại" });
  }
};
