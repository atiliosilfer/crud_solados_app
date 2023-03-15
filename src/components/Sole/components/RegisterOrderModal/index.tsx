import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ContainerItens } from "../../../ContainerItens";
import { InputNumberSole } from "../../../InputNumberSole";
import { Container } from "./RegisterOrderModal.styles";

type RegisterOrderModalProps = {
  open: boolean;
  handleClose: () => void;
  handleCancel: () => void;
  handleConfirm: () => void;
};

export function RegisterOrderModal({
  open,
  handleClose,
  handleCancel,
  handleConfirm,
}: RegisterOrderModalProps) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Container>
        <Typography variant="h6" component="h2">
          Cadastrar novo pedido
        </Typography>

        <TableContainer sx={{ background: "#f9f9f9", borderRadius: 2, my: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="right">33</TableCell>
                <TableCell align="right">34</TableCell>
                <TableCell align="right">35</TableCell>
                <TableCell align="right">36</TableCell>
                <TableCell align="right">37</TableCell>
                <TableCell align="right">38</TableCell>
                <TableCell align="right">39</TableCell>
                <TableCell align="right">40</TableCell>
                <TableCell align="right">41</TableCell>
                <TableCell align="right">42</TableCell>
                <TableCell align="right">43</TableCell>
                <TableCell align="right">44</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="right">Estoque</TableCell>
                <TableCell align="right">
                  <InputNumberSole type="number" />
                </TableCell>
                <TableCell align="right">
                  <InputNumberSole type="number" />
                </TableCell>
                <TableCell align="right">
                  <InputNumberSole type="number" />
                </TableCell>
                <TableCell align="right">
                  <InputNumberSole type="number" />
                </TableCell>
                <TableCell align="right">
                  <InputNumberSole type="number" />
                </TableCell>
                <TableCell align="right">
                  <InputNumberSole type="number" />
                </TableCell>
                <TableCell align="right">
                  <InputNumberSole type="number" />
                </TableCell>
                <TableCell align="right">
                  <InputNumberSole type="number" />
                </TableCell>
                <TableCell align="right">
                  <InputNumberSole type="number" />
                </TableCell>
                <TableCell align="right">
                  <InputNumberSole type="number" />
                </TableCell>
                <TableCell align="right">
                  <InputNumberSole type="number" />
                </TableCell>
                <TableCell align="right">
                  <InputNumberSole type="number" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <ContainerItens>
          <Button
            variant="contained"
            size="small"
            sx={{ textTransform: "none" }}
            onClick={() => handleCancel()}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ textTransform: "none" }}
            onClick={() => handleConfirm()}
          >
            Cadastrar
          </Button>
        </ContainerItens>
      </Container>
    </Modal>
  );
}
