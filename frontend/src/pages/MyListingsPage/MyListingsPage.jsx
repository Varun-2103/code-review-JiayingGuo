import useAuth from "../../context/useAuth.js";

function MyListingsPage() {
  const { user } = useAuth();

  return (
    <section>
      <h1>My Listings</h1>
      <p>Signed in as {user.email}.</p>
    </section>
  );
}

MyListingsPage.propTypes = {};

export default MyListingsPage;
