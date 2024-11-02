import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Register, Dashboard, Board, Settings, Analytics, NotFound } from "../pages";




export default function App() {
  

  return (
     <BrowserRouter>
     <Routes>
      <Route path = "/dashboard" element = {<Dashboard />} >
      <Route path="board" element={<Board />} />
      
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      <Route path = "/" element = {<Register />} />
      <Route path = "/login" element = {<Login />} /> 
      
      
      <Route path = "*" element = {<NotFound />} /> 


      </Routes>
      </BrowserRouter>
  )
}


