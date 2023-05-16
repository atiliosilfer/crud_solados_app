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
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ContainerItens } from "../ContainerItens";
import { Container } from "./SoleContainer.styles";
import { ChangeEvent, useEffect, useState } from "react";
import { ConfirmationModal } from "../CofirmationModal";
import { RegisterOrderModal } from "./components/RegisterOrderModal";
import { InputNumberSole } from "../InputNumberSole";
import { invoke } from "@tauri-apps/api/tauri";
import { Order, Stock } from "../../types";
import { SHOE_NUMBERING } from "../../constants";

type SoleContainerProps = {
  name: string;
  id: number;
  refreshSoles: () => void;
};

export function SoleContainer({ name, id, refreshSoles }: SoleContainerProps) {
  const [restartModalOpened, setRestartModalOpened] = useState(false);
  const [sumStockModalOpened, setSumStockModalOpened] = useState(false);
  const [deleteSoleModalOpened, setDeleteSoleModalOpened] = useState(false);
  const [registerOrderModalOpened, setRegisterOrderModalOpened] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [finalStock, setFinalStock] = useState<Stock[]>([]);
  const [initialStockInput, setInitialStockInput] = useState<Stock[]>([]);

  const restartStockInput = () => {
    let initialStock: Stock[] = SHOE_NUMBERING.map((shoeNumber) => {
      return { size: shoeNumber, amount: 0, sole_id: id };
    });

    setInitialStockInput(initialStock);
  };

  useEffect(() => {
    const finalStock = SHOE_NUMBERING.map((size) => {
      const stockItem = stocks.find((item) => item.size === size) || {
        size,
        amount: 0,
        sole_id: 0,
      };
      const orderItem = orders.find((item) => item.size === size && !item.deleted_at) || {
        size,
        amount: 0,
        sole_id: 0,
      };

      return {
        size,
        amount: stockItem.amount - orderItem.amount,
        sole_id: stockItem.sole_id,
      };
    });

    setFinalStock(finalStock);
  }, [orders, stocks]);

  useEffect(() => {
    refreshOrders();
    refreshStocks();
    restartStockInput();
  }, []);

  const updateStockInput = (event: ChangeEvent<HTMLInputElement>, size: number) => {
    const updatedStockInput = initialStockInput.map((stockInput) =>
      stockInput.size === size
        ? {
            ...stockInput,
            amount: Number(event.target.value),
          }
        : stockInput
    );

    setInitialStockInput(updatedStockInput);
  };

  const refreshOrders = () => {
    invoke("get_orders", { id }).then((response) => setOrders(response as Order[]));
  };

  const refreshStocks = () => {
    invoke("get_stocks", { id }).then((response) => {
      setStocks(response as Stock[]);
    });
  };

  const handleDelete = () => {
    invoke("soft_delete_sole", { id })
      .then(() => {
        refreshSoles();
      })
      .catch((error) => alert("Erro ao excluir solado: " + error));
  };

  const handleAddStocks = () => {
    invoke("add_sole_stock", { stocks: initialStockInput, id })
      .then(() => {
        refreshStocks();
        restartStockInput();
        setSumStockModalOpened(false);
      })
      .catch((error) => alert("Erro ao adicionar solado: " + error));
  };

  const handleResetOrders = () => {
    invoke("reset_orders", { id })
      .then(() => {
        refreshStocks();
        refreshOrders();
        restartStockInput();
        setRestartModalOpened(false);
      })
      .catch((error) => alert("Erro ao reiniciar pedidos: " + error));
  };

  return (
    <>
      <Container>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <ContainerItens>
              <Typography variant="h6">{name}</Typography>
              <IconButton onClick={() => setDeleteSoleModalOpened(true)}>
                <DeleteIcon />
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
                  <TableCell key={number} align="right">
                    {number}
                  </TableCell>
                ))}
                <TableCell align="center">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="right">Estoque</TableCell>
                {stocks.map(({ size, amount }: Stock) => (
                  <TableCell key={size} align="right">
                    {amount}
                  </TableCell>
                ))}
                <TableCell align="center">{stocks.reduce((acc, stock) => acc + stock.amount, 0)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">Pedidos</TableCell>
                {orders.map(({ size, amount }: Order) => (
                  <TableCell key={size} align="right">
                    {amount}
                  </TableCell>
                ))}
                <TableCell align="center">{orders.reduce((acc, order) => acc + order.amount, 0)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right">Estoque Final</TableCell>
                {finalStock.map(({ size, amount }: Stock) => (
                  <TableCell key={size} align="right">
                    {amount}
                  </TableCell>
                ))}
                <TableCell align="center">{finalStock.reduce((acc, stock) => acc + stock.amount, 0)}</TableCell>
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
                  <TableCell key={number} align="center">
                    {number}
                  </TableCell>
                ))}
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="right">Estoque</TableCell>
                {initialStockInput.map((stockInput) => (
                  <TableCell key={stockInput.size} align="center">
                    <InputNumberSole
                      type="number"
                      value={stockInput.amount}
                      onChange={(e) => updateStockInput(e, stockInput.size)}
                    />
                  </TableCell>
                ))}
                <TableCell align="center">{initialStockInput.reduce((acc, stock) => acc + stock.amount, 0)}</TableCell>
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
        handleConfirm={handleResetOrders}
      />

      <ConfirmationModal
        textDescription={`Deseja Excluir o solado ${name}?`}
        titleDescription="Excluir Solado"
        open={deleteSoleModalOpened}
        handleClose={() => setDeleteSoleModalOpened(false)}
        handleCancel={() => setDeleteSoleModalOpened(false)}
        handleConfirm={handleDelete}
      />

      <ConfirmationModal
        textDescription={`Deseja somar ao estoque do solado ${name}?`}
        titleDescription="Somar Estoque"
        open={sumStockModalOpened}
        handleClose={() => setSumStockModalOpened(false)}
        handleCancel={() => setSumStockModalOpened(false)}
        handleConfirm={handleAddStocks}
      />

      <RegisterOrderModal
        open={registerOrderModalOpened}
        handleClose={() => setRegisterOrderModalOpened(false)}
        refreshOrders={refreshOrders}
        handleCancel={() => setRegisterOrderModalOpened(false)}
        soleId={id}
      />
    </>
  );
}
