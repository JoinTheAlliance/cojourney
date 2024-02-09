import React from "react";
import styles from "./index.module.css";
import GoogleIcon from "../../assets/icons/google.svg";
import TwitterIcon from "../../assets/icons/x.svg";
import DiscordIcon from "../../assets/icons/discord.svg";
import GithubIcon from "../../assets/icons/github.svg";

export default function OAuthUser() {
  return (
    <div className={styles.container}>
      <div>
        <h1 className={styles.header}>Cojourney</h1>
        <div className={styles.authCard}>
          <h3>Please login to continue</h3>
          <div className={styles.authProvider}>
            <img
              src={TwitterIcon}
              alt="Twitter"
              className={styles.authIcon}
            />
            <img
              src={DiscordIcon}
              alt="Discord"
              className={styles.authIcon}
            />
            <img
              src={GoogleIcon}
              alt="Google"
              className={styles.authIcon}
            />
            <img
              src={GithubIcon}
              className={styles.authIcon}
              alt="Github"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
