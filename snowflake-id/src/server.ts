import { snowflakeIdSvc } from "./snowflake";
import flakeid from "./utils/flakeid";

//
(async () => {
  try {
    await flakeid.setup();
    snowflakeIdSvc.start({ port: process.env.SVC_PORT || 3999 });
  } catch (e) {
    throw e;
  }
})();
