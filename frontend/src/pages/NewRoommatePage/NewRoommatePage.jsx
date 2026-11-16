import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoommateForm from "../../components/RoommateForm/RoommateForm.jsx";
import { createRoommate, getMyRoommate } from "../../api/roommatesApi.js";
import "./NewRoommatePage.css";

function NewRoommatePage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  // Each student has one profile. If they already have it, open its edit
  // page instead of a form the server would refuse with 409.
  useEffect(() => {
    let ignore = false;
    getMyRoommate()
      .then((mine) => {
        if (ignore) return;
        if (mine) navigate(`/roommates/${mine._id}/edit`, { replace: true });
        else setChecked(true);
      })
      .catch(() => {
        // Show the form anyway. The server still checks on submit.
        if (!ignore) setChecked(true);
      });
    return () => {
      ignore = true;
    };
  }, [navigate]);

  // A profile made in another tab still gets a 409 message from the server.
  async function handleSubmit(values) {
    const created = await createRoommate(values);
    navigate(`/roommates/${created._id}`);
  }

  if (!checked) return <p className="status-message">Loading...</p>;

  return (
    <section className="new-roommate-page">
      <h1>Create my roommate profile</h1>
      <p className="status-message">
        Students who are logged in will see your name and email on your profile.
      </p>
      <RoommateForm
        onSubmit={handleSubmit}
        submitLabel="Create profile"
        cancelTo="/roommates"
      />
    </section>
  );
}

NewRoommatePage.propTypes = {};

export default NewRoommatePage;
