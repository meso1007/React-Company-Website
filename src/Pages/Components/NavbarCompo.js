import { NavLink } from "react-router-dom";
export default function NavbarCompo(props) {
  const navbarItems = props.NavbarItems || []; // Default to an empty array if undefined

  return (
    <nav className="navbar navbar-dark custom-bg-color ">
      <div className="container-fluid">
        <a className="navbar-brand mx-3" id="head" href="#">
          <img src="/assets/logo.png" width={70}></img>
          Magic Company Inc.
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasDarkNavbar"
          aria-controls="offcanvasDarkNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="offcanvas offcanvas-end text-bg-dark"
          tabIndex="-1"
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
        >
          <div className="offcanvas-header custom-bg-color">
            <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel head">
              Magic Company Inc.
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body custom-bg-color">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              {navbarItems.map(
                (navItem) =>
                  navItem.disFlag && (
                    <li className="nav-item">
                      <NavLink
                        className={({ isActive }) =>
                          isActive ? "nav-link active" : "nav-link"
                        }
                        aria-current="page"
                        exact="true"
                        to={navItem.link}
                        style={{ textDecoration: "none" }}
                      >
                        <span className="underline-on-hover">
                          {navItem.label}
                        </span>
                      </NavLink>
                    </li>
                  )
              )}
            </ul>
            <form className="d-flex mt-3" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
