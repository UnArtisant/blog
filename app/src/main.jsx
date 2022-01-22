import React from 'react'
import ReactDOM from 'react-dom'
import { Buffer } from 'buffer';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)
window.Buffer = Buffer;

import App from "./App";

//global style
import './styles/index.css'
import '@solana/wallet-adapter-react-ui/styles.css'

ReactDOM.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
)
