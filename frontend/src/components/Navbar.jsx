
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

const Navbar = () => {
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 vw-100 d-flex justify-content-between">
			<a className="navbar-brand" href="/">ClientSync</a>
			
			<Dropdown>
				<Dropdown.Toggle id="dropdown-profile">
					<FontAwesomeIcon icon={faUser} /> Profile
				</Dropdown.Toggle>

				<Dropdown.Menu>
					<Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
					<Dropdown.Item as={Link} to="/signup">Sign Up</Dropdown.Item>
					<Dropdown.Item as={Link} to="/logout">Log out</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		</nav>
	);
};

export default Navbar;
