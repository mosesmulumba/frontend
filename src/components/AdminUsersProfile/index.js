import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import addUserCredits from "../../redux/actions/addCredits";
import "./AdminUserPage.css";
import Header from "../Header";
import Spinner from "../Spinner";
import InformationBar from "../InformationBar";
import SideNav from "../SideNav";
import Modal from "../Modal";
import { ReactComponent as Coin } from "../../assets/images/coin.svg";
import { ReactComponent as MoreIcon } from "../../assets/images/more-verticle.svg";
import SettingsButton from "../SettingsButton";
import addBetaUser from "../../redux/actions/addBetaUser";
import adminGetUserCredits, {clearUserCredits} from "../../redux/actions/adminGetUserCredits";
import Feedback from "../Feedback";
import {
  getUser,
  nameStringToHslColor,
  avatarName,
} from "../../helpers/projectName";

class AdminUserPage extends Component {
  constructor() {
    super();
    this.state = {
      actionsMenu: false,
      betaUserModal: false,
      addCredits: false,
      credits: "",
      creditDescription: "",
      selectedUser: "",
    };
    this.showMenu = this.showMenu.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleBetaUserSubmit = this.handleBetaUserSubmit.bind(this);
    this.closeBetaUserModal = this.closeBetaUserModal.bind(this);
    this.showBetaUserModal = this.showBetaUserModal.bind(this);
    this.renderRedirect = this.renderRedirect.bind(this);
    this.hideCreditsModal = this.hideCreditsModal.bind(this);
    this.showCreditsModal = this.showCreditsModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCreditSubmittion = this.handleCreditSubmittion.bind(this);
  }
  componentDidMount() {
    const {
      getUsersList,
      adminGetUserCredits,
      clearUserCredits,
      match: { params },
    } = this.props;
    // getUsersList();
    clearUserCredits();
    adminGetUserCredits(params.userID);
  }

  // componentDidUpdate(prevProps) {
  //   const { getUsersList, isAdded, Added } = this.props;
  //   if (isAdded !== prevProps.isAdded) {
  //     getUsersList();
  //     this.closeBetaUserModal();
  //   }
  //   if (Added !== prevProps.Added) {
  //     getUsersList();
  //     this.hideCreditsModal();
  //   }
  // }

  // componentWillUnmount() {
  //   // fix Warning: Can't perform a React state update on an unmounted component
  //   this.setState = (state, callback) => {
  //     return;
  //   };
  // }
  handleClick = (e) => {
    if (this.state.actionsMenu) {
      // this.closeModal();
      return;
    }
    this.setState({ actionsMenu: true });
    e.stopPropagation();
    document.addEventListener("click", this.hideModal);
  };

  hideModal = () => {
    this.setState({ actionsMenu: false });
    document.removeEventListener("click", this.hideModal);
  };

  showMenu(id) {
    this.setState({
      selectedUser: id,
    });
  }

  showBetaUserModal() {
    this.setState({
      betaUserModal: true,
    });
  }
  handleCreditSubmittion() {
    const { credits, creditDescription, selectedUser } = this.state;
    const { addUserCredits } = this.props;
    if (credits !== "" && creditDescription !== "") {
      const creditsObject = {
        amount: credits,
        description: creditDescription,
        user_id: selectedUser,
      };
      addUserCredits(creditsObject);
    }
  }
  showCreditsModal() {
    this.setState({
      addCredits: true,
    });
  }
  hideCreditsModal = () => {
    this.setState({
      addCredits: false,
      actionsMenu: false,
    });
  };

