import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ManageUser() {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const navigate = useNavigate();
  const [Profile, setProfile] = useState({});
  const [isActive, setIsActive] = useState("");
  const [displayProfile, setDisplayProfile] = useState(true);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/userauth/admin/edituserprofile/${id}`
        );
        setProfile(response.data?.profile);
        setIsActive(response.data?.profile.isactive);
      } catch (error) {
        console.error("error while getting details:", error);
      }
    };
    fetchProfileDetails();
  }, []);

  const handleToggle = async (id) => {
    try {
      const changeStatus = await axios.post(
        `http://localhost:3000/userauth/accountstatus`,
        { accountstatus: !isActive, id: id }
      );
      if (changeStatus.status) {
        setIsActive(!isActive);
      }
    } catch (error) {
      console.error("error sending data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstname", Profile.firstname || "");
    formData.append("lastname", Profile.lastname || "");
    formData.append("dob", Profile.dob || "");
    formData.append("address", Profile.address || "");
    formData.append("postalcode", Profile.postalcode || "");
    // formData.append("file", fileInput.current?.files[0]);
    try {
      const userDetails = await axios.post(
        `http://localhost:3000/userauth/admin/edituserprofile/${id}`,
        formData
      );
      if (userDetails.data.status) {
        setDisplayProfile(true);
      }
      setProfile(userDetails.data?.profile);
      console.log(Profile);
    } catch (error) {
      console.error("error getting user Details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  return (
    <div className="profile-container">
      <h1>Profile Details</h1>
      {displayProfile ? (
        <div className="profile-details">
          <div className="profile-info">
            <div>
              <label>First Name:</label>
              <p>{Profile.firstname}</p>
            </div>
            <div>
              <label>Last Name:</label>
              <p>{Profile.lastname}</p>
            </div>
            <div>
              <label>Date of Birth:</label>
              <p>{Profile.dob}</p>
            </div>
            <div>
              <label>Address:</label>
              <p>{Profile.address}</p>
            </div>
            <div>
              <label>Postal Code:</label>
              <p>{Profile.postalcode}</p>
            </div>
          </div>
          <div className="manageuser-buttons">
            <button onClick={() => setDisplayProfile(false)}>
              Edit Profile
            </button>
            <button onClick={() => handleToggle(Profile.id)}>
              {isActive ? "Block User" : "Unblock User"}
            </button>
            <Link to={`/userorderhistory/${id}`}>
              <button>View Order History</button>
            </Link>
          </div>
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
