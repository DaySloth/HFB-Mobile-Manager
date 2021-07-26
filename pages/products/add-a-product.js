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
  const [message, setMessage] = useState({
    visible: false,
    color: "",
    text: "",
  });
  const [buttonLoading, setButtonLoading] = useState(false);
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

  const [newCategory, setNewCategory] = useState(false);
  const [newTitle, setNewTitle] = useState(false);
  const [newFinish, setNewFinish] = useState(false);

  useEffect(() => {
    if (newProduct.title === "create title") {
      setNewTitle(true);
    }
    if (newProduct.category === "create category") {
      setNewCategory(true);
    }
    if (newProduct.finish === "create finish") {
      setNewFinish(true);
    }
  }, [newProduct]);

  function clearForm() {
    setNewProduct({
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
    setNewTitle(false);
    setNewCategory(false);
    setNewFinish(false);
  }

  async function createProduct() {
    setButtonLoading(true);
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
        .post("https://hfb-api.herokuapp.com/api/products/create", formData, {
          headers: {
            "hfb-apikey": "S29obGVyUm9ja3Mh",
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => {
          if (result.status === 200) {
            setButtonLoading(false);
            clearForm();
            setMessage({
              visible: true,
              color: "green",
              text: "Successfully added new product!",
            });

            Router.replace(Router.asPath);
          } else {
            setButtonLoading(false);
            setMessage({
              visible: true,
              color: "red",
              text: "Something went wrong, please try again",
            });
          }
        });
    } else {
      setButtonLoading(false);
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
                    {newCategory ? (
                      <Form.Input
                        fluid
                        label="New Category"
                        onChange={(e, { value }) =>
                          setNewProduct({ ...newProduct, category: value })
                        }
                      />
                    ) : (
                      <Form.Select
                        label="Category"
                        value={newProduct.category}
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
                    {newTitle ? (
                      <Form.Input
                        fluid
                        label="New Title"
                        onChange={(e, { value }) =>
                          setNewProduct({ ...newProduct, title: value })
                        }
                      />
                    ) : (
                      <Form.Select
                        label="Title"
                        value={newProduct.title}
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
                    {newFinish ? (
                      <Form.Input
                        fluid
                        label="New Finish"
                        onChange={(e, { value }) =>
                          setNewProduct({ ...newProduct, finish: value })
                        }
                      />
                    ) : (
                      <Form.Select
                        label="Finish"
                        value={newProduct.finish}
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
                      value={newProduct.length}
                      type="number"
                      step="0.01"
                      onChange={(e, { value }) =>
                        setNewProduct({ ...newProduct, length: value })
                      }
                    />
                    <Form.Input
                      fluid
                      label="Width"
                      value={newProduct.width}
                      type="number"
                      step="0.01"
                      onChange={(e, { value }) =>
                        setNewProduct({ ...newProduct, width: value })
                      }
                    />
                    <Form.Input
                      fluid
                      label="Height"
                      value={newProduct.height}
                      type="number"
                      step="0.01"
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
                      value={newProduct.part_num}
                      onChange={(e, { value }) =>
                        setNewProduct({ ...newProduct, part_num: value })
                      }
                    />
                    <Form.Input
                      fluid
                      label="Price"
                      step="0.01"
                      value={newProduct.price}
                      required
                      type="number"
                      onChange={(e, { value }) =>
                        setNewProduct({ ...newProduct, price: value })
                      }
                    />
                    <Form.Input
                      fluid
                      label="Quantity"
                      value={newProduct.quantity}
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
                    <Button
                      color="grey"
                      className={styles.centerLogo}
                      onClick={(e) => {
                        e.preventDefault();
                        clearForm();
                      }}
                      loading={buttonLoading}
                    >
                      Clear Form
                    </Button>
                  </div>
                  {message.visible && (
                    <Message
                      onDismiss={() => {
                        setMessage({ visible: false });
                      }}
                      header={message.text}
                      color={message.color}
                    />
                  )}
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
    "https://hfb-api.herokuapp.com/api/products"
  );
  let categories = [];
  let titles = [];
  let finishes = [];
  products.forEach(({ category, title, finish }) => {
    categories.push(category);
    titles.push(title);
    finishes.push(finish);
  });

  categories = [...new Set(categories)];
  titles = [...new Set(titles)];
  finishes = [...new Set(finishes)];

  return {
    props: {
      products: products,
      categories: categories,
      titles: titles,
      finishes: finishes,
    },
  };
}