  closeBetaUserModal() {
    this.setState({
      betaUserModal: false,
    });
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleBetaUserSubmit() {
    const { selectedUser } = this.state;
    const { addBetaUser } = this.props;
    const betaUser = {
      is_beta_user: true,
      user_id: selectedUser,
    };
    addBetaUser(betaUser);
  }

  renderRedirect = () => {
    const { isAdded } = this.props;

    if (isAdded) {
      return <Redirect to={`/accounts`} noThrow />;
    }
  };

  render() {
    const {
      users,
      isFetched,
      isFetching,
      isAdding,
      isFailed,
      error,
      isAdded,
      Adding,
      Failed,
      userCredits,
      isFetchingCredits,
      creditsFetched,
    } = this.props;
    const clusterName = localStorage.getItem("clusterName");
    const {
      match: { params },
    } = this.props;
    const {
      actionsMenu,
      selectedUser,
      betaUserModal,
      credits,
      creditDescription,
    } = this.state;
    const user = getUser(users, params.userID);
    console.log(userCredits);
    return (
      <div className="MainPage">
        {isAdded ? this.renderRedirect() : null}
        <div className="TopBarSection">
          <Header />
        </div>
        <div className="MainSection">
          <div className="SideBarSection">
            <SideNav clusterName={clusterName} clusterId={params.clusterID} />
          </div>
          <div className="MainContentSection">
            <div className="InformationBarSection">
              <InformationBar
                header={`Accounts/${user.name}`}
                showBtn={false}
              />
            </div>
            <div className="ContentSection">
              <div className="AdminUserPageContainer">
                <div className="UserProfile">
                  <div className="UserProfileIcon">
                    <div
                      className="UserAvatar"
                      style={{
                        backgroundColor: nameStringToHslColor(user.name),
                        color: "#555",
                      }}
                    >
                      {/* {user.name.charAt(0).toUpperCase()} */}
                      {avatarName(user.name)}
                    </div>
                  </div>
                  <div className="UserProfileInfo">
                    <div className="ProfileInfoRow">
                      <div className="ProfileInfoAttribute">Name:</div>
                      <div className="ProfileInfoValue">{user.name}</div>
                    </div>
                    <div className="ProfileInfoRow">
                      <div className="ProfileInfoAttribute">Email:</div>
                      <div className="ProfileInfoValue">{user.email}</div>
                    </div>
                    <div className="ProfileInfoRow">
                      <div className="ProfileInfoAttribute">User Role:</div>
                      <div className="ProfileInfoValue">
                        {user.roles.length > 0 ? user.roles[0].name : "None"}
                      </div>
                    </div>
                    <div className="ProfileInfoRow">
                      <div className="ProfileInfoAttribute">Beta User:</div>
                      <div className="ProfileInfoValue">
                        {user.is_beta_user ? "True" : "False"}
                      </div>
                    </div>
                    <div className="ProfileInfoRow">
                      <div className="ProfileInfoAttribute">Verified:</div>
                      <div className="ProfileInfoValue">
                        {user.verified ? "True" : "False"}
                      </div>
                    </div>
                    <div className="ProfileInfoRow">
                      <div className="ProfileInfoAttribute">Credits:</div>
                      <div className=" CreditsButton">
                        <div className="CreditsWrap">
                          {user.credits.length > 0 ? user.credits[0].amount : 0}
                          <Coin />
                        </div>
                        <>
                          <SettingsButton label="Add Credits" className="BlueButton"/>
                        </>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="CreditsAlotted">
                  <div className="CreditsTable">
                    <div className="CreditsHeader">
                      Credits Assignment History
                    </div>
                    <div className="Credits">
                      <div className="CreditsHead">
                        <div className="CreditsHeaderRow">
                          <div className="CreditsHeaderAttribute">
                            Record ID
                          </div>
                          <div className="CreditsHeaderAttribute">
                            Date
                          </div>
                          <div className="CreditsHeaderAttribute">
                            Amount
                          </div>
                          <div className="CreditsHeaderAttribute">
                            Description
                          </div>
                        </div>
                      </div>
                      <div className="CreditsBody">
                        {userCredits.length > 0 ? (
                          userCredits.map((credit) => (
                            <div className="CreditsRow">
                              <div className="CreditsRowAttribute">
                                {credit.id}
                              </div>
                              <div className="CreditsRowAttribute">
                                {credit.created_at}
                              </div>
                              <div className="CreditsRowAttribute">
                                {credit.amount}
                              </div>
                              <div className="CreditsRowAttribute">
                                {credit.description}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="CreditsError">
                            <div className="">
                              No Credits Assigned.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                    
                {!isFetching && !isFetched && (
                  <div className="NoResourcesMessage">
                    <p>
                      Oops! Something went wrong! Failed to retrieve User
                      Profile.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// inititate props
AdminUserPage.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object),
  isFetching: PropTypes.bool,
  isFetched: PropTypes.bool,
};

// assigning defaults
AdminUserPage.defaultProps = {
  users: [],
  isFetching: false,
  isFetched: false,
};

export const mapStateToProps = (state) => {
  const { isFetching, users, isFetched } = state.usersListReducer;
  const { isAdded, isAdding, isFailed, error } = state.addBetaUserReducer;
  const { Added, Adding, Failed } = state.addUserCreditsReducer;
  const { userCredits, creditsFetched, isFetchingCredits, clearUserCredits } =
    state.adminGetUserCreditsReducer;
  return {
    isFetching,
    users,
    isFetched,
    isAdded,
    isAdding,
    isFailed,
    error,
    Added,
    Adding,
    Failed,
    userCredits,
    creditsFetched,
    isFetchingCredits,
    clearUserCredits
  };
};

const mapDispatchToProps = {
  addBetaUser,
  addUserCredits,
  adminGetUserCredits,
  clearUserCredits,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminUserPage);
