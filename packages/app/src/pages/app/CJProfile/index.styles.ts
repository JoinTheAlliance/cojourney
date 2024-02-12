import { createStyles } from "@mantine/core";

const useProfileStyles = createStyles(() => ({
  container: {
    padding: 8,
    position: "relative",
    width: "100%",
    height:
      "calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem))",
  },
  titleContainer: {
    flexGrow: 1,
  },
  content: {
    height: "100%",
  },
  select: {
    border: "none",
    backgroundColor: "#232627",
    padding: "1.5rem 1rem",
  },
  input: {
    padding: "1.5rem",
    border: "1px solid #232627",
    borderRadius: "0.8rem",
    background: "transparent",
  },
  logoutButton: {
    color: "#f00",
    cursor: "pointer",
    textAlign: "center",
  },
}));

export default useProfileStyles;
