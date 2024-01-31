import React, { useState } from 'react'
import avatar from '../Assets/avatar1.avif'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { profileValidation } from '../helper/validate'
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook'
import { updateUser } from '../helper/helper'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Username.module.css'
import extend from '../styles/Profile.module.css'


export default function Profile() {


  const [file, setFile] = useState();
  const [{ apiData, serverError }] = useFetch();
  const navigate = useNavigate();

  console.log('apidata',apiData)

  const formik = useFormik({
    initialValues : {
      entity : apiData?.entity ||'',
      shareholders : apiData?.shareholders || '',
      email : apiData?.email || '',
      officers : apiData?.officers || '',
      directors : apiData?.directors ||'', 
      subsidiaries : apiData?.subsidiaries ||'' 
    },
    enableReinitialize : true,
    validate : profileValidation,
    validateOnBlur : false,
    validateOnChange : false,
    onSubmit : async values => {
      values = await Object.assign(values, { profile : file || apiData?.profile || ''})
      let updatePromise = updateUser(values)
      toast.promise(updatePromise, {
        loading : 'Updating...',
        success : <b>Updated Succesfully!!</b>,
        error : <b>Could not update</b>
      })
      

    }
  })


  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }


//logout handler function
function userLogout(){
  localStorage.removeItem('token');
  navigate('/')
}
  // if(isLoading) return <h1 className='text-2xl font-bold'>isLoading</h1>
    if(serverError) return <h1 className='text-xl text-red-500'></h1>

  return (
    <div className="container mx-auto">

      <Toaster position = 'top-center' reverseOrder='false'></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass} style={{width: "40%", height: "95%", paddingTop: '0.5em'}}>

        <div className="title flex flex-col items-center">
            <h3 className='text-4xl font-bold'>Profile</h3>
            <span className='py-4 text-sm w-2/3 text-center text-gray-500'>
             You can update the details below
            </span>
          </div>

          <form  onSubmit={formik.handleSubmit}> 
            <div className='profile flex justify-center py-1'>
              <label htmlFor="profile">
                <img src={file || apiData?.profile || avatar} className={`${styles.profile_img} ${extend.profile_img}`} alt="avatar" />
              </label>
              <input onChange={onUpload} type="file" id='profile' name='profile' />
            </div>

            <div className="textbox flex flex-col items-center gap-6">

              <div className="name flex w-3/4 gap-10">
              <input {...formik.getFieldProps('entity')} className={styles.textbox} type="text" placeholder='Entity*'/>
              <input {...formik.getFieldProps('shareholders')} className={styles.textbox} type="text" placeholder='Shareholders*'/>
              </div>

              <div className="name flex w-3/4 gap-10">
              <input {...formik.getFieldProps('directors')} className={styles.textbox} type="text" placeholder='Directors*'/>
              <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder='Email*'/>
              </div>

              
              <input {...formik.getFieldProps('subsidiaries')} className={styles.textbox} type="text" placeholder='Subsidiaries*'/>
              <input {...formik.getFieldProps('officers')} className={styles.textbox} type="text" placeholder='Officers*'/>
              <button className={styles.btn} type='submit'>Update</button>
             

                
            </div>

            <div className="text-center py-4">
              <span className='text-gray-500'>Come Back Later? <button onClick={userLogout} className='text-red-500' to="/">Log out</button></span>
            </div>

          </form>

        </div>
      </div>
    </div>

  )
}
