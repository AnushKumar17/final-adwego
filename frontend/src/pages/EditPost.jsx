import { useContext, useEffect, useState } from "react"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { ImCross } from 'react-icons/im'
import axios from "axios"
import { URL } from "../url"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"


const EditPost = () => {

  const postId = useParams().id
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [file, setFile] = useState(null)
  const [cat, setCat] = useState("")
  const [cats, setCats] = useState([])

  const fetchPost = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/" + postId)
      setTitle(res.data.title)
      setDesc(res.data.desc)
      setFile(res.data.photo)
      setCats(res.data.categories)

    }
    catch (err) {
      console.log(err)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const post = {
      title,
      desc,
      username: user.username,
      userId: user._id,
      categories: cats
    }

    if (file) {
      const data = new FormData()
      const filename = Date.now() + file.name
      data.append("img", filename)
      data.append("file", file)
      post.photo = filename
      try {
        const imgUpload = await axios.post(URL + "/api/upload", data)
      }
      catch (err) {
        console.log(err)
      }
    }

    try {
      const res = await axios.put(URL + "/api/posts/" + postId, post, { withCredentials: true })
      navigate("/posts/post/" + res.data._id)
    }
    catch (err) {
      console.log(err)
    }
  }



  useEffect(() => {
    fetchPost()
  }, [postId])

  const deleteCategory = (i) => {
    let updatedCats = [...cats]
    updatedCats.splice(i)
    setCats(updatedCats)
  }

  const addCategory = () => {
    let updatedCats = [...cats]
    updatedCats.push(cat)
    setCat("")
    setCats(updatedCats)
  }
  return (
    <div>
      <Navbar />
      <div className='px-6 md:px-[200px] mt-8'>
        <h1 className='font-bold text-3xl mt-8 '>Update Advertisement</h1>
        
        <form className='w-full mt-4 flex-flex-col space-y-4'>
          <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter title' className='w-full px-4 py-2 outline-none' />
          <input onChange={(e) => setFile(e.target.files[0])} type="file" className='px-4' />
          <div className='flex flex-col'>
            <div className='flex items-center space-x-4 md:space-x-8'>
              <input value={cat} onChange={(e) => setCat(e.target.value)} className='w-3/4 px-4 py-2 outline-none' placeholder='Enter Advertisement Category' type="text" />
              <div onClick={addCategory} className='w-1/5 text-sm text-center mt-4 px-2 py-2 font-bold text-white bg-black rounded-full hover:scale-110 cursor-pointer'>Add</div>
            </div>

            {/* categories */}
            <div className='px-4 space-x-2 flex'>
              {cats?.map((c, i) => (
                <div key={i} className='flex mt-2 justify-center items-center space-x-2 bg-gray-200 px-2 py-1 rounded-md'>
                  <p>{c}</p>
                  <p onClick={() => deleteCategory(i)} className='text-center px-1 py-1 font-bold text-white bg-black rounded-full hover:scale-110 cursor-pointer'><ImCross /></p>
                </div>
              ))}


            </div>
          </div>
          <textarea onChange={(e) => setDesc(e.target.value)} value={desc} rows={5} cols={50} className='w-full px-4 py-2 outline-none' placeholder='Enter the description' />
          <button onClick={handleUpdate} className='w-1/2 ml-[50%] text-center mt-4 px-4 py-4 font-bold text-white bg-black rounded-full hover:scale-105 cursor-pointer'>Update</button>
        </form>

      </div>
      <Footer />
    </div>
  )
}

export default EditPost