import { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlayCircle,
  faPauseCircle,
  faForwardStep,
  faBackwardStep,
  faPlay,
  faVolumeLow,
  faVolumeHigh,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";
import NowPlayingContext from "../context/NowPlayingProvider";
import useFetchTrack from "../hooks/useFetchTrack";
import { getAccessTokenFromCookie, msToMinuteSecond } from "../utils/helpers";
import musicIcon from "../img/music-icon.jpg";
import useNavigateToArtistDetails from "../hooks/useNavigateToArtistDetails";
import useNavigateToAlbumDetails from "../hooks/useNavigateToAlbumDetails";
import useIsMobile from "../hooks/useIsMobile";

const SongPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [audio] = useState(new Audio());
  const accessToken = getAccessTokenFromCookie();
  const isMobile = useIsMobile();

  const navigateToAlbumDetails = useNavigateToAlbumDetails();
  const navigateToArtistDetails = useNavigateToArtistDetails();

  const { nowPlaying, setPlayingView, playingView, setTrackProgress } =
    useContext(NowPlayingContext);

  const { data, isSuccess } = useFetchTrack({
    accessToken,
    trackId: nowPlaying,
    autoFetch: nowPlaying ? true : false,
  });

  const togglePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const handleProgressChange = (event) => {
    const newProgress = parseInt(event.target.value);
    setProgress(newProgress);
    setTrackProgress(newProgress);
    if (audio.duration) {
      audio.currentTime = (newProgress / 100) * audio.duration;
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
    audio.volume = newVolume / 100;
  };

  const volumeIcon = () => {
    if (volume === 0) return faVolumeMute;
    if (volume < 50) return faVolumeLow;
    return faVolumeHigh;
  };

  useEffect(() => {
    if (isSuccess && data) {
      audio.src = data.preview_url;
      audio.load();
      if (isPlaying) {
        audio.play().catch(error => console.error("Playback failed:", error));
      }
    }
  }, [isSuccess, data, audio, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      audio.play().catch(error => console.error("Playback failed:", error));
    } else {
      audio.pause();
    }
  }, [isPlaying, audio]);

  useEffect(() => {
    audio.volume = volume / 100;
  }, [volume, audio]);

  useEffect(() => {
    const updateProgress = () => {
      const newProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(newProgress);
      setTrackProgress(newProgress);
    };

    audio.addEventListener('timeupdate', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, [audio, setTrackProgress]);

  useEffect(() => {
    // Reset progress when a new song is played
    setProgress(0);
    setTrackProgress(0);
    setIsPlaying(true);
    if (audio.src) {
      audio.play().catch(error => console.error("Playback failed:", error));
    }
  }, [nowPlaying, setTrackProgress, audio]);

  useEffect(() => {
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audio]);

  return (
    <>
      <div
        className={`grid ${
          isMobile ? "grid-cols-2" : "grid-cols-3"
        } text-white p-2`}
      >
        <div className="flex items-center">
          <img
            src={isSuccess ? data.album.images[2].url : musicIcon}
            alt={isSuccess ? data.name : "Music Icon"}
            className="h-16 rounded-md mr-2"
          />
          <div className="song-details">
            {isSuccess && (
              <>
                <h1
                  className="line-clamp-1 hover:underline cursor-pointer"
                  onClick={() => navigateToAlbumDetails(data.album.id)}
                >
                  {data.name}
                </h1>
                <h1 className="text-gray-400 line-clamp-1">
                  {data.artists.map((artist, index) => (
                    <span key={artist.id}>
                      <span
                        className="cursor-pointer hover:underline hover:text-white text-sm"
                        onClick={() => navigateToArtistDetails(artist.id)}
                      >
                        {artist.name}
                      </span>
                      {index !== data.artists.length - 1 && ", "}
                    </span>
                  ))}
                </h1>
              </>
            )}
          </div>
        </div>
        {!isMobile && (
          <div className="flex flex-col justify-evenly">
            <section
              className={`flex justify-center ${
                nowPlaying ? "text-white" : "text-gray-500"
              }`}
            >
              <button type="button" title="Previous">
                <FontAwesomeIcon icon={faBackwardStep} />
              </button>
              <button
                type="button"
                title={isPlaying ? "Pause" : "Play"}
                onClick={togglePlayPause}
              >
                <FontAwesomeIcon
                  className="mx-4"
                  icon={nowPlaying && isPlaying ? faPauseCircle : faPlayCircle}
                  size="2x"
                  disabled={!nowPlaying}
                />
              </button>
              <button type="button" title="Next">
                <FontAwesomeIcon icon={faForwardStep} />
              </button>
            </section>
            <section className="md:flex justify-center items-center text-sm text-gray-400 hidden">
              {isSuccess && (
                <p>{msToMinuteSecond((progress * data.duration_ms) / 100)}</p>
              )}
              <input
                title="Song Progress"
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="progress-bar mx-2"
                disabled={!nowPlaying}
              />
              {isSuccess && <p>{msToMinuteSecond(data.duration_ms)}</p>}
            </section>
          </div>
        )}
        <section className="flex justify-evenly items-center">
          {isMobile && (
            <button
              type="button"
              title={isPlaying ? "Pause" : "Play"}
              onClick={togglePlayPause}
            >
              <FontAwesomeIcon
                className="mx-4"
                icon={nowPlaying && isPlaying ? faPauseCircle : faPlayCircle}
                size="2x"
                disabled={!nowPlaying}
              />
            </button>
          )}
          {nowPlaying && (
            <button
              type="button"
              title="Now Playing View"
              className={`p-1 flex rounded-sm border-2 ${
                playingView ? "text-green-700 border-green-700" : "text-white"
              }`}
              onClick={() => setPlayingView(!playingView)}
            >
              <FontAwesomeIcon icon={faPlay} className="h-3" />
            </button>
          )}
          <div
            className={`md:flex justify-center items-center hidden ${
              nowPlaying ? "text-white" : "text-gray-500"
            }`}
          >
            <FontAwesomeIcon icon={volumeIcon()} className="mr-4" />
            <input
              title="Volume"
              type="range"
              min="0"
              max="100"
              value={volume}
              className="progress-bar"
              onChange={handleVolumeChange}
              disabled={!nowPlaying}
            />
          </div>
        </section>
      </div>
      <input
        title="Song Progress"
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleProgressChange}
        className="progress-bar w-full block md:hidden"
        disabled={!nowPlaying}
      />
    </>
  );
};

export default SongPlayer;