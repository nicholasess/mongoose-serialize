import MongooseSerialize from "../src/index";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import faker from "faker/locale/pt_BR";

const options = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

const checkSchema = (array, validArray): void => {
  expect(array).toEqual(expect.arrayContaining(validArray));
};

const UserName = () =>
  "Nicholas" + faker.random.number({ min: 10000000, max: 99999999 }).toString();

describe("Mongoose Serialize", () => {
  let mongoServer;

  beforeEach(async (done) => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, options);

    done();
  });

  afterEach(async (done) => {
    await mongoose.connection.close();
    await mongoServer.stop();
    done();
  });

  it("Invalid options fields empty", async () => {
    try {
      const Schema = new mongoose.Schema(
        {
          name: String,
          age: Number,
        },
        {
          timestamps: true,
        }
      );

      Schema.plugin(MongooseSerialize, {
        fields: [],
      });

      const SerializeModel = mongoose.model(UserName(), Schema);

      await SerializeModel.create({
        name: "Nick",
        age: 28,
      });

      await SerializeModel.find();
    } catch (error) {
      expect(error).toBe("Fields accept not accept empty");
    }
  });

  it("Invalid options fields object", async () => {
    try {
      const Schema = new mongoose.Schema(
        {
          name: String,
          age: Number,
        },
        {
          timestamps: true,
        }
      );

      Schema.plugin(MongooseSerialize, {
        // @ts-ignore
        fields: [{ name: "AAA" }],
      });

      const SerializeModel = mongoose.model(UserName(), Schema);

      await SerializeModel.create({
        name: "Nick",
        age: 28,
      });

      await SerializeModel.find();
    } catch (error) {
      expect(error).toBe("Fields accept just strings");
    }
  });

  it("Valid options just name", async () => {
    const Schema = new mongoose.Schema(
      {
        name: String,
        age: Number,
      },
      {
        timestamps: true,
      }
    );

    Schema.plugin(MongooseSerialize, {
      // @ts-ignore
      fields: ["name"],
    });

    const SerializeModel = mongoose.model(UserName(), Schema);

    await SerializeModel.create({
      name: "Nick",
      age: 28,
    });

    const results = await SerializeModel.find();

    console.log(results);

    const data = Object.keys(results[0]);
    checkSchema(data, ["name"]);
  });

  it("Valid options name and age", async () => {
    const Schema = new mongoose.Schema(
      {
        name: String,
        age: Number,
      },
      {
        timestamps: true,
      }
    );

    Schema.plugin(MongooseSerialize, {
      // @ts-ignore
      fields: ["name", "age"],
    });

    const SerializeModel = mongoose.model(UserName(), Schema);

    await SerializeModel.create({
      name: "Nick",
      age: 28,
    });

    const results = await SerializeModel.find();

    const data = Object.keys(results[0]);
    checkSchema(data, ["name", "age"]);
  });
});
