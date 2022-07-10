import type { NextPage } from "next";
import Head from "next/head";
import { useState, FormEvent } from "react";
import { useForm } from "react-hook-form";
import { RegisterNewHost } from "../schema/hosts.schema";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [hostname, setHostname] = useState('')
  const [rigId, setRigId] = useState('')
  const { handleSubmit, register } = useForm<RegisterNewHost>()

  const { data, error, isLoading, refetch } = trpc.useQuery(['db.getAll'])

  const { mutate } = trpc.useMutation(['db.registerNewHost'], {
    onError: (error) => { console.log(error) },
    onSuccess: () => {
      console.log('New host registed successfully.')
    }
  })

  const onSubmit = (values: RegisterNewHost) => {
    mutate(values)
    refetch()
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <div>Unable To Load, check database is online.</div>
  }

  return (
    <>
      <Head>
        <title>SVCM</title>
        <meta name="description" content="Software Version and Configuration Management Tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>{data?.length ? JSON.stringify(data) : 'No hosts found.'}</div>

      <form className="flex gap-2 justify-center flex-col w-1/2 m-auto" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex gap-2">
          <label htmlFor="rigId-input">Rig ID:</label>
          <input className="border-2 border-black rounded px-1" placeholder="VIL_01_RIG" type="text" id="rigId-input" {...register('rigId')} />
        </div>

        <div className="flex gap-2">
          <label htmlFor="hostname-input">Hostname:</label>
          <input className="border-2 border-black rounded px-1 self-end" placeholder="JLR1GBMW1234567" type="text" {...register('hostname')} />
        </div>

        <input className="self-end border-2 border-green-600 rounded-full px-2 bg-green-300 hover:cursor-pointer hover:bg-green-400" type="submit" value="Submit" />

        // TODO: ADD REMOVE HOST FORM

      </form>
    </>
  );
};

export default Home;
