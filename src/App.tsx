import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './pages/home'
import Designer from './pages/designer'
import DesignerDetail from './pages/designerdetail'
import Project from './pages/project'
import ProjectDetail from './pages/projectdetail'
import TeamProjectDetail from './pages/teamprojectdetail'
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

        <Route path="/designer/:designerId" element={<DesignerDetail />} />

        <Route path="/project" element={<Project />} />

        <Route path="/project/team/:category" element={<TeamProjectDetail />} />

        <Route path="/project/:designerId" element={<ProjectDetail />} />

        <Route path="/behind" element={<Behind />} />

        <Route path="/guestbook" element={<Guestbook />} />
        
      </Routes>

    </BrowserRouter>

  )

}

export default App
