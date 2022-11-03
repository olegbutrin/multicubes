import React, { useEffect } from "react";

import "./App.css";

const APP_URL = "https://am08.optimacros.com/app";
const APP_ID = "988d66db-55cb-4799-a1a9-5cb0db7d9c42";
const APP_POINT = "data.json";
const MC_POINT = "multicubes";

async function fetchMCList(setData) {
  const url = `${APP_URL}/${APP_ID}/${MC_POINT}`;
  fetch(url, {
    method: "POST",
    validateHttpsCertificates: false,
  }).then((response) => {
    if (response.ok) {
      response.text().then((text) => {
        try {
          const data = JSON.parse(text);
          setData(data);
        } catch (e) {}
      });
    }
  });
}

async function fetchMC(name, setData) {
  const url = `${APP_URL}/${APP_ID}/${APP_POINT}?mc=${name}`;
  fetch(url, {
    method: "POST",
    validateHttpsCertificates: false,
  }).then((response) => {
    if (response.ok) {
      response.text().then((text) => {
        try {
          const data = JSON.parse(text);
          setData(objectToArray(data));
        } catch (e) {}
      });
    }
  });
}

function objectToArray(data) {
  const keys = Object.keys(data);
  return keys.map((key) => {
    return { name: key, ...data[key] };
  });
}

function App() {
  const [multicubes, setMulticubes] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [selection, setSelection] = React.useState("");

  useEffect(() => {
    fetchMCList(setMulticubes);
  }, []);

  useEffect(() => {
    fetchMC(selection, setData);
  }, [selection]);

  return (
    <div className="Container">
      <div className="Row">
        {multicubes.map((name) => (
          <Multicube key={name} name={name} onClick={setSelection} />
        ))}
      </div>
      <div className="Row">
        <Table data={data} />
      </div>
    </div>
  );
}

function Multicube({ name, onClick }) {
  const callaback = React.useCallback(() => {
    onClick(name);
  }, [name, onClick]);

  return (
    <div className="Multicube" onClick={callaback}>
      {name}
    </div>
  );
}

function Table({ data }) {
  if (!data.length) {
    return null;
  }

  const headers = ["", ...Object.keys(data[0])];
  return (
    <table className="Table">
      <thead>
        <tr>
          {headers.map((name) => (
            <td>{name}</td>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          return (
            <tr>
              {headers.map((col) => {
                return <td>{row[col]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default App;
