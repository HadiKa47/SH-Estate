import { useState, useEffect } from "react";
import "./editPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

function EditPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [post, setPost] = useState(null);
  const [isOwner, setIsOwner] = useState(true); // State to check ownership

  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!postId) {
      setError("No post ID provided");
      return;
    }

    const fetchPostDetails = async () => {
      try {
        const res = await apiRequest.get(`/posts/${postId}`);
        const postData = res.data;
        setPost(postData);
        setValue(postData.postDetail.desc);
        setImages(postData.images);

        // Check if currentUser is the owner of the post
        if (postData.userId !== currentUser.id) {
          setIsOwner(false); // Not owner
        }
      } catch (err) {
        console.log(err);
        setError("Failed to load post details");
      }
    };

    fetchPostDetails();
  }, [postId, currentUser.id]);

  useEffect(() => {
    if (!isOwner) {
      navigate("/not-authorized"); // Redirect if not authorized
    }
  }, [isOwner, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      // Update the post
      const res = await apiRequest.put(`/posts/${postId}`, {
        title: inputs.title,
        price: parseInt(inputs.price, 10),
        address: inputs.address,
        city: inputs.city,
        bedroom: parseInt(inputs.bedroom, 10),
        bathroom: parseInt(inputs.bathroom, 10),
        latitude: inputs.latitude,
        longitude: inputs.longitude,
        type: inputs.type,
        property: inputs.property,
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size, 10),
          school: parseInt(inputs.school, 10),
          bus: parseInt(inputs.bus, 10),
          restaurant: parseInt(inputs.restaurant, 10),
        },
      });

      navigate("/" + postId);
    } catch (err) {
      console.error("Update Post Error: ", err);
      setError(
        "Failed to update post: " + (err.response?.data?.message || err.message)
      );
    }
  };

  if (!isOwner) {
    return <p>You are not authorized to edit this post.</p>; // Show message if not authorized
  }

  return (
    <div className="editPostPage">
      <div className="formContainer">
        <h1>Edit Your Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            {/* Form inputs with defaultValue set to post data */}
            <div className="item">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={post?.title}
              />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                defaultValue={post?.price}
              />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                defaultValue={post?.address}
              />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                defaultValue={post?.city}
              />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input
                min={1}
                id="bedroom"
                name="bedroom"
                type="number"
                defaultValue={post?.bedroom}
              />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input
                min={1}
                id="bathroom"
                name="bathroom"
                type="number"
                defaultValue={post?.bathroom}
              />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                type="text"
                defaultValue={post?.latitude}
              />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                type="text"
                defaultValue={post?.longitude}
              />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select id="type" name="type" defaultValue={post?.type}>
                <option value="rent">Rent</option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property</label>
              <select
                id="property"
                name="property"
                defaultValue={post?.property}
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select
                id="utilities"
                name="utilities"
                defaultValue={post?.postDetail?.utilities}
              >
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select id="pet" name="pet" defaultValue={post?.postDetail?.pet}>
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                defaultValue={post?.postDetail?.income}
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input
                min={0}
                id="size"
                name="size"
                type="number"
                defaultValue={post?.postDetail?.size}
              />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input
                min={0}
                id="school"
                name="school"
                type="number"
                defaultValue={post?.postDetail?.school}
              />
            </div>
            <div className="item">
              <label htmlFor="bus">Bus Stop</label>
              <input
                min={0}
                id="bus"
                name="bus"
                type="number"
                defaultValue={post?.postDetail?.bus}
              />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input
                min={0}
                id="restaurant"
                name="restaurant"
                type="number"
                defaultValue={post?.postDetail?.restaurant}
              />
            </div>
            <button className="sendButton">Update</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "hadialk",
            uploadPreset: "SH-Estate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default EditPostPage;
