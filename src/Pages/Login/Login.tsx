import React, { useState } from "react";
import Input from "../../Components/atoms/Input/Input";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { SIGNIN } from "../../utils/restEndPoints";
import { HOME } from "../../utils/routes";
import { ISignInForm } from "../../utils/types/form";
import { validateEmail } from "../../utils/validation/loginFormValidation";
// import image from '../../Assests/Images/Kitab Khilona .png'
const Login: React.FC = () => {
  const [formData, setFormData] = useState<ISignInForm>({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({ ...prevFormData, email: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      password: e.target.value,
    }));
  };

  const handleSignInClick = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Invalid Email");
      return;
    }

    try {
      const { email, password } = formData;
      const response = await axiosInstance.post(SIGNIN, { email, password });
      toast.success(response.data.message);
      Cookies.set("token", response.data.token);
      setFormData({ email: "", password: "" });
      navigate(HOME);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };



  return (
    <>
      <div className={`flex justify-center items-center  w-full mt-6  `}>
        <section className='rounded-md bg-black/70 p-2 min-w-1/2 '>
          <div className='flex items-center justify-center bg-white px-4 py-10 sm:px-6 sm:py-16 lg:px-8'>
            <div className='xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md'>
              <h2 className='text-4xl font-bold leading-tight text-black'>Sign in to your account</h2>
              <form action='#' method='POST' className='mt-8 space-y-5'>
                <div>
                  <label
                    htmlFor='email'
                    className='text-xl font-medium text-gray-900'
                  >
                    Email address
                  </label>
                  <div className='mt-2'>
                    <Input
                      type='email'
                      placeholder='Email'
                      value={formData.email}
                      onChange={handleEmailChange}
                      name='email'
                    />
                  </div>
                </div>
                <div>
                  <div className='flex items-center justify-between'>
                    <label
                      htmlFor='password'
                      className='text-xl font-medium text-gray-900'
                    >
                      Password
                    </label>
                    <a
                      href='#'
                      title=''
                      className='text-lg font-semibold text-black hover:underline'
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className='mt-2'>
                    <Input
                      type='password'
                      placeholder='Password'
                      value={formData.password}
                      onChange={handlePasswordChange}
                      name='password'
                    />
                  </div>
                </div>
                <div>
                  <button
                    type='button'
                    onClick={handleSignInClick}
                    className='inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80'
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <ToastContainer
          position='bottom-right'
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='colored'
        />
      </div>
    </>
  );
};

export default Login;
