import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SubletForm from "../../components/SubletForm/SubletForm.jsx";
import { getSublet, updateSublet } from "../../api/subletsApi.js";
import { toDateInputValue } from "../../utils/format.js";

// The form keeps text in its inputs, so numbers become strings here.
function toFormValues(sublet) {
  return {
    title: sublet.title,
    neighborhood: sublet.neighborhood,
    rent: String(sublet.rent),
    startDate: toDateInputValue(sublet.startDate),
    endDate: toDateInputValue(sublet.endDate),
    furnished: sublet.furnished,
    commuteMinutes: String(sublet.commuteMinutes),
    photoUrl: sublet.photoUrl ?? "",
    description: sublet.description,
  };
}

function EditSubletPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState({ key: null, data: null, error: null });

  useEffect(() => {
    let ignore = false;
    getSublet(id)
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
    await updateSublet(id, values);
    navigate(`/sublets/${id}`);
  }

  if (result.key !== id) return <p className="status-message">Loading...</p>;

  if (result.error) {
    return (
      <section className="narrow-page">
        <h1>
          {result.error.status === 404
            ? "Listing not found"
            : "Something went wrong"}
        </h1>
        <p className="error-message">{result.error.message}</p>
        <Link to="/my-listings">Back to My Listings</Link>
      </section>
    );
  }

  const sublet = result.data;
  if (!sublet.isOwner) {
    return (
      <section className="narrow-page">
        <h1>You cannot edit this listing</h1>
        <p className="error-message">
          Only the student who posted it can edit it.
        </p>
        <Link to={`/sublets/${id}`}>Back to the listing</Link>
      </section>
    );
  }

  return (
    <section className="narrow-page">
      <h1>Edit listing</h1>
      {/* key: a different listing starts a fresh form */}
      <SubletForm
        key={sublet._id}
        initialValues={toFormValues(sublet)}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
    </section>
  );
}

EditSubletPage.propTypes = {};

export default EditSubletPage;
