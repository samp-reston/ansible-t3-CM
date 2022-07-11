import type { NextPage } from "next";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { Host, hostSchema, RegisterNewHost, RemoveHost } from "../schema/hosts.schema";
import { trpc } from "../utils/trpc";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

const Home: NextPage = () => {
  const { handleSubmit: submitNewHost, register: newHostRegister } = useForm<RegisterNewHost>()
  const { handleSubmit: submitRemoveHost, register: removeHostRegister } = useForm<RegisterNewHost>()

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

  const onRemoveNewHost = (values: RemoveHost) => {
    removeHost(values)
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <div>Unable To Load, check database is online.</div>
  }

  const createdAt = data && data[0]?.created_at
  if (createdAt) console.log(new Date(createdAt).toUTCString());

  const columns: GridColDef[] = [
    { field: 'rigId', headerName: 'Rig ID', flex: 0.5 },
    { field: 'hostname', headerName: 'Hostname', flex: 0.5 },
    { field: 'groupId', headerName: 'Group', flex: 0.5 },
    { field: 'created_at', headerName: 'Created', flex: 1 },
    { field: 'last_updated', headerName: 'Updated', flex: 1 },
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
    </>
  );
};

export default Home;
