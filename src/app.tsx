import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import Router from 'preact-router';
import { InfoRecord } from './pages/info-record';


import './app.css'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
	<Router>
		<InfoRecord path="" />  
	</Router>
    </>
  )
}
