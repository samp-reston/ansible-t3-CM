import type { NextPage } from "next";
import Head from "next/head";
import { useState, FormEvent } from "react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [hostname, setHostname] = useState('')
  const [rigId, setRigId] = useState('')
  const { data, error, isLoading } = trpc.useQuery(['db.getAll'])



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

      <form className="flex gap-2 justify-center flex-col w-1/2 m-auto" onSubmit={(e) => console.log(e)}>
        <div className="flex gap-2">
          <label htmlFor="rigId-input">Rig Id:</label>
          <input className="border-2 border-black rounded px-1" placeholder="VIL_01_RIG" type="text" name="rigId" id="rigId-input" value={rigId} onChange={(e) => setRigId(e.target.value)} />
        </div>

        <div className="flex gap-2">
          <label htmlFor="hostname-input">Hostname:</label>
          <input className="border-2 border-black rounded px-1 self-end" placeholder="JLR1GBMW1234567" type="text" name="hostname" id="hostname-input" value={hostname} onChange={(e) => setHostname(e.target.value)} />
        </div>

        <input className="self-end border-2 border-green-600 rounded-full px-2 bg-green-300 hover:cursor-pointer hover:bg-green-400" type="submit" value="Submit" />
      </form>
    </>
  );
};

export default Home;
