import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ImCross } from 'react-icons/im'
import { useContext, useState } from 'react'
import { UserContext } from '../context/UserContext'
import { URL } from '../url'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'

const CreatePost = () => {

  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [file, setFile] = useState(null)
  const { user } = useContext(UserContext)
  const [cat, setCat] = useState("")
  const [cats, setCats] = useState([])

  const navigate = useNavigate()

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

  const handleCreate = async (e) => {
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
      const res = await axios.post(URL + "/api/posts/create", post, { withCredentials: true })
      navigate("/posts/post/" + res.data._id)
    }
    catch (err) {
      console.log(err)
    }
  }



  return (
    <div>
      <Navbar />
      <div className='px-6 md:px-[200px] mt-8'>
        <h1 className='font-bold md:text-2xl text-xl '>Create Advertisement</h1>
        
        <form className='w-full mt-4 flex-flex-col space-y-4 md:space-y-8'>
          <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Enter title' className='w-full px-4 py-2 outline-none' />
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
          <textarea onChange={(e) => setDesc(e.target.value)} rows={5} cols={50} className='w-full px-4 py-2 outline-none' placeholder='Enter the description' />
          <button onClick={handleCreate} className='w-1/2 ml-[50%] text-center mt-4 px-4 py-4 font-bold text-white bg-black rounded-full hover:scale-105 cursor-pointer'>Create</button>
        </form>

      </div>
      <Footer />
    </div>
  )
}

export default CreatePost