import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchemaQ = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  city: {
    type: String,
  },
  option: {
    type: String,
  },
  query: {
    type: String,
  },
});

const UserReq = mongoose.model("UserReq", UserSchemaQ);
export { UserReq };
