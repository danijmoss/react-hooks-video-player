import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import Video from "../Video";
import Playlist from "../containers/Playlist";
import StyledWbnPlayer from "../styles/StyledWbnPlayer";

const theme = {
  bgcolor: "#353535",
  bgcoloritem: "#414141",
  bgcolorItemActive: "#405c63",
  bgcolorPlayed: "#526d4e",
  border: "none",
  borderPlayed: "none",
  color: "#fff"
};

const themeLight = {
  bgcolor: "#fff",
  bgcoloritem: "#fff",
  bgcolorItemActive: "#80a7b1",
  bgcolorPlayed: "#7d9979",
  border: "1px solid #353535",
  borderPlayed: "none",
  color: "#353535"
};

const WbnPlayer = props => {
  const videos = JSON.parse(document.querySelector('[name="videos"]').value);

  const savedState = JSON.parse(localStorage.getItem(`${videos.playlistId}`));

  const [state, setState] = useState({
    videos: savedState ? savedState.videos : videos.playlist,
    activeVideo: savedState ? savedState.activeVideo : videos.playlist,
    nightMode: savedState ? savedState.nightMode : true,
    playlistId: savedState ? savedState.playlistId : videos.playlistId,
    autoplay: false
  });

  // Use local storage to persist data
  useEffect(() => {
    localStorage.setItem(`${state.playlistId}`, JSON.stringify({ ...state }));
  }, [state]);

  useEffect(() => {
    const videoId = props.match.params.activeVideo;
    if (videoId !== undefined) {
      const newActiveVideo = state.videos.findIndex(
        video => video.id === videoId
      );
      setState({
        ...state,
        activeVideo: state.videos[newActiveVideo],
        autoplay: props.location.autoplay
      });
    } else {
      props.history.push({
        pathname: `/${state.activeVideo.id}`,
        autoplay: false
      });
    }
  }, [props.match.params.activeVideo]);

  // Set up toggle for switching to nightmode
  const nightModeCallback = () => {
    setState(prevState => ({
      ...prevState,
      nightMode: !prevState.nightMode
    }));
  };

  // What to do when the video has ended
  const endCallback = () => {
    const videoId = props.match.params.activeVideo;
    const currentVideoIndex = state.videos.findIndex(
      video => video.id === videoId
    );

    const nextVideo =
      currentVideoIndex === state.videos.length - 1 ? 0 : currentVideoIndex + 1;

    props.history.push({
      pathname: `${state.videos[nextVideo].id}`,
      autoplay: false
    });
  };

  // Check to see if the video has played for 10 seconds
  const progressCallback = e => {
    if (e.playedSeconds > 10 && e.playedSeconds < 11) {
      const videos = [...state.videos];
      const playedVideo = videos.find(
        video => video.id === state.activeVideo.id
      );
      playedVideo.played = true;

      setState(prevState => ({
        ...prevState,
        videos
      }));

      // setState({
      //   ...state,
      //   videos: state.videos.map(element => {
      //     return element.id === state.activeVideo.id
      //       ? { ...element, played: true }
      //       : element;
      //   })
      // });
    }
  };

  return (
    <ThemeProvider theme={state.nightMode ? theme : themeLight}>
      {state.video !== null ? (
        <StyledWbnPlayer>
          <Video
            active={state.activeVideo}
            autoplay={state.autoplay}
            endCallback={endCallback}
            progressCallback={progressCallback}
          />
          <Playlist
            videos={state.videos}
            active={state.activeVideo}
            nightModeCallback={nightModeCallback}
            nightMode={state.nightMode}
          />
        </StyledWbnPlayer>
      ) : null}
    </ThemeProvider>
  );
};

export default WbnPlayer;
