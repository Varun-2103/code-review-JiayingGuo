import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import RoommateForm from "../../components/RoommateForm/RoommateForm.jsx";
import { getRoommate, updateRoommate } from "../../api/roommatesApi.js";
import { toDateInputValue } from "../../utils/format.js";
import "./EditRoommatePage.css";

// The form keeps text in its inputs, so the budget becomes a string here.
function toFormValues(profile) {
  return {
    budget: String(profile.budget),
    moveInDate: toDateInputValue(profile.moveInDate),
    neighborhoods: profile.neighborhoods,
    sleepSchedule: profile.sleepSchedule,
    pets: profile.pets,
    smoking: profile.smoking,
    bio: profile.bio,
  };
}

function EditRoommatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState({ key: null, data: null, error: null });

  useEffect(() => {
    let ignore = false;
    getRoommate(id)
      .then((data) => {
        if (!ignore) setResult({ key: id, data, error: null });
      })
      .catch((error) => {
        if (!ignore) setResult({ key: id, data: null, error });
      });
    return () => {
      ignore = true;
    };
  }, [id]);

  async function handleSubmit(values) {
    await updateRoommate(id, values);
    navigate(`/roommates/${id}`);
  }

  if (result.key !== id) return <p className="status-message">Loading...</p>;

  if (result.error) {
    return (
      <section className="edit-roommate-page">
        <h1>
          {result.error.status === 404
            ? "Profile not found"
            : "Something went wrong"}
        </h1>
        <p className="error-message">{result.error.message}</p>
        <Link to="/roommates">Back to search</Link>
      </section>
    );
  }

  const profile = result.data;
  if (!profile.isOwner) {
    return (
      <section className="edit-roommate-page">
        <h1>You cannot edit this profile</h1>
        <p className="error-message">
          Only the student who created it can edit it.
        </p>
        <Link to={`/roommates/${id}`}>Back to the profile</Link>
      </section>
    );
  }

  return (
    <section className="edit-roommate-page">
      <h1>Edit my profile</h1>
      {/* key: a different profile starts a fresh form */}
      <RoommateForm
        key={profile._id}
        initialValues={toFormValues(profile)}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
        cancelTo={`/roommates/${id}`}
      />
    </section>
  );
}

EditRoommatePage.propTypes = {};

export default EditRoommatePage;
