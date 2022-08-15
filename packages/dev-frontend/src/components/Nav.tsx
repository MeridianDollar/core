import { Flex, Box } from "theme-ui";
import { Link } from "./Link";

export const Nav: React.FC = () => {
  return (
    <Box as="nav" sx={{ display: ["none", "flex"], alignItems: "center", flex: 1 }}>
      <Flex sx={{ justifyContent: "start", ml: 10, flex: 1 }}>
        <Link sx={{ fontSize: 1 }} to="/">Dashboard</Link>
        {/* <Link sx={{ fontSize: 1 }} to="/farm">Farm</Link> */}
        <Link sx={{ fontSize: 1 }} to="/risky-troves">
          Risky Troves
        </Link>
        <Link sx={{ fontSize: 1 }} to="/redemption">
          Redemption
        </Link>
      </Flex>
      {/* <Flex sx={{ justifyContent: "flex-end", mr: 3 }}>
        <Link sx={{ fontSize: 1 }} to="/">Select Network</Link>
  </Flex> */}
    </Box>
  );
};

