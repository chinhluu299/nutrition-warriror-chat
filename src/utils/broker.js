const amqplib = require("amqplib");
const User = require("../models/User");
require("dotenv/config");

const MESSAGE_BROKER_URL = process.env.MESSAGE_BROKER_URL;
const EXCHANGE_NAME = "";
const UPDATE_USER_QUEUE = "update_user_queue";
const CREATE_USER_QUEUE = "create_user_queue";
const UPDATE_ROUTING_KEY = "update_user_queue";
const CREATE_ROUTING_KEY = "create_user_queue";

const CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BROKER_URL);
    const channel = await connection.createChannel();
    //await channel.assertExchange(EXCHANGE_NAME);
    return channel;
  } catch (err) {
    throw err;
  }
};

const PublishMessage = async (channel, routing_key, message) => {
  console.log("Message published");
  try {
    channel.publish(EXCHANGE_NAME, routing_key, Buffer.from(message));
  } catch (err) {
    console.log(err);
  }
};


const SubscribeMessage = async (channel) => {
  try {
    //await channel.assertExchange(EXCHANGE_NAME);

    // await channel.assertQueue(UPDATE_USER_QUEUE, { durable: true });
    // await channel.bindQueue(
    //   UPDATE_USER_QUEUE,
    //   EXCHANGE_NAME,
    //   UPDATE_ROUTING_KEY
    // );

    // await channel.assertQueue(CREATE_USER_QUEUE, { durable: true });
    // await channel.bindQueue(
    //   CREATE_USER_QUEUE,
    //   EXCHANGE_NAME,
    //   CREATE_ROUTING_KEY
    // );

    channel.consume(UPDATE_USER_QUEUE, async (message) => {
      console.log("Nhan mess update user");
      if (message.content) {
        const content = JSON.parse(message.content.toString());
        console.log(content);

        await handleUserUpdate(content);
        channel.ack(message);
      }
    });

    console.log(" [*] Waiting for messages. To exit press CTRL+C");
  } catch (error) {
    console.error("Error in consumeMessages:", error);
  }
};

async function handleUserUpdate(message) {
  try {
    if (message) {
      const user = await User.findById(message.id);
      if (!user) {
        const user = new User({
          _id: message.id,
          name: message.name,
          photo: message.image,
        });
        console.log(user);
        user.save();
      } else {
        const update = User.updateOne(
          {
            _id: message.id,
          },
          { $set: { name: message.name, photo: message.image } }
        );
        update.exec();
      }
    }
  } catch (err) {
    console.log(err);
  }
}

async function handleUserCreate(message) {
  try {
    if (message) {
      const user = new User({
        _id: message.id,
        name: message.name,
        photo: message.photo,
      });
      user.save();
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  CreateChannel,
  PublishMessage,
  SubscribeMessage,
};
