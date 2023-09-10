import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [modelInput, setmodelInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: modelInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setmodelInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const convertData = (result) => {
    const modelInfo = JSON.parse(result);
    return (
      <div className={styles.result}>
        <ul>Information</ul>
        <li>Engine: {modelInfo.engine}</li>
        <li>Manufacturer: {modelInfo.manufacturer}</li>
        <li>Fuel: {modelInfo.fuel}</li>
        <li>Power: {modelInfo.power} </li>
        <li>Max Speed: {modelInfo.max_Speed}</li>
      </div>
    )
  }
  return (
    <div>
      <Head>
        <title>Motorcycle Models</title>
        <link rel="icon" href="/Motorcycle.png" />
      </Head>

      <main className={styles.main}>
        <img src="/Motorcycle.png" className={styles.icon} />
        <h3>Motorcycle Model Information</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="Model"
            placeholder="Enter your motorcycle model"
            value={modelInput}
            onChange={(e) => setmodelInput(e.target.value)}
          />
          <input type="submit" value="Get info" />
        </form>
        <div className={styles.result}>
          {result && result !== '' ? convertData(result.trim()) : ''}
        </div>
      </main>
    </div>
  );
}
