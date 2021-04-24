import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UserRole } from '@sin-nombre/sinfood-common';
import jwt from 'jsonwebtoken';
import { Order, OrderAttrs, OrderDoc } from '../models/order';
import { Ingredient } from '../models/ingredient';
import { MenuItem } from '../models/menu-item';
import { ADDRESS_INFO_PAYLOAD } from '../utils/constants';

jest.mock('../events/nats-wrapper'); // Mock file into the fake

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): string[];
      signinAdmin(id?: string): string[];
      signinRestaurant(id?: string): string[];
      createOrderPayload(): Promise<OrderAttrs>;
    }
  }
}
let mongo: any;

// Start MongoMemoryServer
beforeAll(async () => {
  process.env.JWT_KEY = 'test-jwt-token-restaurant';
  process.env.NODE_ENV = 'test';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
});

// Before Each Test Reset Collection data
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  // eslint-disable-next-line no-restricted-syntax
  for (const collection of collections) {
    // eslint-disable-next-line no-await-in-loop
    await collection.deleteMany({});
  }
});

// Close MongoMemoryServer and detach mongoose from it
afterAll(async () => {
  try {
    await mongo.stop();
    await mongoose.connection.close();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.debug(e);
  }
});

global.signinRestaurant = (id?: string) => {
  // So we can use it more than one to generate random users
  // Build a JWT payload.  { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
    role: UserRole.Restaurant,
  };
  return buildPayload(payload);
};

global.signin = (id?: string) => {
  // So we can use it more than one to generate random users
  // Build a JWT payload.  { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
    role: UserRole.User,
  };
  return buildPayload(payload);
};

global.signinAdmin = (id?: string) => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
    role: UserRole.Admin,
  };
  return buildPayload(payload);
};

global.createOrderPayload = async (): Promise<OrderAttrs> => {
  const ingredientBacon = await Ingredient.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 1,
    name: 'Bacon',
  }).save();

  const ingredientHam = await Ingredient.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 2,
    name: 'Ham',
  }).save();

  const ingredientCheese = await Ingredient.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 0.5,
    name: 'Cheese',
  }).save();

  const menuItem = await MenuItem.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Super Burger',
    base_price: 5,
    variations: [
      { name: 'Small Size', price: 5 },
      { name: 'Large Size', price: 8 },
    ],
  }).save();

  const menuItemTwo = await MenuItem.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    name: 'Super Burger Two',
    base_price: 5,
    variations: [
      { name: 'Small Size', price: 3 },
      { name: 'Large Size', price: 5 },
    ],
  }).save();

  const order = {
    userId: new mongoose.Types.ObjectId().toHexString(),
    restaurantId: new mongoose.Types.ObjectId().toHexString(),
    address_info: ADDRESS_INFO_PAYLOAD,
    menu_items: [
      {
        item: menuItem.id!,
        item_options: {
          excluded_ingredients: [],
          extra_ingredients: [
            ingredientBacon.id, // 1
            ingredientCheese.id, // 0.5
            ingredientHam.id, // 2
          ],
          quantity: 1,
          variation: 'Small Size', // 5
        },
      },
      {
        item: menuItemTwo.id!,
        item_options: {
          excluded_ingredients: [],
          extra_ingredients: [ingredientBacon.id, ingredientCheese.id], // 1 + 0,5
          quantity: 3,
          variation: 'Small Size', // 3
        },
      },
      {
        item: menuItemTwo.id!,
        item_options: {
          excluded_ingredients: [],
          extra_ingredients: [ingredientBacon.id, ingredientCheese.id], // 1 + 0,5
          quantity: 2,
        },
      },
    ],
  };
  return order;
};

const buildPayload = (payload: {
  id: string;
  email: string;
  role: UserRole;
}) => {
  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
