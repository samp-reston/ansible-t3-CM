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
  const [modelYear, setModelYear] = useState<number>(0)

  const { data, error, isLoading, refetch: refetchAll } = trpc.useQuery(['db.getAll'])

  const { data: groupData, refetch: refetchGroups } = trpc.useQuery(['db.getGroups'])

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
    // console.log(host)
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
    if (!baselineHost?.hasOwnProperty(field)) return 'bg-green-300'
    if (baselineHost[field as keyof typeof baselineHost] != value) return 'bg-red-300'
    return 'bg-green-300'
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

  const supportedModelYears = () => {
    const currentYear = new Date().getFullYear()
    const supportedYears: number[] = []
    for (let i = -5; i < 6; i++) {
      supportedYears.push(currentYear + i)
    }
    return supportedYears
  }

  const supportedRigTypes: string[] = [
    "DSPACE",
    "NI",
    "VECT"
  ]

  const formSetNumber = (v: string | undefined) => {
    return v ? parseInt(v) : null
  }

  const setNullIfEmpty = (v: string | undefined) => {
    return v ? v : null
  }

  return (
    <>
      <Head>
        <title>SVCM</title>
        <meta name="description" content="Software Version and Configuration Management Tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>All Hosts</h1>
      <div className="flex w-10/12 m-auto">
        <DataGrid
          getRowId={(row) => row.rigId}
          rows={data?.length ? data : []}
          columns={columns}
          hideFooter
          autoHeight={true}
        />
      </div>

      <h1>Host Softwares</h1>
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
      <form className="flex gap-2 justify-center flex-row w-auto m-auto" onSubmit={submitNewHost(onRegisterNewHost)}>
        <div id="hostClassification" className="flex flex-col gap-2 border-black border-2 p-2">
          <h2>Host Classification</h2>
          <div className="flex gap-2">
            <label htmlFor="rigId-input">Rig ID:</label>
            <input required className="border-2 border-black rounded px-1" placeholder="VIL_01_RIG" type="text" id="rigId-input" {...newHostRegister('rigId')} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="hostname-input">Hostname:</label>
            <input required className="border-2 border-black rounded px-1 self-end" id="hostname-input" placeholder="JLR1GBMW1234567" type="text" {...newHostRegister('hostname')} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="groupId">Group:</label>
            <select className="border-2 border-black rounded px-1 self-end" id="groupId" {...newHostRegister('groupId', { setValueAs: v => setNullIfEmpty(v) })}>
              <option value={undefined}></option>
              {groupData?.map((group) => {
                const { groupId } = group
                return (
                  <option key={groupId} value={groupId}>{groupId}</option>
                )
              })}
            </select>
          </div>
        </div>

        <div id="hostVariables" className="flex flex-col gap-2 border-black border-2 p-2">
          <h2>Host Variables</h2>

          <div className="flex gap-2">
            <label htmlFor="rigName-input">CSS Launch Rig Name:</label>
            <input className="border-2 border-black rounded px-1 self-end" id="rigName-input" placeholder="VIL01" type="text" {...newHostRegister('rigName', { setValueAs: v => setNullIfEmpty(v) })} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="modelYear">Model Year:</label>
            <input className="border-2 border-black rounded px-1 self-end" id="intrepid-input" placeholder="2022" type="text" {...newHostRegister('modelYear', { setValueAs: v => formSetNumber(v) })} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="model-input">Model:</label>
            <input className="border-2 border-black rounded px-1 self-end" maxLength={4} id="model-input" placeholder="L123" type="text" {...newHostRegister('model', { setValueAs: v => setNullIfEmpty(v) })} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="vin-input">VIN:</label>
            <input className="border-2 border-black rounded px-1 self-end" maxLength={17} id="vin-input" placeholder="XXXXXXXXXXXXXXXXX" type="text" {...newHostRegister('vin', { setValueAs: v => setNullIfEmpty(v) })} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="intrepid-input">Intrepid:</label>
            <input className="border-2 border-black rounded px-1 self-end" id="intrepid-input" placeholder="Intrepid Hardware ID" type="text" {...newHostRegister('intrepid', { setValueAs: v => formSetNumber(v) })} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="niHostname-input">NI Vision Hostname:</label>
            <input className="border-2 border-black rounded px-1 self-end" id="niHostname-input" placeholder="gal1exukvil3" type="text" {...newHostRegister('niHostname', { setValueAs: v => setNullIfEmpty(v) })} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="rigType">Rig Type:</label>
            <select className="border-2 border-black rounded px-1 self-end" id="rigType" {...newHostRegister('rigType', { setValueAs: v => setNullIfEmpty(v) })}>
              <option value={undefined}></option>
              {supportedRigTypes.map((rigType) => {
                return (
                  <option key={rigType} value={rigType}>{rigType}</option>
                )
              })}
            </select>
          </div>

          <div className="flex gap-2">
            <label htmlFor="testUser-input">CSS Launch User:</label>
            <input className="border-2 border-black rounded px-1 self-end" id="testUser-input" placeholder="VIL01AUT" type="text" {...newHostRegister('testUser', { setValueAs: v => setNullIfEmpty(v) })} />
          </div>
        </div>

        <div id="hostBaseline" className="flex flex-col gap-2 border-black border-2 p-2">
          <h2>Host Software Version Baseline</h2>

          <div className="flex gap-2">
            <label htmlFor="assetBridge-input">Asset Bridge:</label>
            <input className="border-2 border-black rounded px-1" placeholder="1.0.0" type="text" id="assetBridge-input" {...newHostRegister('assetBridge', { setValueAs: v => setNullIfEmpty(v) })} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="gcpUploader-input">GCP Uploader:</label>
            <input className="border-2 border-black rounded px-1" placeholder="1.0.0" type="text" id="gcpUploader-input" {...newHostRegister('gcpUploader', { setValueAs: v => setNullIfEmpty(v) })} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="cssLaunch-input">CSS Launch:</label>
            <input className="border-2 border-black rounded px-1" placeholder="1.0.0" type="text" id="cssLaunch-input" {...newHostRegister('cssLaunch', { setValueAs: v => setNullIfEmpty(v) })} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="jlrSDK-input">JLR SDK:</label>
            <input className="border-2 border-black rounded px-1" placeholder="1.0.0" type="text" id="jlrSDK-input" {...newHostRegister('jlrSDK', { setValueAs: v => setNullIfEmpty(v) })} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="corvus-input">Corvus:</label>
            <input className="border-2 border-black rounded px-1" placeholder="1.0.0" type="text" id="corvus-input" {...newHostRegister('corvus', { setValueAs: v => setNullIfEmpty(v) })} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="corvusParallel-input">Corvus Parallel:</label>
            <input className="border-2 border-black rounded px-1" placeholder="1.0.0" type="text" id="corvusParallel-input" {...newHostRegister('corvusParallel', { setValueAs: v => setNullIfEmpty(v) })} />
          </div>

          <div className="flex gap-2">
            <label htmlFor="vehicleSpy-input">Vehicle Spy:</label>
            <input className="border-2 border-black rounded px-1" placeholder="1.0.0" type="text" id="vehicleSpy-input" {...newHostRegister('vehicleSpy', { setValueAs: v => setNullIfEmpty(v) })} />
          </div>
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
