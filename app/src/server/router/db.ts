import { createRouter } from "./context";
import * as trpc from '@trpc/server'
import { z } from "zod";
import { registerNewHostSchema, removeHostSchema } from "../../schema/hosts.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const dbRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.hosts.findMany();
    },
  })
  .mutation("registerNewHost", {
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
              message: err.meta?.target === 'hosts_hostname_key' ? 'Hostname already in use.' : 'Rig ID already in use.'
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
  .mutation("removeHost", {
    input: removeHostSchema,
    async resolve({ ctx, input}) {
      const {hostname} = input
      try {
        const removedHost = await ctx.prisma.hosts.delete({
          where: {
            hostname: hostname
          }
        })

        return removedHost
      } catch(err) {
        if(err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new trpc.TRPCError({
              code: 'NOT_FOUND',
              message: 'Host does not exist.'
            })
          }
        }
        console.log(err)
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong.'
        })
      }
    }
  })
  ;
