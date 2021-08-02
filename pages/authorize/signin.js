import Head from "next/head";
import { useEffect, useState } from "react";
import { Button, Form, Message } from "semantic-ui-react";
import styles from "../../styles/Home.module.css";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";

export default function SignIn() {
  const router = useRouter();
  const { error, email } = router.query;
  const [username, setUsername] = useState(email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [tempPassword, setTempPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (error === "Temporary password") {
      setTempPassword(true);
    }
  }, [error]);

  return (
    <>
      <Head>
        <title>HFB Mobile Manager | Signin</title>
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
          />

          {error === "Temporary password" ? (
            <>
              <Form.Input
                icon="lock"
                iconPosition="left"
                label="New Password"
                type="password"
                onChange={(event) => setPassword(event.target.value)}
                className={passwordError && styles.redGlowingBorder}
                value={password}
              />
              <Form.Input
                icon="lock"
                iconPosition="left"
                label="Confirm New Password"
                type="password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={passwordError && styles.redGlowingBorder}
                value={confirmPassword}
              />
              {passwordError && (
                <>
                  <h5 className={styles.redText}>{passwordError}</h5>
                </>
              )}
            </>
          ) : (
            <Form.Input
              icon="lock"
              iconPosition="left"
              label="Password"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
            />
          )}

          {error && (
            <>
              <Message
                color={error === "Temporary password" ? "orange" : "red"}
              >
                <Message.Header>
                  {error === "Temporary password"
                    ? "Please create a new password"
                    : "Invalid username or password"}
                </Message.Header>
              </Message>
            </>
          )}

          <div className={styles.center}>
            <Button
              content="Sign In"
              onClick={() => {
                setLoading(true);
                signIn("credentials", {
                  username: username,
                  password: password,
                  resetTempPassword: tempPassword,
                  callbackUrl: "http://localhost:3000",
                });
              }}
              primary
              className={styles.center}
              loading={loading}
            />
            <div className={styles.centerText} style={{ marginTop: "10px" }}>
              <a href="#">Forgot Password?</a>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}
