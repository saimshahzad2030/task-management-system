import styles from "./RoundLoader.module.css";

type RoundLoaderProps = {
  entireScreen?: boolean;
  details?: string;
  whiteColor?: boolean;
};

const RoundLoader: React.FC<RoundLoaderProps> = ({ entireScreen = false, details = "", whiteColor = false }) => {
  return (
    <div className={entireScreen ? styles.screenLoder : styles.loader}>
      <div className={whiteColor ? styles.whiteSpinner : styles.spinner}></div>
      {entireScreen && <p className={styles.text}>{`${details}`}</p>}
    </div>
  );
};

export default RoundLoader;
