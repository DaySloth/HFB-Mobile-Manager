import Head from "next/head";
import { useRouter } from "next/router";
import NavHeader from "../../components/header.js";
import {
  Icon,
  Table,
  Header,
  Input,
  Button,
  Modal,
  Message,
  Segment,
  Image,
  Label,
  List,
} from "semantic-ui-react";
import { useSession } from "next-auth/client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import Loader from "../../components/loader";
import axios from "axios";

export default function Products({ products }) {
  const Router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading) {
      if (!session) {
        window.location.href = "/authorize/signin";
      }
    }
  }, [loading]);

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
              <Icon name="warehouse" />
              Products
            </Header>
          </div>

          <hr />
          {products[0] ? (
            <>
              {/* <div className={styles.container}>
                <Input
                  icon="search"
                  placeholder="Search..."
                  className={styles.fullWidth}
                />
              </div> */}

              <div className={styles.tableContainer}>
                <Table celled selectable>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Image</Table.HeaderCell>
                      <Table.HeaderCell>Category</Table.HeaderCell>
                      <Table.HeaderCell>Title</Table.HeaderCell>
                      <Table.HeaderCell>Finish</Table.HeaderCell>
                      <Table.HeaderCell>Part Number</Table.HeaderCell>
                      <Table.HeaderCell>Price</Table.HeaderCell>
                      <Table.HeaderCell>Quantity</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {products.map((product) => (
                      <>
                        <Table.Row
                          key={product._id}
                          onClick={() =>
                            Router.push(`/products/edit/${product._id}`)
                          }
                        >
                          <Table.Cell>
                            <Image src={product.image} size="tiny" />
                          </Table.Cell>
                          <Table.Cell>{product.category}</Table.Cell>
                          <Table.Cell>{product.title}</Table.Cell>
                          <Table.Cell>{product.finish}</Table.Cell>
                          <Table.Cell>{product.part_num}</Table.Cell>
                          <Table.Cell>${product.price}</Table.Cell>
                          <Table.Cell>{product.quantity}</Table.Cell>
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
                No products found in the database
              </Header>
              <Button primary href="/products/add-a-product">
                Add a Product
              </Button>
            </Segment>
          )}
        </>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const { data: products } = await axios.get(
    "https://hfb-api.herokuapp.com/api/products"
  );

  // const { data: products } = await axios.get(
  //   "http://localhost:3001/api/products"
  // );

  return {
    props: {
      products: products,
    },
  };
}
