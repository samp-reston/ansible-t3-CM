import { createRouter } from "./context";
import { z } from "zod";

export const exampleRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.hosts.findMany();
    },
  })
  .query("newHost", {
    input: z
      .object({
        id: z.string(),
        address: z.string(),
        group: z.string(),
      }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.hosts.create({
        data: {
          id: input?.id,
          address: input?.address,
          group: input?.group
        }
      })
    }
  })
  ;
