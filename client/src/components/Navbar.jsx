import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/companies" style={styles.link}>Companies</Link>
        <Link to="/applications" style={styles.link}>Applications</Link>
        <Link to="/interviews" style={styles.link}>Interviews</Link>
      </div>

      <div style={styles.right}>
        <span style={styles.user}>Hi, {user?.name}</span>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "#222",
    color: "#fff"
  },
  left: {
    display: "flex",
    gap: "20px"
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold"
  },
  user: {
    fontSize: "14px"
  },
  button: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "5px",
    background: "#dc3545",
    color: "#fff",
    cursor: "pointer"
  }
};

export default Navbar;