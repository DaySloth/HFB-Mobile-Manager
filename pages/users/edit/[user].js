import Head from "next/head";
import { useEffect, useState, useContext } from "react";
import {
  Button,
  Form,
  Message,
  Checkbox,
  Header,
  Icon,
  Segment,
  Modal,
} from "semantic-ui-react";
import styles from "../../../styles/Home.module.css";
import axios from "axios";
import NavHeader from "../../../components/header";
import { useSession } from "next-auth/client";
import Loader from "../../../components/loader";
import { useRouter } from "next/router";
import ThemeContext from "../../../util/context/darkTheme";

export default function EditUser({ dbUser }) {
  const { darkTheme } = useContext(ThemeContext);
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
  const [open, setOpen] = useState(false);
  const [webAccess, setWebAccess] = useState(user.hasWebAccess);

  const [modalMessage, setModalMessage] = useState({ action: "", message: "" });
  const [isDifferent, setIsDifferent] = useState(false);

  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    if (
      first_name !== user.first_name ||
      last_name !== user.last_name ||
      email !== user.email ||
      webAccess !== user.hasWebAccess
    ) {
      setIsDifferent(true);
    } else {
      setIsDifferent(false);
    }
  }, [first_name, last_name, email, webAccess]);

  async function saveEdit(e) {
    e.preventDefault();
    setButtonLoading(true);

    const updatedUser = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone_number: phone_number,
      hasManagerAccess: webAccess,
    };

    const data = await axios.post(
      `https://hfb-api.herokuapp.com/api/users/update/${dbUser._id}`,
      updatedUser,
      {
        headers: {
          "hfb-apikey": "S29obGVyUm9ja3Mh",
        },
      }
    );
    if (data.status === 200) {
      Router.push("/");
    }
  }

  async function resetPassword() {
    const data = await axios.get(
      `https://hfb-api.herokuapp.com/api/users/reset-password/${dbUser._id}`,
      {
        headers: {
          "hfb-apikey": "S29obGVyUm9ja3Mh",
        },
      }
    );
    if (data.status === 200) {
      Router.push("/");
    }
  }

  async function removeUser(e, userId) {
    e.preventDefault();
    const data = await axios.delete(
      `https://hfb-api.herokuapp.com/api/users/delete/${userId}`,
      {
        headers: {
          "hfb-apikey": "S29obGVyUm9ja3Mh",
        },
      }
    );
    if (data.status === 200) {
      Router.push("/");
    } else {
      //error
    }
  }

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
                />
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

                <div className={styles.center} style={{ width: "400px" }}>
                  <Button.Group>
                    <Button
                      icon="trash"
                      content="Delete User"
                      color="red"
                      onClick={(e) => {
                        setModalMessage({
                          action: "delete",
                          message: `Are you sure you want to delete ${first_name}?`,
                        });
                        setOpen(true);
                      }}
                    />
                    <Button
                      content="Reset Password"
                      onClick={(e) => {
                        //generate reset
                        setModalMessage({
                          action: "reset",
                          message: `Are you sure you want to reset the password for ${first_name}?`,
                        });
                        setOpen(true);
                      }}
                      color="blue"
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
      <Modal
        basic
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="small"
      >
        <Header icon>
          <Icon name="warning sign" />
          {modalMessage.message}
        </Header>
        <Modal.Actions>
          <Button color="red" inverted onClick={() => setOpen(false)}>
            <Icon name="remove" /> No
          </Button>
          <Button
            color="green"
            inverted
            onClick={(e) => {
              setOpen(false);
              if (modalMessage.action === "reset") {
                resetPassword();
              }
              if (modalMessage.action === "delete") {
                removeUser(e, user._id);
              }
            }}
          >
            <Icon name="checkmark" /> Yes
          </Button>
        </Modal.Actions>
      </Modal>
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
