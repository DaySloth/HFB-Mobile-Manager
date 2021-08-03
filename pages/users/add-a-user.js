import Head from "next/head";
import { useEffect, useState, useContext } from "react";
import {
  Button,
  Form,
  Message,
  Checkbox,
  Header,
  Icon,
  Label,
} from "semantic-ui-react";
import styles from "../../styles/Home.module.css";
import axios from "axios";
import NavHeader from "../../components/header";
import { useSession } from "next-auth/client";
import Loader from "../../components/loader";
import ThemeContext from "../../util/context/darkTheme";

export default function SignUp() {
  const { darkTheme } = useContext(ThemeContext);
  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        window.location.href = "/authorize/signin";
      }
    }
  }, [loading]);

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [tempPassword, setTempPassword] = useState(false);
  const [webAccess, setWebAccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [pageMessage, setPageMessage] = useState();

  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    if (confirmPassword) {
      if (confirmPassword !== password) {
        setPasswordError("Passwords do not match");
      } else if (confirmPassword === password) {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
  }, [confirmPassword]);

  const createUser = async (event) => {
    event.preventDefault();
    setPageMessage("");
    setButtonLoading(!loading);
    if (
      tempPassword ||
      (!passwordError &&
        first_name &&
        last_name &&
        email &&
        password &&
        confirmPassword)
    ) {
      //call to create user
      let newUser = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_number: phone_number,
        password: password,
        isTempPassword: tempPassword,
        hasWebAccess: webAccess,
      };

      try {
        const { data } = await axios.post("/api/mobile/users/create", newUser);
        setButtonLoading(false);
        console.log(data);
        if (data.status) {
          if (data.status === 400) {
            //set error message
            setPageMessage({
              color: "red",
              message: data.message,
            });
          } else if (data.status === 200) {
            //set success message
            clearForm();
            setPageMessage({
              color: "green",
              message: data.message,
            });
          }
        }
      } catch (error) {
        //set error message
        setButtonLoading(false);
        setPageMessage({
          color: "red",
          message: "A server error occured, please try again in a minute",
        });
      }
    } else {
      //error
      setPageMessage({
        color: "red",
        message: "Please finish filling out the form",
      });
      setButtonLoading(false);
    }
  };

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPageMessage("");
    setTempPassword(false);
    setWebAccess(false);
  };

  const css = `
    .hidden {
      display: none;
    }
  `;
  const darkcss = `
    .hidden {
      display: none;
    }

    body{
      background-color: #484848 !important
    }
  `;

  return (
    <>
      <style>{darkTheme ? darkcss : css}</style>
      {loading && <Loader />}
      {session && (
        <>
          <Head>
            <title>HFB Mobile Manager</title>
          </Head>

          <NavHeader />

          <div className={styles.center}>
            <Header as="h2" icon inverted={darkTheme}>
              <Icon name="add user" />
              Add a User
            </Header>
          </div>

          <hr />

          <div className={styles.container}>
            <Form>
              <Form.Input
                icon="user"
                iconPosition="left"
                label={
                  <label
                    className={
                      darkTheme ? styles.whiteLabel : styles.blackLabel
                    }
                  >
                    First Name
                  </label>
                }
                type="text"
                placeholder="First name"
                onChange={(event) => setFirstName(event.target.value)}
                value={first_name}
                required
                className={styles.whiteLabel}
              />

              <Form.Input
                label={
                  <label
                    className={
                      darkTheme ? styles.whiteLabel : styles.blackLabel
                    }
                  >
                    Last Name
                  </label>
                }
                type="text"
                placeholder="Last name"
                onChange={(event) => setLastName(event.target.value)}
                value={last_name}
                required
                inverted={darkTheme}
              />

              <Form.Input
                label={
                  <label
                    className={
                      darkTheme ? styles.whiteLabel : styles.blackLabel
                    }
                  >
                    Email
                  </label>
                }
                type="email"
                placeholder="User@email.com"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                required
                inverted={darkTheme}
              />

              <Form.Input
                label={
                  <label
                    className={
                      darkTheme ? styles.whiteLabel : styles.blackLabel
                    }
                  >
                    Phone Number
                  </label>
                }
                type="tel"
                onChange={(event) => setPhoneNumber(event.target.value)}
                value={phone_number}
                required
                inverted={darkTheme}
              />

              <div className={styles.block}>
                <Checkbox
                  label={
                    <label
                      className={
                        darkTheme ? styles.whiteLabel : styles.blackLabel
                      }
                    >
                      Temporary Password
                    </label>
                  }
                  className={styles.topBottomSpacing}
                  onChange={() => setTempPassword(!tempPassword)}
                  checked={tempPassword}
                />
              </div>
              <div className={styles.block}>
                <Checkbox
                  label={
                    <label
                      className={
                        darkTheme ? styles.whiteLabel : styles.blackLabel
                      }
                    >
                      Has Web Manager Access?
                    </label>
                  }
                  className={styles.topBottomSpacing}
                  onChange={() => setWebAccess(!webAccess)}
                  checked={webAccess}
                />
              </div>

              {!tempPassword && (
                <>
                  <Form.Input
                    icon="lock"
                    iconPosition="left"
                    label={
                      <label
                        className={
                          darkTheme ? styles.whiteLabel : styles.blackLabel
                        }
                      >
                        Password
                      </label>
                    }
                    type="password"
                    onChange={(event) => setPassword(event.target.value)}
                    className={passwordError && styles.redGlowingBorder}
                    value={password}
                    required
                    inverted={darkTheme}
                  />

                  <Form.Input
                    icon="lock"
                    iconPosition="left"
                    label={
                      <label
                        className={
                          darkTheme ? styles.whiteLabel : styles.blackLabel
                        }
                      >
                        Confirm Password
                      </label>
                    }
                    type="password"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    value={confirmPassword}
                    className={passwordError && styles.redGlowingBorder}
                    required
                    inverted={darkTheme}
                  />
                </>
              )}

              {passwordError && (
                <>
                  <h5 className={styles.redText}>{passwordError}</h5>
                </>
              )}
              {pageMessage && (
                <>
                  <Message color={pageMessage.color}>
                    <Message.Header>{pageMessage.message}</Message.Header>
                  </Message>
                </>
              )}

              <div className={styles.center} style={{ width: "300px" }}>
                <Button
                  content="Create User"
                  onClick={(e) => {
                    createUser(e);
                  }}
                  primary
                  className={styles.floatLeft}
                  style={{ width: "45%" }}
                  loading={buttonLoading}
                />

                <Button
                  content="Clear Form"
                  onClick={(e) => {
                    e.preventDefault();
                    clearForm();
                  }}
                  standard="true"
                  className={styles.floatRight}
                  style={{ width: "45%" }}
                />
              </div>
            </Form>
          </div>
        </>
      )}
    </>
  );
}
