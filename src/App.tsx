import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './pages/home'
import Designer from './pages/designer'
import Project from './pages/project'
import Behind from './pages/behind'
import Guestbook from './pages/guestbook'
import Header from './components/header'

function App() {

  return (

    <BrowserRouter>
      <Header />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/designer" element={<Designer />} />

        <Route path="/project" element={<Project />} />

        <Route path="/behind" element={<Behind />} />

        <Route path="/guestbook" element={<Guestbook />} />
        
      </Routes>

    </BrowserRouter>

  )

}

export default App