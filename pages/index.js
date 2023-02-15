import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import Select from 'react-select'
import * as prompts from '../data/prompts';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const selectOptions = Object.keys(prompts);

function randomiseOptions() {
  let updateObject = {}
  selectOptions.map((promptName) => {
    const promptOptionsCount = prompts[promptName].length - 1
    const randomIndex = Math.floor(Math.random() * promptOptionsCount)
    updateObject = {
      ...updateObject,
      [promptName]: prompts[promptName][randomIndex]
    }
  })
  return updateObject;
}

export default function Home() {
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(false)
  const [excuseBody, setExcuseBody] = useState({})

  async function onSubmit(event, newOptions) {
    setIsLoading(true)
    setResult();
    event.preventDefault();
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

  async function randomSubmit(event) {
    const newOptions = randomiseOptions()
    setExcuseBody(newOptions)
    return onSubmit(event, newOptions);
  }

  const selectElements = selectOptions.map((promptName) => {
    const label = promptName.charAt(0).toUpperCase() + promptName.slice(1);

    const options = prompts[promptName].map((n) => ({
      value: n,
      label: n.charAt(0).toUpperCase() + n.slice(1)
    }))

    const selectedValue = excuseBody[promptName]

    return <div className={styles.selectionBox} key={"select-box-" + promptName}>
      <label>{label}</label>
      <Select
        key={label + '-select'}
        value={(selectedValue)
          ? {
            label: selectedValue.charAt(0).toUpperCase() + selectedValue.slice(1),
            value: selectedValue
          }
          : null}
        options={options}
        onChange={(newVal) => {
          setExcuseBody(
            {
              ...excuseBody,
              [promptName]: newVal.value
            }
          )
        }}
      />
    </div>
  })

  function copyToClipboard() {
    // If no copy - don't do this
    if (result) {
      navigator.clipboard.writeText(result);
      toast.success('Copied to clipboard!');
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/friendship.webp" />
      </Head>

      <main className={styles.main}>
        <img src="/friendship.webp" className={styles.icon} />
        <h3>Cancel on your friends</h3>

        <div className={styles.foreward}>
          <h4>What is the best format for excuses? 💡</h4>


          <div className={styles['foreward-rules']}>
            <h5>We believe in a 3 point structure.</h5>
            <p>
              <span className={styles['foreward-ruleHeading']}>Explanation</span>
              : Hit the ground running, how am I letting you down?</p>
            <p>
              <span className={styles['foreward-ruleHeading']}>Excuse</span>
              : Why I'm forced to let you down</p>
            <p>
              <span className={styles['foreward-ruleHeading']}>Flip the script</span>
              : Gaslight, blame, or otherwise redirect any focus away from yourself 🫡
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit}>

          {selectElements}

          <input disabled={isLoading} className={styles.submit} type="submit" value="Justify your negligence" />
          <input disabled={isLoading} className={styles.submit} type="button" onClick={randomSubmit} value="Randomise" />
        </form>
        {isLoading && <p>Loading...</p>}
        <div className={styles.result} onClick={copyToClipboard}>
          <h4>Result:</h4>
          
          {result && 
            <div>
              <i>*Click to copy to clipboard*</i>
              <p>
                {result}
              </p>
            </div>
          }
        </div>
      </main>
      <ToastContainer/>
    </div>
  );
}
