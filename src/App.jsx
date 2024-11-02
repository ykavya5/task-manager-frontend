import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Register, Dashboard, Board, Settings, Analytics, NotFound } from "../pages";




export default function App() {
  

  return (
     <BrowserRouter>
     <Routes>
      <Route path = "/" element = {<Dashboard />} >
      <Route path="board" element={<Board />} />
      
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      <Route path = "/register" element = {<Register />} />
      <Route path = "/login" element = {<Login />} /> 
      
      
      <Route path = "*" element = {<NotFound />} /> 


      </Routes>
      </BrowserRouter>
  )
}


