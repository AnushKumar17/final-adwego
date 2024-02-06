import { useContext, useEffect, useState } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import ProfilePosts from "../components/ProfilePosts"
import axios from "axios"
import { IF, URL } from "../url"
import { UserContext } from "../context/UserContext"
import { useNavigate, useParams } from "react-router-dom"


const Profile = () => {
  const param = useParams().id
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [updated, setUpdated] = useState(false)
  // console.log(user)

  const fetchProfile = async () => {
    try {
      const res = await axios.get(URL + "/api/users/" + user._id)
      setUsername(res.data.username)
      setEmail(res.data.email)
      setPassword(res.data.password)
    }
    catch (err) {
      console.log(err)
    }
  }

  const handleUserUpdate = async () => {
    setUpdated(false)
    try {
      const res = await axios.put(URL + "/api/users/" + user._id, { username, email, password }, { withCredentials: true })
      // console.log(res.data)
      setUpdated(true)

    }
    catch (err) {
      console.log(err)
      setUpdated(false)
    }

  }

  const handleUserDelete = async () => {
    try {
      const res = await axios.delete(URL + "/api/users/" + user._id, { withCredentials: true })
      setUser(null)
      navigate("/")
      // console.log(res.data)

    }
    catch (err) {
      console.log(err)
    }
  }
  // console.log(user)
  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/user/" + user._id)
      // console.log(res.data)
      setPosts(res.data)


    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchProfile()

  }, [param])

  useEffect(() => {
    fetchUserPosts()

  }, [param])

  return (
    <div>
      <Navbar />
      <div className='w-full px-8 mt-8 flex flex-col-reverse'>
        <div className='w-full mt-8 flex flex-col w-full'>
          <h1 className='underline underline-offset-8 text-2xl font-bold mb-4'>Your Advertisements</h1>
          {posts?.map((p) => (
            <ProfilePosts key={p._id} p={p} />
          ))}
        </div>

        <div className='w-full border-solid border-2 py-4 px-4 flex flex-col space-y-4'>
          <h1 className='w-full text-center underline underline-offset-8 text-2xl font-bold mb-4'>Profile</h1>
          <input onChange={(e) => setUsername(e.target.value)} value={username} className='w-full text-center outline-none px-4 py-2 text-gray-500' placeholder='New Username' type='text' />
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='w-full text-center outline-none px-4 py-2 text-gray-500' placeholder='New E-mail' type='email' />
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='w-full text-center outline-none px-4 py-2 text-gray-500' placeholder='New Password' type='password' />
          <div className='w-full text-center flex items-center space-x-8 mt-4'>
            <button onClick={handleUserUpdate} className='w-1/2 text-center mt-4 px-4 py-4 font-bold text-white bg-black rounded-full hover:scale-105 cursor-pointer'>Update</button>
            <button onClick={handleUserDelete} className='w-1/2 text-center mt-4 px-4 py-4 font-bold text-white bg-black rounded-full hover:scale-105 cursor-pointer'>Delete</button>
          </div>
          {updated && <h3 className='text-green-500 text-sm text-center mt-4'>Updated Successfully</h3>}
        </div>

      </div>
      <Footer />
    </div>
  )
}

export default Profile