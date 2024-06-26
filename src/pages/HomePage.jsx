import useFetchFeaturedPlaylists from "../hooks/useFetchFeaturedPLaylists";
import useFetchNewReleaseAlbum from "../hooks/useFetchNewReleaseAlbum";
import { getAccessTokenFromCookie } from "../utils/helpers";
import LoadingAnimation from "../img/loadingAnimation.gif";
import { useNavigate } from "react-router-dom";
import useGetFetchLimit from "../hooks/useGetFecthLimit";
import useNavigatePlaylistDetails from "../hooks/useNavigatePlaylistDetails";
import useNavigateToAlbumDetails from "../hooks/useNavigateToAlbumDetails";

const HomePage = () => {
  const accessToken = getAccessTokenFromCookie();
  const navigate = useNavigate();
  const { gridSize, fetchLimit } = useGetFetchLimit();

  const navigatePlaylistDetails = useNavigatePlaylistDetails();
  const navigateAlbumDetails = useNavigateToAlbumDetails();

  const {
    data: newAlbumData,
    isLoading: isNewAlbumLoading,
    isError: isNewAlbumError,
    isSuccess: isNewAlbumSuccess,
  } = useFetchNewReleaseAlbum({
    accessToken,
    limit: fetchLimit,
  });

  const {
    data: featuredPlaylistsData,
    isLoading: isFeaturedPlaylistsLoading,
    isError: isFeaturedPlaylistsError,
    isSuccess: isFeaturedPlaylistsSuccess,
  } = useFetchFeaturedPlaylists({ accessToken, limit: fetchLimit });

  return (
    <>
      <section className="flex justify-between items-center text-white">
        <h1 className="my-8 text-xl font-bold">Today Featured Playlist</h1>
        <h1
          className="font-semibold cursor-pointer hover:underline"
          onClick={() => navigate("/explore/featured-playlist")}
        >
          Show all
        </h1>
      </section>
      {isFeaturedPlaylistsLoading && (
        <img
          className="mx-auto w-28"
          src={LoadingAnimation}
          alt="Loading Animation"
        />
      )}
      {isFeaturedPlaylistsError && (
        <h1 className="font-semibold text-center text-white">
          Something went wrong, please try again
        </h1>
      )}
      {isFeaturedPlaylistsSuccess && (
        <>
          <section className={`grid ${gridSize} gap-4 `}>
            {featuredPlaylistsData.map((playlist) => (
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
          </section>
        </>
      )}
      {/* New Releases */}
      <section className="flex justify-between items-center text-white">
        <h1 className="my-8 text-xl font-bold">New Releases</h1>
        <h1
          className="font-semibold cursor-pointer hover:underline"
          onClick={() => navigate("/explore/new-release")}
        >
          Show all
        </h1>
      </section>
      {isNewAlbumLoading && (
        <img
          className="mx-auto w-28"
          src={LoadingAnimation}
          alt="Loading Animation"
        />
      )}
      {isNewAlbumError && (
        <h1 className="font-semibold text-center text-white">
          Something went wrong, please try again
        </h1>
      )}
      <section className={`grid ${gridSize} gap-4 `}>
        {isNewAlbumSuccess &&
          newAlbumData.albums.items.map((album) => (
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
      </section>
    </>
  );
};

export default HomePage;
