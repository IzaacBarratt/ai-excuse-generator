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
    setResult("");
    // event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // If using newOptions - use that to overwrite, else use state
        // Used because refreshing state can take a few seconds 
        body: JSON.stringify(newOptions ?? excuseBody),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
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
    <div className="min-h-screen bg-bg-blue bg-hero-pattern">
      <Head>
        <title>F my Friends</title>
        <link rel="icon" href="/friendship.webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap" rel="stylesheet"></link>
      </Head>

     

      <main className="relative max-w-md px-4 py-10 mx-auto">
        <div className="absolute h-40 bg-green-700 rounded-full opacity-50 w-52 blur-2xl opacity-30 top-60" ></div>
        <div className="absolute right-0 h-40 bg-green-700 rounded-full opacity-50 w-52 blur-2xl opacity-30 top-2/4" ></div>
        <div className="absolute h-40 bg-green-700 rounded-full opacity-50 w-52 blur-2xl opacity-30 bottom-6" ></div>

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

      <ToastContainer />
    </div>
  );
}
