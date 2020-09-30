import { Request, Response, NextFunction } from "express";
import { createHash } from "crypto";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  Password,
} from "@sin-nombre/sinfood-common";
import { User } from "../models/user";
import { Helper } from "../utils/helper";
import { API_ROOT_ENDPOINT } from "../utils/constants";
import { EmailSendingPublisher } from "../events/publishers/email-sending-publisher";
import { natsWrapper } from "../events/nats-wrapper";

/**
 * Return all users with addresses populated
 * @param req
 * @param res
 * @param next
 */
export const allUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const users = await User.find({}).populate("addresses");
  res.status(200).send({ status: "success", data: users });
};

/**
 * Signup A user
 * @param req
 * @param res
 * @param next
 */
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    password_confirm,
  } = req.body;

  // Check for Password Confirmation
  if (!password_confirm || password_confirm !== password) {
    throw new BadRequestError(
      `Password & Password Confirmation must be identical`
    );
  }
  const user = User.build({
    email,
    password,
    first_name,
    last_name,
    phone,
  });
  await user.save();
  // Add JWT to express session
  req.session = Helper.serializeToken(
    Helper.signToken({
      id: user.id,
      email: user.email,
    })
  );
  // Send Data + JWT Back
  Helper.createSendToken(user, 201, res);
};

/**
 * Attempt to Login A user
 * @param req
 * @param res
 * @param next
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError(`Email and Password are required`);
  }
  // check if user exist
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new NotFoundError(`User with email ${email} not found`);
  }
  // Check if password is correct
  if (!Password.compare(user.password!, password)) {
    throw new NotFoundError(
      `Incorrect Email / Password or email doesnt exists`
    ); // Dont expose that the user exist
  }

  // Add JWT to express session
  req.session = Helper.serializeToken(
    Helper.signToken({
      id: user.id,
      email: user.email,
    })
  );
  // Send Data + JWT Back
  Helper.createSendToken(user, 200, res);
};

/**
 * Returns the Current user or undefined
 * @param req
 * @param res
 * @param next
 */
export const currentU = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.send({
    status: "success",
    data: { currentUser: req.currentUser || null },
  });
};

/**
 * Create a password reset token for user
 * @param req
 * @param res
 * @param next
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    throw new NotFoundError(`User not found with that email`);
  }
  // Create a reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // @todo: add url prefix to const
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}${API_ROOT_ENDPOINT}users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetURL}`;

  try {
    // Publish an Email Sending Event
    await new EmailSendingPublisher(natsWrapper.client).publish({
      subject: `Password Reset Token (Valid for 10 mins)`,
      emailBody: message,
      receiver: user.email,
    });

    res.status(200).json({
      status: "success",
      data: { resetURL },
      message: "Token sent to email!",
    });
  } catch (e) {
    user.password_reset_token = undefined;
    user.password_expires_at = undefined;
    await user.save({ validateBeforeSave: false });

    throw new Error(`Something Went wrong!`);
  }
};

/**
 * Resets a Users Password
 * @param req
 * @param res
 * @param next
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, password_confirm } = req.body.params;
  if (!password || !password_confirm || password !== password_confirm) {
    throw new BadRequestError(
      `Password and Password Confirmation must be identical`
    );
  }
  // find user by token
  const hashedToken = createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    password_reset_token: hashedToken,
    password_expires_at: {
      $gt: new Date(),
    },
  });

  // Update password if token is not expired and there is a user
  if (!user) {
    throw new NotFoundError(`User doesnt exist or token expired`);
  }
  user.password = req.body.password;
  user.password_reset_token = undefined;
  user.password_expires_at = undefined;
  user.save();

  // Add JWT to express session
  req.session = Helper.serializeToken(
    Helper.signToken({
      id: user.id,
      email: user.email,
    })
  );

  // Send JWT
  Helper.createSendToken(user, 200, res);
};

/**
 * Update the current logged in users password
 * @param req
 * @param res
 * @param next
 */
export const updatedPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, new_password } = req.body;

  const user = await User.findById(req.currentUser!.id).select("+password");
  // The moment he is here it means that he passed the requireAth middleware
  // So there is a user with this id. Although add the check so TS STFU!
  if (!user) {
    throw new BadRequestError(`User Not found`);
  }
  // Check if Posted password is correct
  if (!Password.compare(password, user.password!)) {
    throw new NotAuthorizedError();
  }
  // Update password
  user.password = new_password;
  await user.save({ validateBeforeSave: false });

  // Add JWT to express session
  req.session = Helper.serializeToken(
    Helper.signToken({
      id: user.id,
      email: user.email,
    })
  );

  // Send JWT
  Helper.createSendToken(user, 200, res);
};

/**
 * Kills session = signout the user
 * @param req
 * @param res
 * @param next
 */
export const signout = (req: Request, res: Response, next: NextFunction) => {
  req.session = null;
  res.send({});
};