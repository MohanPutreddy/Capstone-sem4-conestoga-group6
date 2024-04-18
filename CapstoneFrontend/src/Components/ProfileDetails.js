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
        `https://6811-99-251-82-105.ngrok-free.app/userauth/profile`,
        formData, {
          headers: {
            'ngrok-skip-browser-warning': '69420'
          }
        }
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
    <div className="profile-container">
      <h1>Profile Details</h1>
      {displayProfile ? (
        <div className="profile-details">
          <div>
            <div className="profile-info">
              <label>First Name:</label>
              <p>{Profile.firstname}</p>
            </div>
            <div className="profile-info">
              <label>Last Name:</label>
              <p>{Profile.lastname}</p>
            </div>
            <div className="profile-info">
              <label>Date of Birth:</label>
              <p>{Profile.dob}</p>
            </div>
            <div className="profile-info">
              <label>Address:</label>
              <p>{Profile.address}</p>
            </div>
            <div className="profile-info">
              <label>Postal Code:</label>
              <p>{Profile.postalcode}</p>
            </div>
          </div>
          <button onClick={() => setDisplayProfile(false)}>Edit Profile</button>
        </div>
      ) : (
        <div className="profile-details">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="firstname">First Name:</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={Profile.firstname}
                onChange={handleChange}
                className="profile-input"
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
                className="profile-input"
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
                className="profile-input"
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
                className="profile-input"
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
                className="profile-input"
              />
            </div>
            {/* <div>
              <label htmlFor="file">Image URL: </label>
              <div>
                <input
                  type="file"
                  name="file"
                  ref={fileInput}
                  accept="image/*"
                />
              </div>
            </div> */}
            <button type="submit" className="profile-submit">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
