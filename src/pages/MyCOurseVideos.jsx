import { requireAuth } from "../utils/requireAuth";
import { BASE_URL } from "../constats";
import { SUPABASE_API_KEY } from "../constats";
import axios from "axios";
import { getUser } from "../utils/getUser";
import { useLoaderData } from "react-router-dom";
import ReactPlayer from "react-player/vimeo";
import styles from "./MyCourseVideos.module.css";
import { useState } from "react";
export async function MyCourseVideosLoader({ request, params }) {
  const pathname = new URL(request.url).pathname;
  await requireAuth({ redirectTo: pathname });
  const { courseID } = params;
  console.log(courseID);
  const { access_token } = await getUser();
  const modulesURL = `${BASE_URL}rest/v1/modules?course_id=eq.${courseID}&select=*`;
  console.log(modulesURL);
  const { data } = await axios.get(modulesURL, {
    headers: {
      apikey: SUPABASE_API_KEY,
    },
  });
  const modules = data.sort((a, b) => a.number - b.number);
  const videos = await Promise.all(
    modules.map((module) => {
      return axios.get(
        `${BASE_URL}rest/v1/videos?module_id=eq.${module.id}&select=*`,
        {
          headers: {
            apikey: SUPABASE_API_KEY,
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
    })
  );
  console.log("videos", videos);
  const moduleVideos = videos.map((item) =>
    item.data.sort((a, b) => a.number - b.number)
  );
  const videosData = moduleVideos.map((videos, index) => {
    return { module_name: modules[index].name, videos };
  });
  console.log("videos", videosData);
  // const flatVidoesData = [].concat(...videosData);
  return videosData;
}
function MyCOurseVideos() {
  const videosData = useLoaderData();
  if (videosData.length === 0) {
    return <h1>No videos found</h1>;
  }
  console.log("videosData", videosData);
  let firstVideo;
  for (let module of videosData) {
    console.log("module", module);
    if (module.videos.length > 0) {
      firstVideo = module.videos[0].vimeo_url;
    }
    // if (module.length > 0) {
    //   firstVideo = module[0].vimeo_url;
    // }
  }
  console.log("firstVideo", firstVideo);
  if (!firstVideo) {
    return <h1>No videos found</h1>;
  }
  const [videoUrl, setVideoUrl] = useState(firstVideo);
  return (
    <div className={`${styles.myCourseSection}`}>
      <div className={styles.playlist}>
        {videosData.map((module) => {
          return (
            <div>
              <h3>{module.module_name}</h3>
              <ul>
                {module.videos.map((video, index) => (
                  <li
                    key={video.vimeo_url}
                    onClick={() => setVideoUrl(video.vimeo_url)}
                  >
                    {index + 1}. {video.name}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div className={styles.videoContainer}>
        <ReactPlayer
          url={videoUrl}
          controls
          className={styles.video}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}

export default MyCOurseVideos;
