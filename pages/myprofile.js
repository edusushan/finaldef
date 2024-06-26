import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import AccountSideBar from "../components/AccountSideBar";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import PasswordInput from "../components/PasswordInput";
import baseUrl from "../helpers/baseUrl";

const MyProfile = () => {
  const router = useRouter();

  const [type, setType] = useState("password");

  const [editProfile, setEditProfile] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const [userData, setUserData] = useState({});

  const [showPass, setShowPass] = useState(false);
  // console.log(userData);
  let token = "";
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
    token = localStorage.getItem("token");
  }, []);

  const [dob, setDob] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
  });

  const [passwordData, setPasswordData] = useState({
    cupassword: "",
    newpassword: "",
    confirmpassword: "",
  });

  const fetchuser = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${baseUrl}/api/fetchuserdata`, {
      data: token,
    });
    // console.log("app",response.data);
    if (response.data) {
      setUserData(response.data.user);
    }
  };

  useEffect(() => {
    if (token) {
      fetchuser();
    }
  }, [editProfile]);

  useEffect(() => {
    if (token) {
      if (editProfile) {
        setFormData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone ? userData.phone : "",
          gender: userData.gender,
        });
        setDob(userData.dob);
      }
    }
  }, [editProfile]);

  const handleChange = (e) => {
    if (e.target.name === "year") {
      setYear(e.target.value);
    }
    if (e.target.name === "month") {
      setMonth(e.target.value);
    }
    if (e.target.name === "day") {
      setDay(e.target.value);
    }
    if (e.target.name === "dob") {
      setDob(e.target.value);
    }
    console.log(e.target.name, e.target.value);

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const updateData = { ...formData, dob, id: userData._id };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log(updateData);
    setEditProfile(false);
    const response = await axios.post(`${baseUrl}/api/updateuser`, {
      data: updateData,
    });
    if (response) {
      console.log(response.data);
      toast.success("Your profile has been successfully updated");
      setEditProfile(false);
      fetchuser();
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const showPassword = (e) => {
    setType("text");
    setShowPass(true);
  };

  const hidePassword = (e) => {
    if (e.target.id === "confirmPass") {
      setType("password");
      setShowPass(false);
    }
    console.log(e.target.id);
  };

  const resetData = {
    cupassword: passwordData.cupassword,
    newpassword: passwordData.newpassword,
    email: userData.email,
  };

  const handleResetPassword = async () => {
    console.log("This function is working");
    if (passwordData.cupassword.length === 0) {
      return toast.error("Current password field cannot be blank");
    }
    if (passwordData.newpassword.length === 0) {
      return toast.error("New password field cannot be blank");
    }
    if (passwordData.confirmpassword.length === 0) {
      return toast.error("Confirm password field cannot be blank");
    }

    if (passwordData.newpassword !== passwordData.confirmpassword) {
      return toast.error("New password and confirm password donot match");
    }

    try {
      const response = await axios.post(`${baseUrl}/api/changepassword`, {
        data: resetData,
      });
      console.log(response.data);
      if (response.data.success === true) {
        setEditPassword(false);
        toast.success("Password changed successfully");
        setPasswordData({
          cupassword: "",
          newpassword: "",
          confirmpassword: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      return;
    }
    setEditPassword(false);
  };

  return (
    <div className="w-[100vw] bg-slate-100 min-h-[90vh]">
      <div className="container mx-auto 2xl:w-[80vw] lg:w-[80vw] w-[95vw]">
        <div className="innerDiv flex flex-row py-6">
          <AccountSideBar />
          <div className="main w-[75%]">
            <h1 className="font-sans text-lg lg:text-2xl text-orange-900">
              My Profile
            </h1>
            <div className="bg-white w-full h-auto min-h-[50vh] px-10 py-6 shadow-md my-8">
              {editProfile === false && editPassword === false && (
                <div className="profileData">
                  <div className="form grid grid-cols-3 gap-4">
                    <div className="inputGroup col-span-1 flex flex-col my-4">
                      <label htmlFor="fullName" className="text-sm px-2 mb-3">
                        Full Name
                      </label>
                      <div className="px-2">{userData.name}</div>
                    </div>
                    <div className="inputGroup col-span-1 flex flex-col my-4">
                      <label htmlFor="email" className="text-sm px-2 mb-3">
                        Email
                      </label>
                      <div className="px-2">{userData.email}</div>
                    </div>
                    <div className="inputGroup col-span-1 flex flex-col my-4">
                      <label htmlFor="fullName" className="text-sm px-2 mb-3">
                        Mobile
                      </label>
                      <div>
                        {userData.phone ? (
                          userData.phone
                        ) : (
                          <p className="text-gray-500 px-2">Add phone number</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form grid grid-cols-3 gap-4">
                    <div className="inputGroup col-span-1 flex flex-col my-4">
                      <label htmlFor="email" className="text-sm px-2 mb-3">
                        Birthday
                      </label>
                      <div className="select">
                        {userData.dob !== "" ? (
                          <p className="px-2">{userData.dob}</p>
                        ) : (
                          <p className="text-gray-500 px-2">Update DOB</p>
                        )}
                      </div>
                    </div>
                    <div className="inputGroup col-span-1 flex flex-col my-4">
                      <label htmlFor="gender" className="text-sm px-2 mb-3">
                        Gender
                      </label>
                      <div>
                        {userData.gender !== "" ? (
                          <p className="px-2">{userData?.gender}</p>
                        ) : (
                          <p className="text-gray-500 px-2">Update Gender</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <form onSubmit={handleSave}>
                {editProfile === true && editPassword === false && (
                  <>
                    <div className="form grid grid-cols-3 gap-4">
                      <div className="inputGroup col-span-1 flex flex-col my-4">
                        <label htmlFor="fullName" className="text-sm px-2 mb-3">
                          Full Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          className="outline-gray-500 border font-firasans border-gray-300 py-1 px-2"
                          type="text"
                          value={formData.name}
                          placeholder="Enter your name"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="inputGroup col-span-1 flex flex-col my-4">
                        <label htmlFor="email" className="text-sm px-2 mb-3">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          className="outline-gray-500 border font-firasans border-gray-300 py-1 px-2"
                          type="email"
                          value={formData.email}
                          placeholder="Enter your email"
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="inputGroup col-span-1 flex flex-col my-4">
                        <label htmlFor="fullName" className="text-sm px-2 mb-3">
                          Mobile
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          className="outline-gray-500 border font-firasans border-gray-300 py-1 px-2"
                          type="number"
                          value={formData.phone}
                          placeholder="Add your mobile number"
                          onChange={handleChange}
                          minLength={10}
                          required
                        />
                      </div>
                    </div>
                    <div className="form grid grid-cols-3 gap-4">
                      <div className="inputGroup col-span-1 flex flex-col my-4">
                        <label htmlFor="email" className="text-sm px-2 mb-3">
                          Enter Birthday
                        </label>
                        <div className="select flex">
                          <input
                            onChange={handleChange}
                            type="date"
                            name="dob"
                            value={dob}
                            className="border border-gray-300 py-1 px-2"
                          />
                        </div>
                      </div>
                      <div className="inputGroup col-span-1 flex flex-col my-4">
                        <label htmlFor="gender" className="text-sm px-2 mb-3">
                          Gender
                        </label>
                        <select
                          value={formData.gender}
                          onChange={handleChange}
                          name="gender"
                          id="gender"
                          className="border border-gray-300 py-1 px-2"
                          required
                        >
                          <option value="" disabled>
                            Gender
                          </option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {editPassword === true && (
                  <>
                    <div className="form w-[25vw]">
                      <h1 className="text-2xl font-roboto text-orange-800">
                        CHANGE YOUR PASSWORD
                      </h1>

                      <PasswordInput
                        value={passwordData.cupassword}
                        label={"Current Password"}
                        onChange={handlePasswordChange}
                        id={"cupassword"}
                        name={"cupassword"}
                        placeholder="Current Password"
                      />
                      <PasswordInput
                        value={passwordData.newpassword}
                        label={"New Password"}
                        onChange={handlePasswordChange}
                        id={"newpassword"}
                        name={"newpassword"}
                        placeholder="New Password"
                      />
                      <PasswordInput
                        value={passwordData.confirmpassword}
                        label={"Confirm Password"}
                        onChange={handlePasswordChange}
                        id={"confirmpassword"}
                        name={"confirmpassword"}
                        placeholder="Confirm Password"
                      />
                    </div>
                  </>
                )}
                <div className="buttons flex flex-col w-[20vw]">
                  {editProfile === false && editPassword === false && (
                    <button
                      onClick={() => {
                        setEditProfile(true);
                        setFormData({
                          name: userData.name,
                          email: userData.email,
                          phone: userData.phone ? userData.phone : "",
                          gender: userData.gender,
                        });
                        setDob(userData.dob);
                      }}
                      className="mt-10 py-4 px-8 font-firasans text-xl bg-blue-700/60 rounded-sm text-white hover:bg-blue-800/70"
                      type="submit"
                    >
                      EDIT PROFILE
                    </button>
                  )}

                  {editProfile === false && editPassword === false && (
                    <button
                      onClick={() => setEditPassword(true)}
                      className="mt-3 py-4 px-8 font-firasans text-xl bg-blue-700/60 rounded-sm text-white hover:bg-blue-800/70"
                      type="button"
                    >
                      CHANGE PASSWORD
                    </button>
                  )}
                  {editPassword === true && editProfile === false && (
                    <button
                      onClick={() => {
                        handleResetPassword();
                      }}
                      className="mt-3 py-4 px-8 font-firasans text-xl bg-blue-700/60 rounded-sm text-white hover:bg-blue-800/70"
                      type="button"
                    >
                      SAVE CHANGES
                    </button>
                  )}

                  {editProfile === true && editPassword === false && (
                    <button
                      className="mt-10 py-4 px-8 font-firasans text-xl bg-blue-700/60 rounded-sm text-white hover:bg-blue-800/70"
                      type="submit"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
