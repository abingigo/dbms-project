import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import trashIcon from "../../icons/trash.svg";
import expandIcon from "../../icons/expand.svg";
import NewMemberModal from "./NewMemberModal";
import NewEventModal from "./NewEventModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ClubAdminPanel = () => {
  const { userToken } = useContext(AppContext);
  const [clubInfo, setClubInfo] = useState(null);
  const [description, setDescription] = useState("");
  const [isDeletingMembers, setIsDeletingMembers] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate("/");
    }
    if (isAddingMember || isCreatingEvent) return;
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/club_info", {
        headers: { Authorization: `Bearer ${userToken}` },
      })
      .then((res) => {
        setClubInfo(res.data.info);
        setDescription(res.data.info.club_desc);
      });
  }, [isAddingMember, isCreatingEvent, navigate, userToken]);

  const onDescriptionUpdate = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + "club_edit",
          {
            club_name: clubInfo.club_name,
            club_desc: description,
          },
          { headers: { Authorization: `Bearer ${userToken}` } }
        )
        .then((res) => {
          setClubInfo({ ...clubInfo, club_desc: description });
        });
    },
    [description, clubInfo, userToken]
  );

  const onDeleteMember = useCallback(
    (roll_no) => {
      axios
        .post(
          process.env.REACT_APP_BACKEND_URL + "club_member_delete",
          { roll_no },
          { headers: { Authorization: `Bearer ${userToken}` } }
        )
        .then(() => {
          setClubInfo({ ...clubInfo, members: clubInfo.members.filter(({ roll_no: r }) => r !== roll_no) });
        });
    },
    [clubInfo, userToken]
  );

  return (
    <div className="p-4 text-white">
      <h1>
        <b>{clubInfo?.club_name}</b>
      </h1>
      <textarea
        className="form-control bg-transparent text-white"
        rows="3"
        placeholder="<club description here>"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button
        variant={clubInfo?.club_desc === description ? "secondary" : "info"}
        disabled={clubInfo?.club_desc === description}
        className="float-end mt-1"
        onClick={onDescriptionUpdate}
      >
        Save Changes
      </Button>
      <br />
      <br />
      <div className="collapse-cards">
        <div>
          <h3>Members</h3>
          <div className="overflow-auto" style={{ height: "500px" }}>
            {clubInfo?.members.map(({ name, roll_no, position }) => {
              return (
                <Card className="w-100 mb-2 text-black">
                  <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text className="float-start">
                      {roll_no}
                      <br />
                      {position}
                    </Card.Text>
                    <Card.Text className="float-end">
                      {isDeletingMembers && (
                        <input
                          alt="delete"
                          type="image"
                          src={trashIcon}
                          style={{ height: "20px" }}
                          onClick={() => onDeleteMember(roll_no)}
                        />
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
          <Button variant="success" className="float-end mt-2" onClick={() => setIsAddingMember(true)}>
            Add New Member
          </Button>
          <Button
            variant="danger"
            className="float-end mt-2 me-2"
            onClick={(e) => {
              e.preventDefault();
              setIsDeletingMembers(!isDeletingMembers);
            }}
          >
            {isDeletingMembers ? "Return" : "Delete Members"}
          </Button>
        </div>
        <div>
          <h3>Events</h3>
          <div className="overflow-auto" style={{ height: "500px" }}>
            {clubInfo?.events.map(({ event_name, date, slot, event_id }) => {
              return (
                <Card className="w-100 mb-2 text-black">
                  <Card.Body>
                    <Card.Title>{event_name}</Card.Title>
                    <Card.Text className="float-start m-0">
                      {date.substring(0, date.indexOf("00:00:00"))}
                      <br />
                      {slot}
                    </Card.Text>
                    <input
                      alt="expand"
                      type="image"
                      src={expandIcon}
                      className="float-end"
                      style={{ height: "20px" }}
                      onClick={() => navigate(`${event_id}`)}
                    />
                  </Card.Body>
                </Card>
              );
            })}
          </div>
          <Button variant="success" className="float-end mt-2" onClick={() => setIsCreatingEvent(true)}>
            Create New Event
          </Button>
        </div>
      </div>
      <NewMemberModal show={isAddingMember} onHide={() => setIsAddingMember(false)} />
      <NewEventModal show={isCreatingEvent} onHide={() => setIsCreatingEvent(false)} />
    </div>
  );
};
export default ClubAdminPanel;
