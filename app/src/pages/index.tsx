import type { NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { RegisterNewHost, RemoveHost, UpdateHost } from "../schema/hosts.schema";
import { trpc } from "../utils/trpc";
import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid';
import { HostVariablesQuery } from "../schema/hostVariables.schema";
import { useState } from "react";
import { HostBaseline, HostSoftware } from "@prisma/client";

const Home: NextPage = () => {
  const { handleSubmit: submitNewHost, register: newHostRegister } = useForm<RegisterNewHost>()
  const { handleSubmit: submitRemoveHost, register: removeHostRegister } = useForm<RemoveHost>()
  const { handleSubmit: submitUpdateHost, register: updateHostRegister } = useForm<UpdateHost>()
  const { handleSubmit: submitQueryHostVariables, register: queryHostVariablesRegister } = useForm<HostVariablesQuery>()
  const [targetHost, setTargetHost] = useState('')

  const { data, error, isLoading, refetch: refetchAll } = trpc.useQuery(['db.getAll'])

  const { mutate: registerNewHost } = trpc.useMutation(['db.registerNewHost'], {
    onError: (error) => { console.log(error) },
    onSuccess: () => {
      console.log('New host registed successfully.')
      refetchAll()
    }
  })

  const onRegisterNewHost = (values: RegisterNewHost) => {
    registerNewHost(values)
  }

  const { mutate: removeHost } = trpc.useMutation(['db.removeHost'], {
    onError: (error) => { console.log(error) },
    onSuccess: () => {
      console.log('Host successfully removed.')
      refetchAll()
    }
  })

  //TODO: Remove all related fields when host is removed.
  const onRemoveNewHost = (values: RemoveHost) => {
    removeHost(values)
  }

  const { mutate: updateHost } = trpc.useMutation(['db.updateHost'], {
    onError: (error) => { console.log(error) },
    onSuccess: () => {
      console.log('Host successfully updated.')
      refetchAll()
      refetchAllHostSoftwares()
      refetchAllHostBaselines()
    }
  })

  const onUpdateHost = (values: UpdateHost) => {
    updateHost(values)
  }

  const { data: hostVariableData, refetch: refetchHostVariables } = trpc.useQuery(['db.getHostVariables', {
    hostname: targetHost
  }], {
    onSuccess(data) {
      console.log(data);
    },
    enabled: false
  })

  const onQueryHostVariables = () => {
    refetchHostVariables()
  }

  const { data: allHostSoftwares, refetch: refetchAllHostSoftwares } = trpc.useQuery(['db.getAllHostSoftwares'])
  const { data: allHostBaselines, refetch: refetchAllHostBaselines } = trpc.useQuery(['db.getAllHostBaselines'])
  const { data: allHosts, refetch: refetchAllHosts } = trpc.useQuery(['db.getAllHosts'])

  // TODO: Use ALLHOSTS to validate and check actual vs baseline rather than current workaround

  const actualSoftwareRows = allHostSoftwares?.map((host) => {
    const newHost = {
      rigId: host.rigId,
      hostname: host.hostname,
      assetBridge: host.software?.assetBridge,
      corvus: host.software?.corvus,
      corvusParallel: host.software?.corvusParallel,
      cssLaunch: host.software?.cssLaunch,
      gcpUploader: host.software?.gcpUploader,
      jlrSDK: host.software?.jlrSDK,
      vehicleSpy: host.software?.vehicleSpy,
    }
    return newHost
  })

  const baselineSoftwareRows = allHostBaselines?.map((host) => {
    const newHost = {
      rigId: host.rigId,
      hostname: host.hostname,
      assetBridge: host.baseline?.assetBridge,
      corvus: host.baseline?.corvus,
      corvusParallel: host.baseline?.corvusParallel,
      cssLaunch: host.baseline?.cssLaunch,
      gcpUploader: host.baseline?.gcpUploader,
      jlrSDK: host.baseline?.jlrSDK,
      vehicleSpy: host.baseline?.vehicleSpy,
    }
    return newHost
  })

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <div>Unable To Load, check database is online.</div>
  }

  const columns: GridColDef[] = [
    { field: 'rigId', headerName: 'Rig ID', flex: 0.5 },
    { field: 'hostname', headerName: 'Hostname', flex: 0.5 },
    { field: 'groupId', headerName: 'Group', flex: 0.5 }
  ]

  const deviationStyling = (params: GridCellParams) => {
    const { id: rigId, value, field } = params
    const baselineHost = baselineSoftwareRows?.filter((host) => host.rigId === rigId)[0]
    if (baselineHost[field] != value) return 'bg-red-300'
    return ''
  }

  const deviationColumns: GridColDef[] = [
    { field: 'rigId', headerName: 'Rig ID', flex: 0.5 },
    { field: 'hostname', headerName: 'Hostname', flex: 0.5 },
    { field: 'assetBridge', headerName: 'Asset Bridge', flex: 0.5, cellClassName: deviationStyling },
    { field: 'gcpUploader', headerName: 'GCP Uploader', flex: 0.5, cellClassName: deviationStyling },
    { field: 'cssLaunch', headerName: 'CSS Launch', flex: 0.5, cellClassName: deviationStyling },
    { field: 'corvus', headerName: 'Corvus', flex: 0.5, cellClassName: deviationStyling },
    { field: 'corvusParallel', headerName: 'Corvus Parallel', flex: 0.5, cellClassName: deviationStyling },
    { field: 'vehicleSpy', headerName: 'Vehicle Spy 3', flex: 0.5, cellClassName: deviationStyling },
    { field: 'jlrSDK', headerName: 'JLR SDK', flex: 0.5, cellClassName: deviationStyling }
  ]

  return (
    <>
      <Head>
        <title>SVCM</title>
        <meta name="description" content="Software Version and Configuration Management Tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex w-10/12 m-auto">
        <DataGrid
          getRowId={(row) => row.rigId}
          rows={data?.length ? data : []}
          columns={columns}
          hideFooter
          autoHeight={true}
        />
      </div>

      <h1>Baseline</h1>
      <div className="flex w-10/12 m-auto">
        <DataGrid
          getRowId={(row) => row.rigId}
          rows={actualSoftwareRows ? actualSoftwareRows : []}
          columns={deviationColumns}
          hideFooter
          autoHeight={true}
        />
      </div>

      <h1>Register New Host</h1>
      <form className="flex gap-2 justify-center flex-col w-1/2 m-auto" onSubmit={submitNewHost(onRegisterNewHost)}>

        <div className="flex gap-2">
          <label htmlFor="rigId-input">Rig ID:</label>
          <input className="border-2 border-black rounded px-1" placeholder="VIL_01_RIG" type="text" id="rigId-input" {...newHostRegister('rigId')} />
        </div>

        <div className="flex gap-2">
          <label htmlFor="hostname-input">Hostname:</label>
          <input className="border-2 border-black rounded px-1 self-end" placeholder="JLR1GBMW1234567" type="text" {...newHostRegister('hostname')} />
        </div>

        <input className="self-end border-2 border-green-600 rounded-full px-2 bg-green-300 hover:cursor-pointer hover:bg-green-400" type="submit" value="Submit" />
      </form>

      <h1>Remove Host</h1>
      <form className="flex gap-2 justify-center flex-col w-1/2 m-auto" onSubmit={submitRemoveHost(onRemoveNewHost)}>

        <div className="flex gap-2">
          <label htmlFor="hostname-input">Hostname:</label>
          <input className="border-2 border-black rounded px-1 self-end" placeholder="JLR1GBMW1234567" type="text" {...removeHostRegister('hostname')} />
        </div>

        <input className="self-end border-2 border-green-600 rounded-full px-2 bg-green-300 hover:cursor-pointer hover:bg-green-400" type="submit" value="Submit" />
      </form>

      <h1>Update Host</h1>
      <form className="flex gap-2 justify-center flex-col w-1/2 m-auto" onSubmit={submitUpdateHost(onUpdateHost)}>

        <div className="flex gap-2">
          <label htmlFor="hostname-input">Hostname:</label>
          <select className="border-2 border-black rounded px-1 self-end" placeholder="JLR1GBMW1234567" {...updateHostRegister('hostname')}>
            {
              data?.length &&
              data.map((host) => {
                return (
                  <option key={host.hostname} value={host.hostname}>{host.hostname}</option>
                )
              })
            }
          </select>
        </div>

        <div className="flex gap-2">
          <label htmlFor="rigId-input">Rig ID:</label>
          <input className="border-2 border-black rounded px-1" placeholder="VIL_01_RIG" type="text" id="rigId-input" {...updateHostRegister('rigId')} />
        </div>

        <input className="self-end border-2 border-green-600 rounded-full px-2 bg-green-300 hover:cursor-pointer hover:bg-green-400" type="submit" value="Submit" />
      </form>

      <h1>Get Host Variables</h1>
      <form className="flex gap-2 justify-center flex-col w-1/2 m-auto" onSubmit={submitQueryHostVariables(onQueryHostVariables)}>

        <div className="flex gap-2">
          <label htmlFor="hostname-input">Hostname:</label>
          <select className="border-2 border-black rounded px-1 self-end" placeholder="JLR1GBMW1234567" {...queryHostVariablesRegister('hostname')} onChange={(e) => setTargetHost(e.target.value)} value={targetHost}>
            <option key={0} value=''></option>
            {
              data?.length &&
              data.map((host) => {
                return (
                  <option key={host.hostname} value={host.hostname}>{host.hostname}</option>
                )
              })
            }
          </select>
        </div>

        <input className="self-end border-2 border-green-600 rounded-full px-2 bg-green-300 hover:cursor-pointer hover:bg-green-400" type="submit" value="Submit" />
      </form>
    </>
  );
};

export default Home;
