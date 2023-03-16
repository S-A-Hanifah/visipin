import { useContext, useState } from "react";
import Button from "../../../shared/components/FormElements/Button";
import Card from "../../../shared/components/UIElements/Card";
import ErrorModal from "../../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../../shared/components/UIElements/LoadingSpinner";
import Maps from "../../../shared/components/UIElements/Maps";
import Modal from "../../../shared/components/UIElements/Modal";
import { AuthContext } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http";
import "./PlaceItem.css";

export default function PlaceItem(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);

  const [confirmModal, setConfirmModal] = useState(false);

  const openMap = () => setShowMap(true);

  const closeMap = () => setShowMap(false);

  const showDeleteWarning = () => {
    setConfirmModal(true);
  };

  const cancelDeleteWarning = () => {
    setConfirmModal(false);
  };

  const deletePlace = async () => {
    setConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_URL + `api/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (error) {}
    setConfirmModal(false);
  };

  return (
    <>
      {<ErrorModal error={error} onClear={clearError} />}
      <Modal
        show={showMap}
        onCancel={closeMap}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMap}>Close</Button>}
      >
        <div className="map-container">
          <Maps center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={confirmModal}
        onCancel={cancelDeleteWarning}
        header="Do you want to delete this place forever?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteWarning}>
              Cancel
            </Button>
            <Button danger onClick={deletePlace}>
              Delete
            </Button>
          </>
        }
      >
        <p>
          <span>WARNING:</span>This cannot be recover
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`${process.env.REACT_APP_URL}${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMap}>
              View on map
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>edit</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarning}>
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </>
  );
}
