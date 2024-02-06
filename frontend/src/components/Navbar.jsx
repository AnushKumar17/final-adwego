import { Link, useLocation, useNavigate } from "react-router-dom"
import { BsSearch } from 'react-icons/bs'
import { FaBars } from 'react-icons/fa'
import { useContext, useState } from "react"
import Menu from "./Menu"
import { UserContext } from "../context/UserContext"
import logo2 from "../Logo/logo2.png"
import { IoSearch } from "react-icons/io5";
import { SlOptions } from "react-icons/sl";

const Navbar = () => {

  const [prompt, setPrompt] = useState("")
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()
  const path = useLocation().pathname

  const showMenu = () => {
    setMenu(!menu)
  }


  const { user } = useContext(UserContext)

  return (
    <div className="flex items-center justify-between px-6 md:px-[200px] py-4">
      <h1 className="flex items-center justify-between text-xl md:text-lg font-extrabold">
        <img src={logo2} className='h-10 pt-1'/>
        <Link to="/">Adwego</Link>
      </h1>
      
      {path === "/" && <div className="flex justify-center items-center space-x-0">
        <p 
          onClick={() => navigate(prompt ? "?search=" + prompt : navigate("/"))} 
          className="cursor-pointer"><IoSearch /></p>
        <input 
          onChange={(e) => setPrompt(e.target.value)} 
          className="outline-none px-3 " placeholder="Search" type="text" />
      </div>}

      <div className="hidden md:flex items-center justify-center space-x-2 md:space-x-4">
        {user ? <h3><Link to="/create">Create</Link></h3> : <h3><Link to="/login">Login</Link></h3>}
        {user ? <div onClick={showMenu}><p className="cursor-pointer relative"><SlOptions /></p>{menu && <Menu />}</div> : <h3><Link to="/register">Register</Link></h3>}
      </div>

      <div onClick={showMenu} className="md:hidden text-lg">
        <p className="cursor-pointer relative"><SlOptions /></p>
        {menu && <Menu />}
      </div>

    </div>
  )
}

export default Navbar 