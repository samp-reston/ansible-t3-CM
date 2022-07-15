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
  .query("getGroups", {
    async resolve({ ctx }) {
      return await ctx.prisma.groupBaseline.findMany({
        select: {
          groupId: true
        }
      });
    },
  })
  .query("getAllHostSoftwares", {
    async resolve({ ctx }) {
      return await ctx.prisma.hosts.findMany({
        include: {
          software: true,
        }
      })
    }
  })
  .query("getAllHostBaselines", {
    async resolve({ ctx }) {
      return await ctx.prisma.hosts.findMany({
        include: {
          baseline: true,
        }
      })
    }
  })
  .query("getAllHosts", {
    async resolve({ ctx }) {
      return await ctx.prisma.hosts.findMany({
        include: {
          baseline: true,
          software: true,
        }
      })
    }
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
      const {
        rigId,
        hostname,
        groupId,
        assetBridge,
        gcpUploader,
        cssLaunch,
        corvus,
        corvusParallel,
        vehicleSpy,
        jlrSDK,
        modelYear,
        model,
        vin,
        intrepid,
        niHostname,
        rigType,
        testUser,
      } = input

      try {
        const host = await ctx.prisma.hosts.create({
          data: {
            rigId,
            hostname,
            groupId
          }
        })

        const hostVariables = await ctx.prisma.hostVariables.create({
          data: {
            hostId: hostname,
            rigName: rigId,
            modelYear,
            model,
            vin,
            intrepid,
            niHostname,
            rigType,
            testUser,
            agent: rigId,
            installUser: testUser,
          }
        })

        const hostBaseline = await ctx.prisma.hostBaseline.create({
          data: {
            hostId: hostname,
            assetBridge,
            gcpUploader,
            cssLaunch,
            corvus,
            corvusParallel,
            vehicleSpy,
            jlrSDK
          }
        })

        const hostSoftware = await ctx.prisma.hostSoftware.create({
          data: {
            hostId: hostname,
            assetBridge: null,
            gcpUploader: null,
            cssLaunch: null,
            corvus: null,
            corvusParallel: null,
            vehicleSpy: null,
            jlrSDK: null
          }
        })

        return [host, hostBaseline, hostVariables, hostSoftware]
      } catch(err) {
        console.log(err)
        if(err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new trpc.TRPCError({
              code: 'CONFLICT',
              message: err.meta?.target === 'hosts_hostname_key' ? 'Hostname already in use.' : 'Rig ID already in use.'
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
  .mutation("removeHost", {
    input: removeHostSchema,
    async resolve({ ctx, input}) {
      const {hostname} = input
      try {
        const removeHostFromHosts = await ctx.prisma.hosts.deleteMany({
          where: {
            hostname: hostname
          }
        })

        const removeHostFromHostSoftware = await ctx.prisma.hostBaseline.deleteMany({
          where: {
            hostId: hostname
          }
        }).catch()

        const removeHostFromHostBaseline = await ctx.prisma.hostBaseline.deleteMany({
          where: {
            hostId: hostname
          }
        }).catch()

        const removeHostFromHostVariables = await ctx.prisma.hostVariables.deleteMany({
          where: {
            hostId: hostname
          }
        }).catch()

        return [removeHostFromHosts, removeHostFromHostSoftware, removeHostFromHostBaseline, removeHostFromHostVariables]
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
