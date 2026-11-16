import { useNavigate } from "react-router-dom";
import RoommateForm from "../../components/RoommateForm/RoommateForm.jsx";
import { createRoommate } from "../../api/roommatesApi.js";
import "./NewRoommatePage.css";

function NewRoommatePage() {
  const navigate = useNavigate();

  // A student who already has a profile gets a 409 message from the server.
  async function handleSubmit(values) {
    const created = await createRoommate(values);
    navigate(`/roommates/${created._id}`);
  }

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
