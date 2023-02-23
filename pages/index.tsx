import Head from "next/head";
import { useState } from "react";
import * as prompts from '../data/prompts';
import 'tailwindcss/tailwind.css';
import Hero from '../components/hero'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExcuseForm from "../components/excuse-form";
import { FormExcuseOption } from "../types/forms";
import { PromptBody } from "../types/prompts";


const menuOptions: FormExcuseOption<PromptBody>[] = [
  {
    key: 'planToCancel',
    values: prompts.planToCancel,
    label: 'Plan'
  },
  {
    key: 'excuse',
    values: prompts.excuse,
    label: 'Excuse'
  },
  {
    key: 'justification',
    values: prompts.justification,
    label: 'Tone'
  }, {
    key: 'blame',
    values: prompts.blame,
    label: 'Blame'
  }
]

export default function Home() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [excuseBody, setExcuseBody] = useState<PromptBody>()

  // New options - you can supply a new value here or rely on existing state
  // this is done because state takes a second to update and API call will happen before if called together
  async function onSubmit(newOptions) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOptions ?? excuseBody),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch (error) {
      console.error(error);
      toast.error("Unable to betray friends 🤧")
    } finally {
      setIsLoading(false)
    }
  }

  function copyToClipboard() {
    // If no copy - don't do this
    if (result) {
      navigator.clipboard.writeText(result.trim());
      toast.success('Copied to clipboard!');
    }
  }

  return (
    <div className="flex flex-col justify-center min-h-screen bg-bg-blue bg-hero-pattern">
      <Head>
        <title>F my Friends</title>
        <link rel="icon" href="/block.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet"></link>

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ijbarratt" />
        <meta name="twitter:creator" content="@ijbarratt" />
        <meta property="og:url" content="https://fmyfriends.co" />
        <meta property="og:title" content="Cancel on your ✌️friends✌️" />
        <meta property="og:description" content="All the fun - none of the guilt. I mean, what did they ever do for you, anyway?" />
        <meta property="og:image" content="https://fmyfriends.co/no-access.jpg" />
      </Head>

      <main className="relative w-full max-w-md px-4 py-10 mx-auto">
        <div className="absolute h-40 bg-green-700 rounded-full w-52 blur-2xl opacity-30 top-60 -left-10" ></div>
        <div className="absolute right-0 h-40 bg-green-700 rounded-full w-52 blur-2xl opacity-30 top-2/4" ></div>
        <div className="absolute h-40 bg-green-700 rounded-full w-52 blur-2xl opacity-30 bottom-6" ></div>

        <div className="relative">
          <Hero />
          <ExcuseForm
            copyToClipboard={copyToClipboard}
            onSubmit={onSubmit}
            result={result}
            formOptions={menuOptions}
            isLoading={isLoading}
            selectedValues={excuseBody}
            onUpdate={(u) => setExcuseBody(u)}
          />
        </div>
      </main>

      <footer className="pb-10 mt-auto font-thin text-white ">
          <div className="flex justify-center hover:cursor-pointer">
            <p className="opacity-80">Built by</p>
            <a className="ml-1" href="https://twitter.com/ijBarratt" target="_blank">
              <p className="font-bold underline">Izaac 🫡</p>
            </a>
          </div>
        </footer>

      <ToastContainer />
    </div>
  );
}
