/* eslint-disable no-console */
import util from "util";

import { App } from "./app";
import { DB } from "./config/db";
import { eventService } from "./lib/event";

if (process.env.APP_ENV === "test") {
  util.inspect.defaultOptions = {
    depth: null,
    colors: true,
    maxArrayLength: null,
  };
}

void (async () => {
  const port = process.env.PORT;

  const server = await App.boot();
  const liveServer = server.listen(port, () => console.log(`server started at http://localhost:${port}`));

  const graceFullExit = () => {
    console.log("SIGTERM signal received.");
    console.log("Closing http server.");
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    liveServer.close(async () => {
      console.log("Http server closed.");
      await DB.disconnect();
      await eventService.disconnect();
      console.log("MongoDb connection closed.");
      console.log(" Alright! Bye!");
      return;
    });
  };

  process.on("SIGTERM", graceFullExit);
  process.on("SIGINT", graceFullExit);
})();
