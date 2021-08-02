import { Dropdown, Menu, Grid } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import { signOut, useSession } from "next-auth/client";

export default function Header() {
  const [session, loading] = useSession();
  const router = useRouter();
  const options = [
    { key: 1, text: "View Users", value: "/" },
    {
      key: 2,
      text: "Add a User",
      value: "/users/add-a-user",
    },
    {
      key: 3,
      text: "Products",
      value: "/products",
    },
    {
      key: 4,
      text: "Add Product",
      value: "/products/add-a-product",
    },
  ];

  return (
    <nav className={styles.mainNav}>
      <Grid columns="equal" className={styles.centerText}>
        <Grid.Row>
          <Grid.Column>
            <Link href="/">
              <img
                src="/HomeForeverBaths-Logo-White.png"
                alt="Home Forever Baths logo"
                className={styles.headerLogo}
              />
            </Link>
          </Grid.Column>
          <Grid.Column>
            <h2>HFB Mobile Manager</h2>
          </Grid.Column>
          <Grid.Column>
            <div className={styles.floatLeft}>
              <Menu compact>
                <Dropdown
                  text="Menu"
                  simple
                  item
                  options={options}
                  onChange={(e, { value }) => {
                    router.push(value);
                  }}
                />
              </Menu>
            </div>
            <div className={styles.floatRight}>
              <h3>
                Hello {session.user.first_name},{" "}
                <span
                  className={styles.logout}
                  onClick={() => {
                    signOut();
                  }}
                >
                  Logout
                </span>
              </h3>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </nav>
  );
}
