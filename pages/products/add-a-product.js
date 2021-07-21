import Head from "next/head";
import { useRouter } from "next/router";
import NavHeader from "../../components/header.js";
import {
  Icon,
  Dropdown,
  Table,
  Header,
  Input,
  Button,
  Modal,
  Message,
  Segment,
  Label,
  List,
  Form,
  Checkbox,
  Grid,
} from "semantic-ui-react";
import { useSession } from "next-auth/client";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import Loader from "../../components/loader";
import axios from "axios";

export default function AddAProduct({
  products,
  categories,
  titles,
  finishes,
}) {
  const Router = useRouter();
  const fileInputRef = React.createRef();
  const [session, loading] = useSession();
  const selectCategories = categories.map((category) => {
    return { key: category[0], text: category, value: category };
  });
  selectCategories.push({
    key: 123,
    text: "Add new category",
    value: "create category",
  });

  const selectTitles = titles.map((title) => {
    return { key: title[0], text: title, value: title };
  });
  selectTitles.push({
    key: 123,
    text: "Add new title",
    value: "create title",
  });

  const selectFinishes = finishes.map((finish) => {
    return { key: finish[0], text: finish, value: finish };
  });
  selectFinishes.push({
    key: 123,
    text: "Add new finish",
    value: "create finish",
  });

  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    quantity: "",
    category: "",
    sub_category: "",
    part_num: "",
    finish: "",
    length: "",
    width: "",
    height: "",
    image: "",
  });

  async function createProduct() {
    let { title, price, quantity, category, part_num, finish } = newProduct;
    if (
      title &&
      price &&
      quantity &&
      category &&
      part_num &&
      finish &&
      quantity
    ) {
      let formData = new FormData();
      formData.append("image", newProduct.image);
      formData.append("data", JSON.stringify(newProduct));
      axios
        .post("http://localhost:3001/api/products/create", formData, {
          headers: {
            "hfb-apikey": "S29obGVyUm9ja3Mh",
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => {
          console.log(result);
        });
    } else {
      alert("Not done yet");
    }
  }

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
              Add A Product
            </Header>
          </div>

          <hr />

          {products ? (
            <>
              <div className={styles.tableContainer}>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createProduct();
                  }}
                >
                  <Form.Group widths="equal">
                    {newProduct.category === "create category" ? (
                      <Form.Input fluid label="New Category" />
                    ) : (
                      <Form.Select
                        label="Category"
                        required
                        onChange={(e, { value }) =>
                          setNewProduct({ ...newProduct, category: value })
                        }
                        placeholder="Select Category"
                        clearable
                        fluid
                        search
                        selection
                        options={selectCategories}
                      />
                    )}
                    {newProduct.title === "create title" ? (
                      <Form.Input fluid label="New Title" />
                    ) : (
                      <Form.Select
                        label="Title"
                        required
                        onChange={(e, { value }) =>
                          setNewProduct({ ...newProduct, title: value })
                        }
                        placeholder="Select Title"
                        clearable
                        fluid
                        search
                        selection
                        options={selectTitles}
                      />
                    )}
                  </Form.Group>
                  <Form.Group widths="equal">
                    {newProduct.finish === "create finish" ? (
                      <Form.Input fluid label="New Finish" />
                    ) : (
                      <Form.Select
                        label="Finish"
                        required
                        onChange={(e, { value }) =>
                          setNewProduct({ ...newProduct, finish: value })
                        }
                        placeholder="Select Finish"
                        clearable
                        fluid
                        search
                        selection
                        options={selectFinishes}
                      />
                    )}
                    <Form.Input
                      fluid
                      label="Length"
                      type="number"
                      onChange={(e, { value }) =>
                        setNewProduct({ ...newProduct, length: value })
                      }
                    />
                    <Form.Input
                      fluid
                      label="Width"
                      type="number"
                      onChange={(e, { value }) =>
                        setNewProduct({ ...newProduct, width: value })
                      }
                    />
                    <Form.Input
                      fluid
                      label="Height"
                      type="number"
                      onChange={(e, { value }) =>
                        setNewProduct({ ...newProduct, height: value })
                      }
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Input
                      fluid
                      required
                      label="Part #"
                      onChange={(e, { value }) =>
                        setNewProduct({ ...newProduct, part_num: value })
                      }
                    />
                    <Form.Input
                      fluid
                      label="Price"
                      required
                      type="number"
                      onChange={(e, { value }) =>
                        setNewProduct({ ...newProduct, price: value })
                      }
                    />
                    <Form.Input
                      fluid
                      label="Quantity"
                      required
                      type="number"
                      onChange={(e, { value }) =>
                        setNewProduct({ ...newProduct, quantity: value })
                      }
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Button
                      content={
                        newProduct.image
                          ? `${newProduct.image.name}`
                          : "Choose File"
                      }
                      labelPosition="left"
                      icon="file"
                      onClick={(e) => {
                        e.preventDefault();
                        fileInputRef.current.click();
                      }}
                    />
                    <input
                      ref={fileInputRef}
                      accept="image/*"
                      type="file"
                      hidden
                      onChange={(e) => {
                        console.log(e.target.files[0]);
                        setNewProduct({
                          ...newProduct,
                          image: e.target.files[0],
                        });
                      }}
                    />
                  </Form.Group>
                  <div className={styles.centerButton}>
                    <Button
                      type="submit"
                      color="green"
                      className={styles.centerLogo}
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              </div>
            </>
          ) : (
            <Segment placeholder>
              <Header icon>
                <Icon name="user secret" />
                Sneaky sneaks..
              </Header>
              {/* <Button primary href="/users/add-a-user">
                Add a User
              </Button> */}
            </Segment>
          )}
        </>
      )}
    </>
  );
}

export async function getServerSideProps() {
  const { data: products } = await axios.get(
    "http://localhost:3001/api/products"
  );

  return {
    props: {
      products: products,
      categories: ["Doors", "Wall Systems"],
      titles: ["Shower Door 48x36", "Lux Stone Granite Thing"],
      finishes: ["Brushed Chrome", "Silver"],
    },
  };
}
