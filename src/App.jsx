import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import {
  Home,
  About,
  Login,
  Signup,
  MyCourses,
  Profile,
  CourseDetail,
  Payment,
  Thankyou,
  MyCOurseVideos,
} from "./pages";
import { loginAction, loginLoader } from "./pages/Login";
import { myCourseLoader } from "./pages/MyCourses";
import { profileLoader } from "./pages/Profile";
import { signupAction, signupLoader } from "./pages/Signup";
import { logoutAction } from "./pages/Logout";
import { getUser } from "./utils/getUser";
import { homeLoader } from "./pages/Home";
import { courseDetailLoader } from "./pages/CourseDetail";
import { paymentLoader } from "./pages/Payment";
import { MyCourseVideosLoader } from "./pages/MyCOurseVideos";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} loader={getUser} id="parentRoute">
      <Route index element={<Home />} loader={homeLoader}></Route>
      <Route path="/about" element={<About />}></Route>
      <Route
        path="/profile"
        element={<Profile />}
        loader={profileLoader}
      ></Route>
      <Route
        path="/login"
        element={<Login />}
        action={loginAction}
        loader={loginLoader}
      ></Route>
      <Route path="/logout" action={logoutAction} loader={loginLoader}></Route>
      <Route
        path="/signup"
        element={<Signup />}
        action={signupAction}
        loader={signupLoader}
      ></Route>
      <Route
        path="/my-courses"
        element={<MyCourses />}
        loader={myCourseLoader}
      ></Route>
      <Route
        path="/course-detail/:id"
        element={<CourseDetail />}
        loader={courseDetailLoader}
      ></Route>
      <Route
        path="/payment/:courseID"
        element={<Payment />}
        loader={paymentLoader}
      ></Route>
      <Route
        path="/my-courses/:courseID"
        element={<MyCOurseVideos />}
        loader={MyCourseVideosLoader}
      ></Route>
      <Route path="thankyou" element={<Thankyou />}></Route>
    </Route>
  )
);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
