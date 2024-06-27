import styles from "./LoginAndSignup.module.css";
import {
  Form,
  useActionData,
  redirect,
  useLocation,
  useNavigation,
} from "react-router-dom";
import axios from "axios";
import { LOGIN_URL, SUPABASE_API_KEY } from "../constats";
import { getUser } from "../utils/getUser";

export async function loginLoader() {
  // console.log("login loader runs");
  // if ("user" in localStorage) {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   if ("user_id" in user && "access_token" in user) {
  //     return redirect("/");
  //   }
  //   console.log("user already logged in");
  // }
  // return null;
  const user = await getUser();
  if (user === null) {
    return null;
  } else {
    return redirect("/");
  }
}

export async function loginAction({ request }) {
  const redirectTo = new URL(request.url).searchParams.get("redirectTo") || "/";
  // console.log("redirectTo ", redirectTo);
  // console.log("action run");
  // console.log(request.url);
  // console.log(request);
  const data = await request.formData();
  // console.log(data.get("email"));
  // console.log(data.get("password"));
  const credentials = {
    email: data.get("email"),
    password: data.get("password"),
  };

  try {
    const response = await axios.post(LOGIN_URL, JSON.stringify(credentials), {
      headers: {
        apiKey: SUPABASE_API_KEY,
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    const {
      access_token,
      refresh_token,
      expires_at,
      user: { id: user_id },
    } = response.data;
    const user = { access_token, refresh_token, expires_at, user_id };
    // sessionStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("user", JSON.stringify(user));
    return redirect(redirectTo);
  } catch (error) {
    localStorage.removeItem("user");
    // console.log(error.response.status);
    // console.log(error.response);
    if (error.response.status === 400) {
      // console.log("Wrong username or password");
      return { error: "Wrong username or password" };
    } else {
      // console.log(error.message);
      //error.message ye axios ka khud ka error msg hai
      //error.response.data me hume hint and message milta hai wo supabase ka error hai
      // console.log(error.response.data);
      return { error: error?.response?.data?.message || error.message };
    }
  }
  // console.log(credentials);

  // return null;
}
function Login() {
  const naviagation = useNavigation();
  const data = useActionData();
  const location = useLocation();
  // console.log(location);
  const loginURL = location.pathname + location.search;
  // console.log(loginURL);
  const isSubmitting = naviagation.state === "submitting";
  return (
    <div className={`container ${styles.formContainer}`}>
      <h2 className={styles.pageHeading}>
        Welcome Back! Login to continue learning
      </h2>
      <Form method="POST" action={loginURL} replace>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" autoComplete="off" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="off"
          />
        </div>
        <div>
          <input
            type="submit"
            value={isSubmitting ? "submitting..." : "login"}
            disabled={isSubmitting}
          />
        </div>
        {data && data.error && <p>{data.error}</p>}
      </Form>
    </div>
  );
}

export default Login;
