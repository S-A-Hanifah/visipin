import PlaceList from "./components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http";
import { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

export default function UserPlaces() {
  const [places, setPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await sendRequest(
          process.env.REACT_APP_URL + `api/places/user/${userId}`
        );
        setPlaces(response.places);
      } catch (error) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const deletePlaces = (deletedPlace) => {
    setPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlace)
    );
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && places && (
        <PlaceList items={places} onDeletePlace={deletePlaces} />
      )}
    </>
  );
}
