import React, { useContext, useState, useRef } from "react";
import { AppContext } from "./GlobalContextProvider";

import axios from "axios";
export default function ProfileDetails() {
  const fileInput = useRef();
  const [displayProfile, setDisplayProfile] = useState(true);
  const { Profile, setProfile, reFetchCart } = useContext(AppContext);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstname", Profile.firstname);
    formData.append("lastname", Profile.lastname);
    formData.append("dob", Profile.dob);
    formData.append("address", Profile.address);
    formData.append("postalcode", Profile.postalcode);
    formData.append("file", fileInput.current?.files[0]);
    try {
      const updateProfile = await axios.post(
        `http://localhost:3000/userauth/profile`,
        formData
      );
      if (updateProfile.data.status) {
        reFetchCart();

        setDisplayProfile(true);
      }
    } catch (error) {
      console.error("Error while updating profile:", error);
    }
  };

  return (
    <div>
      {displayProfile ? (
        <div>
          <h1>Profile Details</h1>
          <div>
            <div>
              <img
                src={`http://localhost:3000/uploads/${Profile.profileimage}`}
                alt={Profile.image}
              />
            </div>
            <p>First Name: {Profile.firstname}</p>
            <p>Last Name: {Profile.lastname}</p>
            <p>Date of Birth: {Profile.dob}</p>
            <p>Address: {Profile.address}</p>
            <p>Postal Code: {Profile.postalcode}</p>
            <button onClick={() => setDisplayProfile(false)}>
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1>Profile Details</h1>
          <div>
            <img
              src={`http://localhost:3000/uploads/${Profile.profileimage}`}
              alt={Profile.image}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="firstname">First Name:</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={Profile.firstname}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="lastname">Last Name:</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={Profile.lastname}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="dob">Date of Birth:</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={Profile.dob}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={Profile.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="postalcode">Postal Code:</label>
              <input
                type="text"
                id="postalcode"
                name="postalcode"
                value={Profile.postalcode}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="file">Image URL: </label>
              <div>
                <input
                  type="file"
                  name="file"
                  ref={fileInput}
                  accept="image/*"
                />
              </div>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}
