import { createTool } from "@mastra/core/tools";
import { FreestyleDevServerFilesystem } from "freestyle-sandboxes";
import { z } from "zod";

const imageTool = (fs: FreestyleDevServerFilesystem) =>
  createTool({
    id: "generate-image",
    description: "Generate an image",
    inputSchema: z.object({
      description: z
        .string()
        .describe(
          "Description of the image. If you want to generate an image with `removeBackground`, ask for a solid black background. If you want a specific style specify that. "
        ),
      removeBackground: z
        .boolean()
        .optional()
        .default(false)
        .describe("Remove background from the asset"),
      filePath: z
        .string()
        .describe(
          "Path on dev server to save the image, for example `public/logo.png`"
        ),
    }),

    execute: async ({
      context: { description, removeBackground, filePath },
    }) => {
      const endpoint = "http://localhost:2468/generate-image";
      const body = {
        prompt: description,
        removeBackground,
      };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(
          `Error generating image: ${response.status} ${
            response.statusText
          }\nRESPONSE TEXT: ${await response.text()}`
        );
      }

      const data = await response.arrayBuffer();

      const fileContent = Buffer.from(data).toString("base64");

      const filePathTrimmed = filePath.startsWith("template/")
        ? filePath.replace("template/", "")
        : filePath;

      await fs.writeFile(filePathTrimmed, fileContent, "base64");

      console.log("File written to dev server:", filePath);
      return {
        filePath,
      };
    },
  });

export default imageTool;
