import Head from "next/head";
import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Message,
  Checkbox,
  Header,
  Icon,
  Segment,
} from "semantic-ui-react";
import styles from "../../../styles/Home.module.css";
import axios from "axios";
import NavHeader from "../../../components/header";
import { useSession } from "next-auth/client";
import Loader from "../../../components/loader";
import { useRouter } from "next/router";

export default function EditUser({ dbUser }) {
  const Router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        window.location.href = "/authorize/signin";
      }
    }
  }, [loading]);

  const user = dbUser || {};

  const [first_name, setFirstName] = useState(user.first_name);
  const [last_name, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [phone_number, setPhoneNumber] = useState(user.phone_number);
  const [resetPassword, setResetPassword] = useState(user.tempPassword);
  const [webAccess, setWebAccess] = useState(user.hasWebAccess);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState();
  const [pageMessage, setPageMessage] = useState();
  const [isDifferent, setIsDifferent] = useState(false);

  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    if (
      first_name !== user.first_name ||
      last_name !== user.last_name ||
      email !== user.email ||
      webAccess !== user.hasManagerAccess ||
      resetPassword
    ) {
      setIsDifferent(true);
    } else {
      setIsDifferent(false);
    }
  }, [first_name, last_name, email, webAccess, resetPassword]);

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

  async function saveEdit(e) {
    e.preventDefault();
    setButtonLoading(true);
    setPageMessage("");
    setPasswordError("");

    const updatedUser = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone_number: phone_number,
      hasManagerAccess: webAccess,
      tempPassword: resetPassword,
    };
  }

  async function removeUser(e) {
    e.preventDefault();
    const { data } = await axios.get(
      `/api/mobile/users/delete/${first_name.toLowerCase()}${last_name.toLowerCase()}`
    );
    if (data.status) {
      if (data.status === 400) {
        //set error message
        setPageMessage({
          color: "red",
          message: data.message,
        });
        setButtonLoading(false);
      } else if (data.status === 200) {
        //set success message
        setPageMessage({
          color: "green",
          message: data.message,
        });
        setButtonLoading(false);
        window.location.href = "/";
      }
    }
  }

  return (
    <>
      {loading && <Loader />}
      {session && (
        <>
          <Head>
            <title>HFB Mobile Manager</title>
          </Head>

          <NavHeader />

          <div className={styles.center}>
            <Header as="h2" icon>
              <Icon name="edit outline" />
              Edit User
            </Header>
          </div>

          <hr />

          <div className={styles.container}>
            {user.first_name ? (
              <Form>
                <Form.Input
                  icon="user"
                  iconPosition="left"
                  label="First Name"
                  type="text"
                  placeholder="First name"
                  onChange={(event) => setFirstName(event.target.value)}
                  value={first_name}
                  required
                />
                <Form.Input
                  label="Last Name"
                  type="text"
                  placeholder="Last name"
                  onChange={(event) => setLastName(event.target.value)}
                  value={last_name}
                  required
                />
                <Form.Input
                  label="Email"
                  type="email"
                  placeholder="User@email.com"
                  onChange={(event) => setEmail(event.target.value)}
                  value={email}
                  required
                />

                <Form.Input
                  label="Phone Number"
                  type="tel"
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  value={phone_number}
                  required
                />
                <div className={styles.block}>
                  <Checkbox
                    label="Has Web Manager Access"
                    className={styles.topBottomSpacing}
                    onChange={() => setWebAccess(!webAccess)}
                    checked={webAccess}
                  />
                </div>

                {pageMessage && (
                  <>
                    <Message color={pageMessage.color}>
                      <Message.Header>{pageMessage.message}</Message.Header>
                    </Message>
                  </>
                )}
                <div className={styles.center} style={{ width: "400px" }}>
                  <Button.Group>
                    <Button
                      icon="trash"
                      content="Delete User"
                      color="red"
                      onClick={(e) => {
                        removeUser(e);
                      }}
                    />
                    <Button
                      content={
                        resetPassword ? "Cancel Reset" : "Reset Password"
                      }
                      onClick={(e) => {
                        setResetPassword(!resetPassword);
                      }}
                      color={resetPassword ? "blue" : "orange"}
                    />

                    {isDifferent && (
                      <Button
                        icon="save"
                        color="green"
                        content="Save Edit"
                        onClick={(e) => {
                          saveEdit(e);
                        }}
                        loading={buttonLoading}
                      />
                    )}
                  </Button.Group>
                </div>
              </Form>
            ) : (
              <Segment placeholder>
                <Header icon>
                  <Icon name="user" />
                  No user found
                </Header>
                <Button
                  primary
                  onClick={() => {
                    window.location.href = "/users/add-a-user";
                  }}
                >
                  Add User
                </Button>
              </Segment>
            )}
          </div>
        </>
      )}
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { data: user } = await axios.get(
    `https://hfb-api.herokuapp.com/api/users/${params.user}`
  );

  return {
    props: {
      dbUser: user,
    },
  };
}
