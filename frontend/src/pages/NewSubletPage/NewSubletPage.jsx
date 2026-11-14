import { useNavigate } from "react-router-dom";
import SubletForm from "../../components/SubletForm/SubletForm.jsx";
import { createSublet } from "../../api/subletsApi.js";

function NewSubletPage() {
  const navigate = useNavigate();

  async function handleSubmit(values) {
    const created = await createSublet(values);
    navigate(`/sublets/${created._id}`);
  }

  return (
    <section className="narrow-page">
      <h1>Post a sublet</h1>
      <p className="status-message">
        Students who are logged in will see your name and email on the listing.
      </p>
      <SubletForm onSubmit={handleSubmit} submitLabel="Post listing" />
    </section>
  );
}

NewSubletPage.propTypes = {};

export default NewSubletPage;
