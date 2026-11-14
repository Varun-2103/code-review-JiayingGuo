import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthProvider.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import SignupPage from "./pages/SignupPage/SignupPage.jsx";
import SubletsPage from "./pages/SubletsPage/SubletsPage.jsx";
import SubletDetailPage from "./pages/SubletDetailPage/SubletDetailPage.jsx";
import NewSubletPage from "./pages/NewSubletPage/NewSubletPage.jsx";
import EditSubletPage from "./pages/EditSubletPage/EditSubletPage.jsx";
import MyListingsPage from "./pages/MyListingsPage/MyListingsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/sublets" element={<SubletsPage />} />
            <Route
              path="/sublets/new"
              element={
                <ProtectedRoute>
                  <NewSubletPage />
                </ProtectedRoute>
              }
            />
            <Route path="/sublets/:id" element={<SubletDetailPage />} />
            <Route
              path="/sublets/:id/edit"
              element={
                <ProtectedRoute>
                  <EditSubletPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-listings"
              element={
                <ProtectedRoute>
                  <MyListingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

App.propTypes = {};

export default App;
