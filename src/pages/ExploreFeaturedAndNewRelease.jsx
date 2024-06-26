import useFetchFeaturedPlaylists from "../hooks/useFetchFeaturedPLaylists";
import useFetchNewReleaseAlbum from "../hooks/useFetchNewReleaseAlbum";
import { getAccessTokenFromCookie } from "../utils/helpers";
import { useParams } from "react-router-dom";
import LoadingAnimation from "../img/loadingAnimation.gif";
import useGetFetchLimit from "../hooks/useGetFecthLimit";
import useNavigatePlaylistDetails from "../hooks/useNavigatePlaylistDetails";
import useNavigateToAlbumDetails from "../hooks/useNavigateToAlbumDetails";

const ExploreFeaturedPlaylist = () => {
  const { type } = useParams();
  const accessToken = getAccessTokenFromCookie();
  const { gridSize } = useGetFetchLimit();
  const navigateAlbumDetails = useNavigateToAlbumDetails();
  const navigatePlaylistDetails = useNavigatePlaylistDetails();

  const fetchHook =
    type === "new-release"
      ? useFetchNewReleaseAlbum
      : useFetchFeaturedPlaylists;
  const { data, isLoading, isError, isSuccess } = fetchHook({
    accessToken,
  });

  return (
    <div>
      <h1 className="my-6 font-bold text-2xl text-white">
        {type === "featured-playlist"
          ? "Today Featured PLaylist"
          : "New Release"}
      </h1>
      {isLoading && (
        <img
          className="mx-auto w-28"
          src={LoadingAnimation}
          alt="Loading Animation"
        />
      )}
      {isError && (
        <h1 className="font-semibold text-center text-white">
          Something went wrong, please try again
        </h1>
      )}
      {isSuccess && (
        <>
          <div className={` grid ${gridSize} gap-4 `}>
            {type === "featured-playlist" &&
              data.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => navigatePlaylistDetails(playlist.id)}
                  className="bg-white/20 backdrop-filter rounded-lg p-4 shadow-md text-white hover:bg-white/40 transition-colors duration-500 ease-in-out cursor-pointer"
                >
                  <img
                    src={playlist.images[0].url}
                    alt={playlist.name}
                    className="w-full mb-2 rounded-md"
                  />
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {playlist.name}
                  </h3>
                  <p className="line-clamp-2 font-medium text-gray-300">
                    {playlist.description}
                  </p>
                </div>
              ))}
            {type === "new-release" &&
              data.albums.items.map((album) => (
                <div
                  key={album.id}
                  onClick={() => navigateAlbumDetails(album.id)}
                  className="bg-white/20 backdrop-filter rounded-lg p-4 shadow-md text-white hover:bg-white/40 transition-colors duration-500 ease-in-out cursor-pointer"
                >
                  <img
                    src={album.images[1].url}
                    alt={album.name}
                    className="w-full mb-2 rounded-md"
                  />
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {album.name}
                  </h3>
                  <p className="line-clamp-2 font-medium text-gray-300">
                    {album.artists[0].name}
                  </p>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExploreFeaturedPlaylist;
