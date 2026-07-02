import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './pages/home'
import Guestbook from './pages/guestbook'
import Header from './components/header'

function App() {

  return (

    <BrowserRouter>
      <Header />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/guestbook" element={<Guestbook />} />

      </Routes>

    </BrowserRouter>

  )

}

export default App