import { createRouter } from "./context";
import * as trpc from '@trpc/server'
import { z } from "zod";
import { registerNewHostSchema } from "../../schema/hosts.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const dbRouter = createRouter()
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
  .mutation("registerHost", {
    input: registerNewHostSchema,
    async resolve({ ctx, input }) {
      const { rigId, hostname } = input

      try {
        const host = await ctx.prisma.hosts.create({
          data: {
            rigId,
            hostname
          }
        })

        return host
      } catch(err) {
        if(err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new trpc.TRPCError({
              code: 'CONFLICT',
              message: 'Rig Id or Hostname already exists.'
            })
          }
        }

        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong.'
        })
      }
    }
  })
  // .mutation("removeHost", {
  //   input: z
  //     .object({
  //       rigId: z.string()
  //     }),
  //   async resolve({ctx, input}) {
  //     return await ctx.prisma.hosts.delete({
  //       where: {
  //         id: input.rigId
  //       }
  //     })
  //   }
  // })
  ;
