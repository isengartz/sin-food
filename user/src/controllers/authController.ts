/* eslint-disable no-unreachable */
import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  Password,
  QueryModelHelper,
  AuthHelper,
} from '@sin-nombre/sinfood-common';

import { User } from '../models/user';
import { API_ROOT_ENDPOINT } from '../utils/constants';
import { EmailSendingPublisher } from '../events/publishers/email-sending-publisher';
import { natsWrapper } from '../events/nats-wrapper';

/**
 * Return all users with addresses populated
 * @param req
 * @param res
 * @param next
 */
export const allUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // @ts-ignore
  const queryHelper = new QueryModelHelper(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // @ts-ignore
  const totalCount = await User.countDocuments(queryHelper.getTotalCount());

  const users = await queryHelper.getQuery().populate('addresses');
  res.status(200).send({
    status: 'success',
    results: users.length,
    totalCount,
    data: users,
  });
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
  next: NextFunction,
) => {
  // leave this for testing so I can add admins without accessing Mongo Pods
  // @todo: remove on production
  if (
    !req.body.admin_passphrase ||
    req.body.admin_passphrase !== process.env.ADMIN_ALLOW_PASSWORD
  ) {
    delete req.body.role;
  }

  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    password_confirm,
    role,
  } = req.body;

  // Check for Password Confirmation
  if (!password_confirm || password_confirm !== password) {
    throw new BadRequestError(
      'Password & Password Confirmation must be identical',
    );
  }
  // @todo: remove role on production
  const user = User.build({
    email,
    password,
    first_name,
    last_name,
    phone,
    role,
  });
  await user.save();
  // Add JWT to express session
  req.session = AuthHelper.serializeToken(
    AuthHelper.signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    }),
  );
  // Send Data + JWT Back
  AuthHelper.createSendToken(user, 201, res);
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
  next: NextFunction,
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Email and Password are required');
  }
  // check if user exist
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new NotFoundError(`User with email ${email} not found`);
  }

  // Check if password is correct
  if (!(await Password.compare(user.password!, password))) {
    throw new NotFoundError(
      'Incorrect Email / Password or email doesnt exists',
    ); // Dont expose that the user exist
  }

  // Add JWT to express session
  req.session = AuthHelper.serializeToken(
    AuthHelper.signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    }),
  );
  // Send Data + JWT Back
  AuthHelper.createSendToken(user, 200, res);
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
  next: NextFunction,
) => {
  res.send({
    status: 'success',
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
  next: NextFunction,
) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    throw new NotFoundError('User not found with that email');
  }
  // Create a reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // @todo: change the url for the frontend endpoint that will handle the reset password
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}${API_ROOT_ENDPOINT}/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? You must be a retard but no problem! Submit a PATCH request with your new password to ${resetURL}`;

  try {
    // Publish an Email Sending Event
    await new EmailSendingPublisher(natsWrapper.client).publish({
      subject: 'Password Reset Token (Valid for 10 mins)',
      emailBody: message,
      receiver: user.email,
    });

    res.status(200).json({
      status: 'success',
      data: { resetURL, resetToken },
      message: 'Token sent to email!',
    });
  } catch (e) {
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new Error('Something Went wrong!');
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
  next: NextFunction,
) => {
  const { password, password_confirm } = req.body;
  if (!password || !password_confirm || password !== password_confirm) {
    throw new BadRequestError(
      'Password and Password Confirmation must be identical',
    );
  }
  // find user by token
  const hashedToken = createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    password_reset_token: hashedToken,
    password_reset_expires: {
      $gt: Date.now(),
    },
  });

  // Update password if token is not expired and there is a user
  if (!user) {
    throw new NotFoundError('User doesnt exist or token expired');
  }
  user.password = req.body.password;
  user.password_reset_token = undefined;
  user.password_reset_expires = undefined;
  await user.save();
  delete user.password;

  // Add JWT to express session
  req.session = AuthHelper.serializeToken(
    AuthHelper.signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    }),
  );

  // Send JWT
  AuthHelper.createSendToken(user, 200, res);
};

/**
 * Update the current logged in users password
 * @param req
 * @param res
 * @param next
 */
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { password, new_password } = req.body;
  if (!password || !new_password) {
    throw new BadRequestError('Password and new_password fields are required');
  }
  const user = await User.findById(req.currentUser!.id).select('+password');

  // The moment he is here it means that he passed the requireAth middleware
  // So there is a user with this id. Although add the check so TS STFU!
  if (!user) {
    throw new BadRequestError('User Not found');
  }
  // Check if Posted password is correct
  if (!(await Password.compare(user.password!, password))) {
    throw new NotAuthorizedError();
  }
  // Update password
  user.password = new_password;
  await user.save({ validateBeforeSave: false });
  delete user.password;

  // Add JWT to express session
  req.session = AuthHelper.serializeToken(
    AuthHelper.signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    }),
  );

  // Send JWT
  AuthHelper.createSendToken(user, 200, res);
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
