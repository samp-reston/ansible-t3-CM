import { createRouter } from "./context";
import * as trpc from '@trpc/server'
import { registerNewHostSchema, removeHostSchema, updateHostSchema } from "../../schema/hosts.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { queryHostVariablesSchema } from "../../schema/hostVariables.schema";

export const dbRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.hosts.findMany();
    },
  })
  .query("getHostVariables", {
    input: queryHostVariablesSchema,
    async resolve({ ctx, input }) {
      const { hostname } = input

      try {
        const hostVariables = await ctx.prisma.hostVariables.findUnique({
          where: {
            hostId: hostname
          }
        })
        return hostVariables
      } catch(err) {
        console.log(err)
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong.'
        })
      }
    }
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
        console.log(err)
        if(err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2025') {
            throw new trpc.TRPCError({
              code: 'NOT_FOUND',
              message: 'Host does not exist.'
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
  .mutation("updateHost", {
    input: updateHostSchema,
    async resolve({ ctx, input}) {
      const { hostname, rigId } = input
      try {
        const updateHost = await ctx.prisma.hosts.update({
          where: {
            hostname: hostname
          },
          data: {
            rigId: rigId
          }
        })

        return updateHost
      } catch(err) {
        console.log(err)
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong.'
        })
      }
    }
  })
  ;
