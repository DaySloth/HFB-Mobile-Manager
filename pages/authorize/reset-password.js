import Head from "next/head";
import { useEffect, useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import styles from "../../styles/Home.module.css";
import { useRouter } from "next/router";
import axios from "axios";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [show, setShow] = useState(false);

  async function resetPassword() {
    const { status } = await axios.post(
      "https://hfb-api.herokuapp.com/api/users/reset-password/email",
      { email: username },
      {
        headers: {
          "hfb-apikey": "S29obGVyUm9ja3Mh",
        },
      }
    );
    setLoading(false);
    setShow(true);
  }

  return (
    <>
      <Head>
        <title>HFB Mobile Manager | Reset Password</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.centerLogo}>
          <img
            src="/HomeForeverBaths-Black-Horz.png"
            alt="Home Forever Baths logo"
            className={styles.centerLogo}
          />
        </div>

        <Form>
          <Form.Input
            icon="user"
            iconPosition="left"
            label="Username"
            placeholder="Username"
            onChange={(event) => setUsername(event.target.value)}
            value={username}
            required
          />

          {show && (
            <>
              <Message color="green">
                <Message.Header>
                  {
                    "Please check your email for your reset password instructions"
                  }
                </Message.Header>
              </Message>
            </>
          )}

          <div className={styles.center}>
            <Button
              content="Reset Password"
              onClick={(e) => {
                e.preventDefault();
                setLoading(true);
                resetPassword();
              }}
              primary
              className={styles.center}
              loading={loading}
            />
          </div>
        </Form>
      </div>
    </>
  );
}
