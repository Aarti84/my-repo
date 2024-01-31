import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../Assets/avatar1.avif'
import { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { usernameValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'

import styles from '../styles/Username.module.css'

export default function Username() {

  const navigate = useNavigate();
  const setUsername = useAuthStore(state => state.setUsername)
 

  const formik = useFormik({
    initialValues : {
      username : ''
    },
    validate : usernameValidate,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
     setUsername(values.username);
     navigate('/password')
    }
  })

  return (
    <div className="container mx-auto">

      <Toaster position = 'top-center' reverseOrder='false'></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}  style={{width: "30%", height:"80%", paddingTop: '4em'}}>

        <div className="title flex flex-col items-center">
            <h3 className='text-3xl font-bold'>Hello Again!</h3>
            <span className='py-4 text-sm w-2/3 text-center text-gray-500'>
              Explore more by connecting with us
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}> 
            <div className='profile flex justify-center py-4'>
              <img src={avatar} className={styles.profile_img} alt="avatar" />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
                <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username'/>
                <button className={styles.btn} type='submit'>Let's Go</button>
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>Not a Memeber? <Link className='text-red-500' to="/register"> Register Now</Link></span>
            </div>

          </form>

        </div>
      </div>
    </div>

  )
}
