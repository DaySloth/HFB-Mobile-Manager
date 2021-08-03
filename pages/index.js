import Head from "next/head";
import { useRouter } from "next/router";
import NavHeader from "../components/header.js";
import {
  Icon,
  Table,
  Header,
  Input,
  Button,
  Modal,
  Message,
  Segment,
  Label,
  List,
} from "semantic-ui-react";
import { useSession } from "next-auth/client";
import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Loader from "../components/loader";
import axios from "axios";
import ThemeContext from "../util/context/darkTheme";

export default function Home({ users }) {
  const Router = useRouter();
  const [session, loading] = useSession();
  const { darkTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        window.location.href = "/authorize/signin";
      }
    }
  }, [loading]);

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
              <Icon name="mobile alternate" />
              Users
            </Header>
          </div>

          <hr />
          {users[0] ? (
            <>
              {/* <div className={styles.container}>
                <Input
                  icon="search"
                  placeholder="Search..."
                  className={styles.fullWidth}
                />
              </div> */}

              <div className={styles.tableContainer}>
                <Table celled inverted={darkTheme}>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>First Name</Table.HeaderCell>
                      <Table.HeaderCell>Last Name</Table.HeaderCell>
                      <Table.HeaderCell>Email</Table.HeaderCell>
                      <Table.HeaderCell>Phone Number</Table.HeaderCell>
                      <Table.HeaderCell>Password</Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        Web Access
                      </Table.HeaderCell>
                      <Table.HeaderCell textAlign="center">
                        Edit
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {users.map((user) => (
                      <>
                        <Table.Row key={user.email}>
                          <Table.Cell>{user.first_name}</Table.Cell>
                          <Table.Cell>{user.last_name}</Table.Cell>
                          <Table.Cell>{user.email}</Table.Cell>
                          <Table.Cell>{`(${user.phone_number[0]}${user.phone_number[1]}${user.phone_number[2]}) ${user.phone_number[3]}${user.phone_number[4]}${user.phone_number[5]}-${user.phone_number[6]}${user.phone_number[7]}${user.phone_number[8]}${user.phone_number[9]}`}</Table.Cell>
                          <Table.Cell>
                            {user.isTempPassword
                              ? "Temporary password"
                              : "**********"}
                          </Table.Cell>
                          <Table.Cell textAlign="center">
                            {user.hasWebAccess ? "Yes" : "No"}
                          </Table.Cell>
                          <Table.Cell textAlign="center">
                            <Icon
                              name="edit"
                              className={styles.iconHover}
                              onClick={() => {
                                Router.push(`/users/edit/${user._id}`);
                              }}
                            />
                          </Table.Cell>
                        </Table.Row>
                      </>
                    ))}
                  </Table.Body>
                </Table>
              </div>
            </>
          ) : (
            <Segment placeholder>
              <Header icon>
                <Icon name="bath" />
                No users in the database
              </Header>
              <Button primary href="/users/add-a-user">
                Add a User
              </Button>
            </Segment>
          )}
        </>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const { data: users } = await axios.get(
    "https://hfb-api.herokuapp.com/api/users"
  );

  return {
    props: {
      users: users,
    },
  };
}
