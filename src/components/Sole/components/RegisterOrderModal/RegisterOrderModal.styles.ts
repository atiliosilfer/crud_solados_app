import { Box } from "@mui/material";
import styled from "styled-components";

export const Container = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 24;
  padding: 16px;
`;
