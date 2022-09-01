import { Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";
import { Transaction } from "../models/transactionModel";
// import { Product } from "../models/productModel";
import CustomError from "../errors";
import { catchAsync } from "../utils/catchAsync";
import { Order } from "../models/purchaseModel";

export const creditAccount = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const {  amount } = req.body;
    
    req.body.user = req.user.userId;

    const user = await User.findOne({ userId: req.user.userId })

    const updatedWallet = await User.findOneAndUpdate(
      { userId: req.body.user.userId },
      { $inc: { wallet: amount } }
    );

    const transaction = await Transaction.create([
      {
        amount,
        name: user.name,
        email: user.email,
        balanceBefore: user.wallet,
        balanceAfter: user.wallet + Number(amount),
      },
    ]);
    res.status(201).json({
      message: "Credit successful",
      data: updatedWallet,
      transaction,
    });
  }
);
// export const creditAccount = catchAsync(
//   async (req: any, res: Response, next: NextFunction) => {
//     const { email, amount } = req.body;
//     const user = await User.findOne({ email });

//     // req.body.userWallet = req.userWallet.userId;
//     console.log(req.body.user);
    
    
//     if (!user) {
//       throw new CustomError.UnauthenticatedError("Invalid Credentials");
//     }

//     const updatedWallet = await User.findOneAndUpdate(
//       { email },
//       { $inc: { wallet: amount } }
//     );

//     const transaction = await Transaction.create([
//       {
//         amount,
//         name: user.name,
//         email: user.email,
//         balanceBefore: user.wallet,
//         balanceAfter: user.wallet + Number(amount),
//       },
//     ]);
//     res.status(201).json({
//       message: "Credit successful",
//       data: updatedWallet,
//       transaction,
//     });
//   }
// );

export const debitAccount = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const { email, amount } = req.body;
    req.body.user = req.user.userId;
    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }

    if (user.wallet < amount) {
      throw new CustomError.BadRequestError("Insufficient balance");
    }

    const updatedWallet = await User.findOneAndUpdate(
      { email },
      { $inc: { wallet: -amount } }
    );

    
    const transaction = await Transaction.create([
      {
        amount,
        name: user.name,
        email: user.email,
        balanceBefore: Number(user.wallet),
        balanceAfter: Number(user.wallet) - Number(amount),
      },
    ]);
    console.log( Number(user.wallet) - Number(amount));
    
    res.status(201).json({
      message: "Withdrawal successful",
      data: updatedWallet,
      transaction,
    });
  }
);

export const purchaseProduct = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });

    const user = await User.findOne({ orderId });

    if (!user) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }

    if (user.wallet < amount) {
      throw new CustomError.BadRequestError("Insufficient balance");
    }

    const updatedWallet = await User.findOneAndUpdate(
      { orderId },
      { $inc: { wallet: amount } }
    );

    const transaction = await Transaction.create([
      {
        amount,
        name: user.name,
        email: user.email,
        balanceBefore: user.wallet,
        balanceAfter: user.wallet - Number(amount),
      },
    ]);
    res.status(201).json({
      message: "Withdrawal successful",
      data: updatedWallet,
      transaction,
    });
  }
);

export const walletBalance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
    const balance = await user.wallet;

    res.status(201).json({
      message: "Account balance request successful",
      data: balance,
    });
  }
);
