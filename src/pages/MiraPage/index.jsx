import React, { useState, useRef } from "react";
//import axios from "axios";
import Dropzone from "../../components/DropZone";
import styles from "./MiraPage.module.css";
import BlackInputText from "../../components/BlackInputText";
import Select from "../../components/Select";
import PrimaryButton from "../../components/PrimaryButton";
import Tooltip from "../../components/Tooltip";
import { MIRA_API_URL } from "../../config";
import Spinner from "../../components/Spinner";
import { retrieveFrameworkChoices } from "../../helpers/frameworkChoices";
import { retrieveRegistryChoices } from "../../helpers/registryChoices";


const MiraPge = ({ projectID }) => {
  const frameworks = retrieveFrameworkChoices();
  const registries = retrieveRegistryChoices();
  const logsSectionRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [framework, setFramework] = useState("");
  const [registry, setRegistry] = useState("");
  const [image, setImage] = useState({
    name: "",
    version: "",
  });
  const [loading, setLoader] = useState(false);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);

  const getPathName = (path) => {
    let filePath = path.replaceAll("/", "|").replace("|", "");
    filePath = filePath.substring(filePath.indexOf("|")).replace("|", "");
    return filePath;
  };
  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (error) {
      setError("");
    }
    setImage({
      ...image,
      [name]: value,
    });
  };
  const handleDropdownChange = (selected) => {
    setFramework(selected.value);
  };

  const handleRegistryDropdownChange = (selected) => {
    setRegistry(selected.value);
  };

  const handleSubmit = async () => {
    setLoader(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    const { name, version } = image;
    for (const file of files) {
      const { path } = file;
      formData.append("files", file, getPathName(path));
    }
    formData.append("name", name);
    formData.append("tag", version);
    formData.append("framework", framework);
    formData.append("token", token);
    formData.append("project", projectID);
    formData.append("registry", registry);

    // axios
    //   .post(`${MIRA_API_URL}/containerize`, formData)
    //   .then(res => {
    //     setLoader(false);
    //     console.log(res)
    //    // window.location.href = `/projects/${projectID}/Apps`;
    //   })
    //   .catch(error => {
    //     console.log(error)
    //     setLoader(false);
    //     setError("failed to deploy");
    //   });
    if (logsSectionRef.current) {
      logsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    //since it is stream data it will always return 200

    fetch(`${MIRA_API_URL}/containerize`, {
      method: 'POST',
      body: formData
    }).then((response) => {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const readStream = () => {
      reader.read().then(({ done, value }) => {
        if (done) {
          console.log('Stream complete');
          setLoader(false);
          return;
        }
        const str = decoder.decode(value);
        const regex = /{"timestamp":"(.*?)","message":"(.*?)"}(?={|$)/g;
        let match;
        while ((match = regex.exec(str)) !== null) {
          const timestamp = match[1]; 
          const message = match[2]; 
          setLogs((prevLogs) => [...prevLogs, {timestamp: timestamp, message: message}])
        }
       
        readStream();
      }).catch((error) => {
        console.error('Error reading stream:', error);
      });
    };
    // Start consuming the stream
    readStream();
  })
  .catch((error) => {
    console.error('Fetch error:', error);
  });
  };

  return (
    <div className={styles.CreateFormHolder}>
      <div className={styles.FormInputs}>
        <div className={styles.FormHeading}>Fields marked * are required</div>
        <div className={styles.FrameworkSelect}>
          <Select
            placeholder="Choose a framework"
            options={frameworks}
            onChange={handleDropdownChange}
          />
        </div>
        {framework === "Django" && (
          <div>
            If deploying a Django app also see these additional pre-deployment
            <a href="https://docs.google.com/document/d/1-zqaLC4x4yZflRS-LMhycVbhpCEvyId0smaqAwC5TBE/edit?usp=sharing">
              instructions
            </a>{" "}
          </div>
        )}
        {framework === "Laravel-custom" && (
          <div>
            Please make sure your project has a custom dockerfile added in the
            root of your Laravel app<br></br>
            <a href="https://medium.com/cranecloud/dockerizing-a-laravel-application-36b5ccd23691">
              Take an example
            </a>{" "}
            <br></br> Be sure to use your current version of laravel in your
            dockerfile{" "}
          </div>
        )}
        <div className={styles.RegistrySelect}>
          <Select
            placeholder="Select a registry"
            options={registries}
            onChange={handleRegistryDropdownChange}
          />
        </div>
        <div className={styles.FormFieldWithTooltip}>
          <BlackInputText
            required
            name="name"
            placeholder="Image Name"
            onChange={handleChange}
            value={image.name}
          />
          <div className={styles.FormInputTooltipContainer}>
            <Tooltip
              showIcon
              message="This is the image repository for your image"
              position="left"
            />
          </div>
        </div>
        <div className={styles.FormFieldWithTooltip}>
          <BlackInputText
            placeholder="Version"
            name="version"
            onChange={handleChange}
            value={image.version}
          />
          <div className={styles.FormInputTooltipContainer}>
            <Tooltip
              showIcon
              message="This is preferably a tag for your image"
              position="left"
            />
          </div>
        </div>

        <div className={styles.HeadingWithTooltip}>
          <h4>Upload Zip file</h4>
          <Tooltip
            showIcon
            message="This is the zipped folder containing your source code"
          />
        </div>
        <div className={styles.DropSection}>
          <div className={styles.Dropzone}>
            <Dropzone handleDrop={(files) => setFiles(files)} />
          </div>
        </div>
        {error && <div className="LoginErrorDiv">{error}</div>}
        <div className={styles.ButtonSection}>
          <PrimaryButton className="AuthBtn FullWidth" onClick={handleSubmit}>
            {loading ? <Spinner /> : "Deploy"}
          </PrimaryButton>
        </div>
      </div>
      <h2 >Mira Logs</h2>
      <div className={`${styles.MiraLogsFrameContainer}`}>
      <div className={'LogsBodySection Dark'}  ref={logsSectionRef}>
        <div className={'LogsAvailable'}>
          _/
          {logs.map((log, index) => (
            <div key={index} className={`LogsAvailable`}>
              <div className={styles.logItem}>
              <span className={styles.logItemTitle}>{new Date(log.timestamp).toLocaleTimeString()}</span>
              <p>{log.message}</p>
              {/* {log} */}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default MiraPge;
