import Koa from "koa";
import to from "await-to-js";
import flakeid from "../utils/flakeid";

export const method = "get";

export const handler = async (ctx: Koa.Context) => {
  // generate uid
  const [err, id] = await to(flakeid.create());
  if (err) {
    ctx.throw(err);
  }

  // send response
  ctx.status = 200;
  ctx.body = {
    id,
  };
};
