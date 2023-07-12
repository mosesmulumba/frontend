import React, { useState, useEffect, useCallback } from "react";
import "./AdminProjectsPage.css";
import InformationBar from "../../components/InformationBar";
import Header from "../../components/Header";
import SideNav from "../../components/SideNav";

import { ReactComponent as MoreIcon } from "../../assets/images/more-verticle.svg";

import getAdminProjects from "../../redux/actions/adminProjects";
import getUsersList from "../../redux/actions/users";
import Spinner from "../../components/Spinner";
// import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./AdminProjectsPage.css";
import { Link } from "react-router-dom";
import usePaginator from "../../hooks/usePaginator";
import Pagination from "../../components/Pagination";
import { handleGetRequest } from "../../apis/apis.js";
import { ReactComponent as SearchButton } from "../../assets/images/search.svg";


const AdminProjectsPage = () => {
  const [currentPage, handleChangePage] = usePaginator();
  const clusterID = localStorage.getItem("clusterID");
  const dispatch = useDispatch();
  const [word, setWord] = useState("");
  const [searchProjectList, setSearchProjectList] = useState([]);

  const { isRetrieved , isRetrieving, projects, pagination} = useSelector(
    (state) => state.adminProjectsReducer
  );

  const getAdminProps = useCallback(
    () => dispatch(getAdminProjects(currentPage)),
    [dispatch, currentPage]
  );
  const getUsersProps = useCallback(() => dispatch(getUsersList), [dispatch]);
 
  // const adminProjects = useSelector((state) => state.adminProjectsReducer);
  // const usersList = useSelector((state) => state.usersListReducer);
  const [contextMenu, setContextMenu] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  // const [addCredits, setAddCredits] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAdminProps();
    getUsersProps();
    fetchUsersList();
  }, [getAdminProps, getUsersProps]);

  const fetchUsersList = () => {
    handleGetRequest("/users")
      .then((response) => {
        if (response.data.data.users.length > 0) {
          let totalNumberOfUsers = response.data.data.pagination.total;
          handleGetRequest("/users?per_page=" + totalNumberOfUsers)
            .then((response) => {
              if (response.data.data.users.length > 0) {
                setUsers(response.data.data.users);
              } else {
                throw new Error("No users found");
              }
            })
            .catch((error) => {
              throw new Error("Failed to fetch all users, please try again");
            });
        } else {
          throw new Error("No users found");
        }
      })
      .catch((error) => {
        throw new Error("Failed to fetch users, please try again");
      });
  };

  const searchThroughProjects = () => {
    let resultsProjectList = [];
    projects.forEach((element) => {
      if (element.name.toLowerCase().includes(word.toLowerCase())) {
        resultsProjectList.push(element);
      }
    });
    setSearchProjectList(resultsProjectList);
  };

  const handleCallbackSearchword = ({ target }) => {
    const { value } = target;
    setWord(value);
    if (value !== "") {
      searchThroughProjects();
    }
    if (value === "") {
      setSearchProjectList([]);
    }
  };


  const getUserName = (id) => {
    let userName = "";
    users.forEach((user) => {
      if (user.id === id) {
        userName = user.name;
      }
    });
    return userName;
  };

  // const showModal = () => {
  //   setAddCredits(true);
  // };
  // const hideModal = () => {
  //   //setAddCredits(false);
  //   setContextMenu(false);
  // };

  const showContextMenu = (id) => {
    setContextMenu(true);
    setSelectedProject(id);
  };
  const clusterName = localStorage.getItem("clusterName");

  const handlePageChange = (currentPage) => {
    handleChangePage(currentPage);
    getAdminProps();
  };

  return (
    <div className="MainPage">
      <div className="TopBarSection">
        <Header />
      </div>
      <div className="MainSection">
        <div className="SideBarSection">
          <SideNav clusterName={clusterName} clusterId={clusterID} />
        </div>
        <div className="MainContentSection">
          <div className="InformationBarSection">
            <InformationBar
              header={
                <>
                  <Link
                    className="breadcrumb"
                    to={`/clusters/${clusterID}/projects`}
                  >
                    Overview
                  </Link>
                  <span> / Projects Listing</span>
                </>
              }
              showBtn={false}
            />
          </div>
          <div className="ContentSection">
            <div className="SearchBar">
              <div className="AdminSearchInput">
                <input
                  type="text"
                  className="searchTerm"
                  name="Searchword"
                  placeholder="Search for project"
                  value={word}
                  onChange={(e) => {
                    handleCallbackSearchword(e);
                  }}
                />
                <SearchButton className="SearchIcon" />
              </div>
            </div>
            <div
              className={
                isRetrieving
                  ? "ResourcesTable LoadingResourcesTable"
                  : "ResourcesTable"
              }
            >
              <table>
                <thead className="uppercase">
                  <tr>
                    <th>name</th>
                    <th>owner</th>
                    <th>description</th>
                    <th>status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {projects.isRetrieving ? (
                  <tbody>
                    <tr className="TableLoading">
                    <td className="TableTdSpinner">
                        <div className="SpinnerWrapper">
                          <Spinner size="big" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ) : word !== "" ? (
                  <tbody>
                    {isRetrieved &&
                       searchProjectList.map((project) =>(
                        <tr key={projects.indexOf(project)}>
                           <td>{project?.name}</td>
                            <td>{getUserName(project?.owner_id)}</td>
                            <td >{project?.description}</td>
                            <td>
                              {/* optional chai */}
                              <span className={project.disabled !== false ? "ProjectStatus":"ProjectStatusDisabled"}>
                                {project.disabled !== false
                                  ? "Active"
                                  : "Disabled"}
                              </span>
                            </td>
                            <td
                              onClick={(e) => {
                                showContextMenu(project.id);
                              }}
                            >
                              <MoreIcon />

                              {contextMenu && project.id === selectedProject && (
                                <div className="BelowHeader bg-light">
                                  <div className="context-menu">
                                    <div
                                      className="DropDownLink"
                                      role="presentation"
                                    >
                                      <Link
                                        to={{
                                          pathname: `/projects/${selectedProject}/details`,
                                        }}
                                      >
                                        View Project Details
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </td>
                        </tr>
                       ))

                    }
                  </tbody>
                ) : (
                  <tbody>
                    {isRetrieved &&
                      projects !== 0 &&
                      projects !== undefined &&
                      projects.map((project) => (
                        <tr key={projects.indexOf(project)}>
                          <td>{project.name}</td>
                          <td>{getUserName(project.owner_id)}</td>
                          <td >{project.description}</td>
                          <td>
                            {/* optional chai */}
                            <span className={project.disabled !== false ? "ProjectStatus":"ProjectStatusDisabled"}>
                              {project.disabled !== false
                                ? "Active"
                                : "Disabled"}
                            </span>
                          </td>
                          <td
                            onClick={(e) => {
                              showContextMenu(project.id);
                              //handleClick(e);
                            }}
                          >
                            <MoreIcon />

                            {contextMenu && project.id === selectedProject && (
                              <div className="BelowHeader bg-light">
                                <div className="context-menu">
                                  {/* <div
                                    className="DropDownLink Section"
                                    role="presentation"
                                  >
                                    Activate
                                  </div>
                                  <div
                                    className="DropDownLink"
                                    role="presentation"
                                  >
                                    Disable
                                  </div> */}
                                  <div
                                    className="DropDownLink"
                                    role="presentation"
                                  >
                                    <Link
                                      to={{
                                        pathname: `/projects/${selectedProject}/details`,
                                      }}
                                    >
                                      View Project Details
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                )}
              </table>
              {/* <Modal showModal={addCredits} onClickAway={() => hideModal()}>
                <div className="ModalHeader">
                  <h5 className="ModalTitle">Add Credits</h5>

                  <div className="">Number of credits</div>
                  <div className="ModalContent">
                    <BlackInputText required placeholder="Number of credits" />
                  </div>
                  <div className="CreditsTitle">Description</div>
                  <textarea
                    className="TextArea"
                    type="text"
                    placeholder="Credits description"
                    rows="4"
                    cols="50"
                  />
                </div>
                <div className="ModalFooter">
                  <div className="ModalButtons">
                    <PrimaryButton
                      className="CancelBtn"
                      onClick={() => hideModal()}
                    >
                     Cancel                 
                    </PrimaryButton>
                    <PrimaryButton type="button"  >
                      Add
                    </PrimaryButton>
                  </div>
                </div>
              </Modal> */}
              {isRetrieved &&
                projects.length === 0 && (
                  <div className="NoResourcesMessage">
                    <p>No projects available</p>
                  </div>
                )}
              {!isRetrieving && !isRetrieved && (
                <div className="NoResourcesMessage">
                  <p>
                    Oops! Something went wrong! Failed to retrieve projects.
                  </p>
                </div>
              )}
            </div>
            {pagination?.pages > 1 && (
              <div className="AdminPaginationSection">
                <Pagination
                  total={pagination.pages}
                  current={currentPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectsPage;
