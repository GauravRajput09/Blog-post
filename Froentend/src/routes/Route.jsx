import { Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import ForgatePassword from "../pages/ForgatePassword";
import AddPost from "../components/AddPost";
import PostDetail from "../components/PostDetail";
import EditPost from "../components/EditPost";

function Routing() {
  return (
    <Routes>
      <Route path="*" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgotpassword" element={<ForgatePassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/addpost" element={<AddPost />} />
      <Route path="/post/:id" element={<PostDetail />} />
      <Route path="/edit/:id" element={<EditPost />} />
    </Routes>
  );
}

export default Routing;
