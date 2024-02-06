import { createStyles } from "@mantine/styles";

const useMessageStyles = createStyles((theme: any) => ({
  messageDiv: {
    borderRadius: "0.5rem",
    position: "relative",
    width: "100%",
    paddingLeft: 10,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[1],
    },
  },
  avatarDiv: {
    display: "flex",
  },
  messageFunctionsDiv: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    right: 0,
  },
  edit_input: {
    width: "calc(100% -  60px)",
    zIndex: 9999,
    top: 0,
    marginBottom: 10,
    marginTop: 10,
  },
}));

export default useMessageStyles;
