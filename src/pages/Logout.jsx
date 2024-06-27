import { redirect } from "react-router-dom";
import { LOGOUT_URL, SUPABASE_API_KEY } from "../constats";
import axios from "axios";
import { getUser } from "../utils/getUser";
import isTokenExpired from "../utils/isTokenExpired";
import refreshToken from "../utils/refreshToken";
export async function logoutAction() {
  let { access_token, expires_at } = await getUser();
  if (isTokenExpired(expires_at)) {
    console.log("token expired");
    access_token = await refreshToken();
  }
  try {
    // const user = await getUser();

    await axios.post(LOGOUT_URL, null, {
      headers: {
        apikey: SUPABASE_API_KEY,
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  } catch (error) {
    console.error(error.message);
  } finally {
    localStorage.removeItem("user");
    return redirect("/");
  }
  // console.log("Inside logout action");
}
