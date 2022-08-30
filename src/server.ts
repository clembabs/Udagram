import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
import validUrl from "valid-url";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    let { image_url } = req.query;

    if (validUrl.isUri(image_url)) {
      const filteredPath = await filterImageFromURL(image_url);

      res.status(200).sendFile(filteredPath);
      res.on("end", () => deleteLocalFiles([filteredPath]));
    } else {
      return res.status(500).send({ error: "Unable to process this request" });
    }
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
