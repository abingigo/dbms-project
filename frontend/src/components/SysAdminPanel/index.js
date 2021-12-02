import Card from "react-bootstrap/Card";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../App";


const SysAdminPanel = () => {

  const [clubs,setClubs] = useState([]);
  const [venues,setVenues] = useState([]);
  const {userToken} = useContext(AppContext);

  //get the events the student is registered to
  useEffect(() => {
    axios
    .get(process.env.REACT_APP_BACKEND_URL + "clubs_all")
    .then((res) => {
      setClubs(res.data.clubs);
    });

    axios
    .get(process.env.REACT_APP_BACKEND_URL + "venues_all",  {
      headers: { Authorization: `Bearer ${userToken}` },
    })
    .then((res) => {
      setVenues(res.data.venues);
    });
  },[]);

  return (
    <>
      <div className="collapse-cards">
        <div>
          <h3 className="text-white p-3">Clubs</h3>
          <div style={{ height: "500px", width: "500px" }}>
            {clubs.map(({ club_name, club_desc }) => {
              return (
                <Card className="w-100 mb-2 text-black">
                  <Card.Body>
                    <Card.Title>{club_name}</Card.Title>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
          </div>

          <div>
          <h3 className="text-white p-3">Venues</h3>
          <div style={{ height: "500px", width: "500px" }}>
            {venues.map(({ venue_name }) => {
              return (
                <Card className="w-100 mb-2 text-black">
                  <Card.Body>
                    <Card.Title>{venue_name}</Card.Title>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default SysAdminPanel;