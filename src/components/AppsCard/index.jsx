import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PrimaryButton from '../PrimaryButton';
import DotsImg from '../../assets/images/3dots.svg';
import deleteApp, { clearState } from '../../redux/actions/deleteApp';
import Spinner from '../SpinnerComponent';
import Modal from '../Modal';
import Status from '../Status';
import Feedback from '../Feedback';
import './AppsCard.css';

class AppsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDeleteAlert: false,
      openDropDown: false
    };

    this.handleDeleteApp = this.handleDeleteApp.bind(this);
    this.showDeleteAlert = this.showDeleteAlert.bind(this);
    this.hideDeleteAlert = this.hideDeleteAlert.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
    this.hideDropDown = this.hideDropDown.bind(this);
    this.showDropDown = this.showDropDown.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { isDeleted, hasDeleted } = this.props;

    if (isDeleted !== prevProps.isDeleted) {
      hasDeleted(true);
      this.hideDeleteAlert();
    }
  }

  showDropDown() {
    this.setState({ openDropDown: true });
  }

  toggleDropDown() {
    const { openDropDown } = this.state;
    if (openDropDown) {
      this.hideDropDown();
    } else {
      this.showDropDown();
    }
  }

  hideDropDown() {
    this.setState({ openDropDown: false });
  }

  handleDeleteApp(e, appId) {
    const {
      deleteApp
    } = this.props;
    e.preventDefault();

    deleteApp(appId);
  }


  showDeleteAlert() {
    this.setState({ openDeleteAlert: true });
  }

  hideDeleteAlert() {
    const { clearState } = this.props;
    clearState();
    this.setState({ openDeleteAlert: false });
  }

  render() {
    const {
      name, status, url, appId, isDeleting, isFailed, message
    } = this.props;
    const { openDeleteAlert, openDropDown } = this.state;
    return (
      <div className="AppCard">
        <div className="AppCardHeader">
          <table className="AppTable">
            <tr>
              <td className="AppName">{name}</td>
              <td className="OtherData">
                <div className="StatusData">
                  <Status status={status} />
                  <div
                    className="AppDropDown"
                    onClick={() => this.toggleDropDown()}
                    role="presentation"
                  >
                    <img src={DotsImg} alt="three dots" className="DropDownImg" />
                    {openDropDown && (
                      <div className="AppDropDownContent">
                        <div
                          onClick={() => this.showDeleteAlert()}
                          role="presentation"
                        >
                          Delete
                        </div>
                        <div>Update</div>
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div className="AppUrlText">Url :</div>
        <div className="AppUrl"><a target="_blank" rel="noopener noreferrer" href={url}>{url}</a></div>

        {(openDeleteAlert && (
          <div className="AppDeleteModel">
            <Modal showModal={openDeleteAlert}>
              <div className="DeleteAppModel">
                <div className="DeleteDescription">
                  Are you sure you want to delete
                  <span>
                    <b>
                      {' '}
                      {name}
                      {' '}
                    </b>
                  </span>
                  ?
                </div>
                <div className="DeleteAppModelResponses">
                  <PrimaryButton label="cancel" className="CancelBtn" onClick={this.hideDeleteAlert} />
                  <PrimaryButton label={isDeleting ? <Spinner /> : 'Delete'} onClick={(e) => this.handleDeleteApp(e, appId)} />
                </div>

                {message && (
                  <Feedback
                    type={isFailed ? 'error' : 'success'}
                    message={message}
                  />
                )}

              </div>

            </Modal>
          </div>
        ))}
      </div>
    );
  }
}

// inititate props
AppsCard.propTypes = {
  isDeleted: PropTypes.bool,
  isDeleting: PropTypes.bool,
  isFailed: PropTypes.bool,
  name: PropTypes.string.isRequired,
  status: PropTypes.bool.isRequired, // this is static
  url: PropTypes.string.isRequired,
  appId: PropTypes.string.isRequired,
  deleteApp: PropTypes.func.isRequired,
  hasDeleted: PropTypes.func.isRequired,
  clearState: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
};

// assigning defaults
AppsCard.defaultProps = {
  isDeleted: false,
  isDeleting: false,
  isFailed: false
};


const mapStateToProps = (state) => {
  const {
    isDeleting, isDeleted, isFailed, message
  } = state.deleteAppReducer;
  return {
    isDeleting, isDeleted, isFailed, message
  };
};


const mapDispatchToProps = {
  deleteApp, clearState
};

export default connect(mapStateToProps, mapDispatchToProps)(AppsCard);
