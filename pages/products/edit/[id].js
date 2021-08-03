import Head from "next/head";
import { useRouter } from "next/router";
import NavHeader from "../../../components/header.js";
import {
  Icon,
  Image,
  Header,
  Button,
  Modal,
  Message,
  Segment,
  Form,
} from "semantic-ui-react";
import { useSession } from "next-auth/client";
import React, { useEffect, useState, useContext } from "react";
import styles from "../../../styles/Home.module.css";
import Loader from "../../../components/loader";
import axios from "axios";
import ThemeContext from "../../../util/context/darkTheme.js";

export default function AddAProduct({
  foundProduct,
  products,
  categories,
  titles,
  finishes,
}) {
  const { darkTheme } = useContext(ThemeContext);
  const [isDifferent, setIsDifferent] = useState(false);
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
    title: foundProduct.title,
    price: foundProduct.price,
    quantity: foundProduct.quantity,
    category: foundProduct.category,
    sub_category: foundProduct.sub_category,
    part_num: foundProduct.part_num,
    finish: foundProduct.finish,
    length: foundProduct["length"],
    width: foundProduct.width,
    height: foundProduct.height,
    image: foundProduct.image,
    image_id: foundProduct.image_id,
  });

  const [newCategory, setNewCategory] = useState(false);
  const [newTitle, setNewTitle] = useState(false);
  const [newFinish, setNewFinish] = useState(false);
  const [open, setOpen] = useState(false);

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
      image_id: "",
    });
    setNewTitle(false);
    setNewCategory(false);
    setNewFinish(false);
  }

  async function updateProduct() {
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
      axios
        .post(
          `https://hfb-api.herokuapp.com//api/products/update/${foundProduct._id}`,
          newProduct,
          {
            headers: {
              "hfb-apikey": "S29obGVyUm9ja3Mh",
            },
          }
        )
        .then((result) => {
          if (result.status === 200) {
            setButtonLoading(false);
            Router.push("/products");
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

  async function uploadImage(image) {
    let formData = new FormData();
    formData.append("image", image);
    axios
      .post(
        "https://hfb-api.herokuapp.com/api/products/upload-image",
        formData,
        {
          headers: {
            "hfb-apikey": "S29obGVyUm9ja3Mh",
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then(({ data }) => {
        setNewProduct({
          ...newProduct,
          image: data.url,
          image_id: data.image_id,
        });
      });
  }

  async function deleteProduct() {
    axios
      .get(
        `https://hfb-api.herokuapp.com/api/products/delete/${foundProduct._id}`,
        {
          headers: {
            "hfb-apikey": "S29obGVyUm9ja3Mh",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          Router.push("/products");
        } else {
          setMessage({
            visible: true,
            text: "Error in deleteing product, try again",
            color: "red",
          });
        }
      });
  }

  useEffect(() => {
    if (
      newProduct.title !== foundProduct.title ||
      newProduct.price !== foundProduct.price ||
      newProduct.quantity !== foundProduct.quantity ||
      newProduct.category !== foundProduct.category ||
      newProduct.sub_category !== foundProduct.sub_category ||
      newProduct.part_num !== foundProduct.part_num ||
      newProduct.finish !== foundProduct.finish ||
      newProduct["length"] !== foundProduct["length"] ||
      newProduct.width !== foundProduct.width ||
      newProduct.height !== foundProduct.height ||
      newProduct.image !== foundProduct.image ||
      newProduct.image_id !== foundProduct.image_id
    ) {
      setIsDifferent(true);
    } else {
      setIsDifferent(false);
    }
  }, [newProduct]);

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
              <Icon name="warehouse" />
              Edit A Product
            </Header>
          </div>

          <hr />

          {products ? (
            <>
              <div className={styles.tableContainer}>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateProduct();
                  }}
                >
                  <Form.Group widths="equal">
                    <div className={styles.center}>
                      <Image src={newProduct.image} size="small" />
                    </div>
                  </Form.Group>
                  <Form.Group widths="equal">
                    {newCategory ? (
                      <Form.Input
                        required
                        fluid
                        label={
                          <label
                            className={
                              darkTheme ? styles.whiteLabel : styles.blackLabel
                            }
                          >
                            New Category
                          </label>
                        }
                        onChange={(e, { value }) =>
                          setNewProduct({ ...newProduct, category: value })
                        }
                      />
                    ) : (
                      <Form.Select
                        label={
                          <label
                            className={
                              darkTheme ? styles.whiteLabel : styles.blackLabel
                            }
                          >
                            Category
                          </label>
                        }
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
                        required
                        fluid
                        label={
                          <label
                            className={
                              darkTheme ? styles.whiteLabel : styles.blackLabel
                            }
                          >
                            New Title
                          </label>
                        }
                        onChange={(e, { value }) =>
                          setNewProduct({ ...newProduct, title: value })
                        }
                      />
                    ) : (
                      <Form.Select
                        label={
                          <label
                            className={
                              darkTheme ? styles.whiteLabel : styles.blackLabel
                            }
                          >
                            Title
                          </label>
                        }
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
                        required
                        fluid
                        label={
                          <label
                            className={
                              darkTheme ? styles.whiteLabel : styles.blackLabel
                            }
                          >
                            New Finish
                          </label>
                        }
                        onChange={(e, { value }) =>
                          setNewProduct({ ...newProduct, finish: value })
                        }
                      />
                    ) : (
                      <Form.Select
                        label={
                          <label
                            className={
                              darkTheme ? styles.whiteLabel : styles.blackLabel
                            }
                          >
                            Finish
                          </label>
                        }
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
                      label={
                        <label
                          className={
                            darkTheme ? styles.whiteLabel : styles.blackLabel
                          }
                        >
                          Length
                        </label>
                      }
                      value={newProduct["length"]}
                      type="number"
                      step="0.01"
                      onChange={(e, { value }) =>
                        setNewProduct({
                          ...newProduct,
                          length: parseInt(value),
                        })
                      }
                    />
                    <Form.Input
                      fluid
                      label={
                        <label
                          className={
                            darkTheme ? styles.whiteLabel : styles.blackLabel
                          }
                        >
                          Width
                        </label>
                      }
                      value={newProduct.width}
                      type="number"
                      step="0.01"
                      onChange={(e, { value }) =>
                        setNewProduct({ ...newProduct, width: parseInt(value) })
                      }
                    />
                    <Form.Input
                      fluid
                      label={
                        <label
                          className={
                            darkTheme ? styles.whiteLabel : styles.blackLabel
                          }
                        >
                          Height
                        </label>
                      }
                      value={newProduct.height}
                      type="number"
                      step="0.01"
                      onChange={(e, { value }) =>
                        setNewProduct({
                          ...newProduct,
                          height: parseInt(value),
                        })
                      }
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Input
                      fluid
                      required
                      label={
                        <label
                          className={
                            darkTheme ? styles.whiteLabel : styles.blackLabel
                          }
                        >
                          Part #
                        </label>
                      }
                      value={newProduct.part_num}
                      onChange={(e, { value }) =>
                        setNewProduct({ ...newProduct, part_num: value })
                      }
                    />
                    <Form.Input
                      fluid
                      label={
                        <label
                          className={
                            darkTheme ? styles.whiteLabel : styles.blackLabel
                          }
                        >
                          Price
                        </label>
                      }
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
                      label={
                        <label
                          className={
                            darkTheme ? styles.whiteLabel : styles.blackLabel
                          }
                        >
                          Quantity
                        </label>
                      }
                      value={newProduct.quantity}
                      required
                      type="number"
                      onChange={(e, { value }) =>
                        setNewProduct({
                          ...newProduct,
                          quantity: parseInt(value),
                        })
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
                        uploadImage(e.target.files[0]);
                      }}
                    />
                  </Form.Group>
                  <div className={styles.centerButton}>
                    <Button
                      type="submit"
                      color="green"
                      className={styles.centerLogo}
                      disabled={!isDifferent}
                    >
                      Save
                    </Button>
                    <Button
                      type="submit"
                      color="red"
                      className={styles.centerLogo}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(true);
                      }}
                    >
                      <Icon name="trash" />
                      Delete Product
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
      <Modal
        basic
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="small"
      >
        <Header icon>
          <Icon name="warning sign" />
          "Are you sure you want to delete this product?"
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
              deleteProduct();
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
  const { data: products } = await axios.get(
    "https://hfb-api.herokuapp.com/api/products"
  );
  const { data: foundProduct } = await axios.get(
    `https://hfb-api.herokuapp.com/api/products/${params.id}`
  );
  // const { data: products } = await axios.get(
  //   "http://localhost:3001/api/products"
  // );
  // const { data: foundProduct } = await axios.get(
  //   `http://localhost:3001/api/products/${params.id}`
  // );
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
      foundProduct: foundProduct,
      products: products,
      categories: categories,
      titles: titles,
      finishes: finishes,
    },
  };
}
