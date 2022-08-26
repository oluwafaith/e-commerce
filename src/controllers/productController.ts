import  {Product}  from "../models/productModel";
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync";
import CustomError from "../errors";
import path from "path";

const createProduct = async (req: any, res: Response) => { 
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(201).json({ product });
};

const getAllProducts = async (req: any, res: Response) => {
  const products = await Product.find({});

  res.status(200).json({ products, count: products.length });
};

const getSingleProduct = async (req: any, res: Response) => {
  console.log("got here")
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId }).populate("reviews");

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(200).json({ product });
};

const updateProduct = async (req: any, res: Response) => {
  const { id: productId } = req.params;

  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  res.status(200).json({ product });
};

const deleteProduct = async (req: any, res: Response) => {
  const { id: productId } = req.params;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }

  await product.remove();
  res.status(200).json({ msg: "Success! Product removed." });
};

const uploadImage = async (req: any, res: Response) => {
  if (!req.files) {
    throw new CustomError.BadRequestError("No File Uploaded");
  }
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please Upload Image");
  }

  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload image smaller than 1MB"
    );
  }

  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(200).json({ image: `/uploads/${productImage.name}` });
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
