import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




// import React, { useState } from "react";
// import ReactDOM from "react-dom";
// import ReactTooltip from "react-tooltip";

// import "./styles.css";

// import MapChart from "./components/Maps/SimpleMaps";

// function App() {
//   const [content, setContent] = useState("");
//   return (
//     <div>
//       <MapChart setTooltipContent={setContent} />
//       <ReactTooltip>{content}</ReactTooltip>
//     </div>
//   );
// }

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
