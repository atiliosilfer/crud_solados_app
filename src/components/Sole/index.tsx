import {
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ContainerItens } from "../ContainerItens";
import { Container } from "./Sole.styles";
import { useState } from "react";
import { ConfirmationModal } from "../CofirmationModal";
import { RegisterOrderModal } from "./components/RegisterOrderModal";
import { InputNumberSole } from "../InputNumberSole";
import { invoke } from "@tauri-apps/api/tauri";

const SHOE_NUMBERING = [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];

type SoleProps = {
  name: string;
  id: number;
  refresh_soles: () => void;
};

export function Sole({ name, id, refresh_soles }: SoleProps) {
  const [restartModalOpened, setRestartModalOpened] = useState(false);
  const [sumStockModalOpened, setSumStockModalOpened] = useState(false);
  const [deleteSoleModalOpened, setDeleteSoleModalOpened] = useState(false);
  const [registerOrderModalOpened, setRegisterOrderModalOpened] =
    useState(false);

  const handleDelete = () => {
    invoke("soft_delete_sole", { id })
      .then(() => {
        refresh_soles();
        console.log("Solado excluido com sucesso!");
      })
      .catch((error) => console.log(error, "Erro ao excluir solado"));
  };

  return (
    <>
      <Container>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <ContainerItens>
              <Typography variant="h6">{name}</Typography>
              <IconButton>
                <DeleteIcon onClick={() => setDeleteSoleModalOpened(true)} />
              </IconButton>
            </ContainerItens>
          </Grid>
          <Grid item>
            <ContainerItens>
              <Button
                variant="contained"
                size="small"
                sx={{ textTransform: "none" }}
                onClick={() => setRestartModalOpened(true)}
              >
                Reiniciar pedidos
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ textTransform: "none" }}
                onClick={() => setRegisterOrderModalOpened(true)}
              >
                Cadastrar Pedido
              </Button>
            </ContainerItens>
          </Grid>
        </Grid>

        <TableContainer sx={{ background: "#f9f9f9", borderRadius: 2, my: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {SHOE_NUMBERING.map((number) => (
                  <TableCell align="right">{number}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="right">Estoque</TableCell>
                <TableCell align="right">1</TableCell>
                <TableCell align="right">2</TableCell>
                <TableCell align="right">3</TableCell>
                <TableCell align="right">4</TableCell>
                <TableCell align="right">5</TableCell>
                <TableCell align="right">6</TableCell>
                <TableCell align="right">7</TableCell>
                <TableCell align="right">8</TableCell>
                <TableCell align="right">9</TableCell>
                <TableCell align="right">10</TableCell>
                <TableCell align="right">11</TableCell>
                <TableCell align="right">12</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">Pedidos</TableCell>
                <TableCell align="right">1</TableCell>
                <TableCell align="right">2</TableCell>
                <TableCell align="right">3</TableCell>
                <TableCell align="right">4</TableCell>
                <TableCell align="right">5</TableCell>
                <TableCell align="right">6</TableCell>
                <TableCell align="right">7</TableCell>
                <TableCell align="right">8</TableCell>
                <TableCell align="right">9</TableCell>
                <TableCell align="right">10</TableCell>
                <TableCell align="right">11</TableCell>
                <TableCell align="right">12</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">Final</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
                <TableCell align="right">0</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Typography sx={{ textAlign: "left" }}>Somar ao estoque</Typography>

        <TableContainer sx={{ background: "#f9f9f9", borderRadius: 2, my: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {SHOE_NUMBERING.map((number) => (
                  <TableCell align="right">{number}</TableCell>
                ))}
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
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Button
              variant="contained"
              size="small"
              sx={{ textTransform: "none" }}
              onClick={() => setSumStockModalOpened(true)}
            >
              Somar ao estoque
            </Button>
          </Grid>
        </Grid>
      </Container>

      <ConfirmationModal
        textDescription={`Deseja reiniciar os pedidos do solado ${name}?`}
        titleDescription="Reiniciar Pedidos"
        open={restartModalOpened}
        handleClose={() => setRestartModalOpened(false)}
        handleCancel={() => setRestartModalOpened(false)}
        handleConfirm={() => console.log("Confirm")}
      />

      <ConfirmationModal
        textDescription={`Deseja Excluir o solado ${name}?`}
        titleDescription="Excluir Solado"
        open={deleteSoleModalOpened}
        handleClose={() => setDeleteSoleModalOpened(false)}
        handleCancel={() => setDeleteSoleModalOpened(false)}
        handleConfirm={() => handleDelete()}
      />

      <ConfirmationModal
        textDescription={`Deseja somar ao estoque do solado ${name}?`}
        titleDescription="Somar Estoque"
        open={sumStockModalOpened}
        handleClose={() => setSumStockModalOpened(false)}
        handleCancel={() => setSumStockModalOpened(false)}
        handleConfirm={() => console.log("Confirm")}
      />

      <RegisterOrderModal
        open={registerOrderModalOpened}
        handleClose={() => setRegisterOrderModalOpened(false)}
        handleConfirm={() => console.log("cadastrar pedido")}
        handleCancel={() => setRegisterOrderModalOpened(false)}
      />
    </>
  );
}
