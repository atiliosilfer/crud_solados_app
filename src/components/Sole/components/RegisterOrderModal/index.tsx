import {
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ContainerItens } from "../../../ContainerItens";
import { InputNumberSole } from "../../../InputNumberSole";
import { Container } from "./RegisterOrderModal.styles";
import { ChangeEvent, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { SHOE_NUMBERING } from "../../../../constants";
import { Order } from "../../../../types";

type RegisterOrderModalProps = {
  open: boolean;
  handleClose: () => void;
  handleCancel: () => void;
  refreshOrders: () => void;
  soleId: number;
};

export function RegisterOrderModal({
  open,
  handleClose,
  handleCancel,
  soleId,
  refreshOrders,
}: RegisterOrderModalProps) {
  const [initialOrdersInput, setInitialOrdersInput] = useState<Order[]>([]);

  const restartOrderInput = () => {
    let initialOrder: Order[] = SHOE_NUMBERING.map((shoeNumber: number) => {
      return {
        size: shoeNumber,
        amount: 0,
        sole_id: soleId,
        deleted_at: null,
      };
    });

    setInitialOrdersInput(initialOrder);
  };

  useEffect(() => {
    restartOrderInput();
  }, []);

  const updateOrdersInput = (event: ChangeEvent<HTMLInputElement>, size: number) => {
    const updatedOrderInput = initialOrdersInput.map((orderInput) =>
      orderInput.size === size
        ? {
            ...orderInput,
            amount: Number(event.target.value),
          }
        : orderInput
    );

    setInitialOrdersInput(updatedOrderInput);
  };

  const handleAddOrders = () => {
    invoke("add_sole_orders", { orders: initialOrdersInput, id: soleId })
      .then(() => {
        refreshOrders();
        restartOrderInput();
        handleClose();
      })
      .catch((error) => alert("Erro ao adicionar pedido: " + error));
  };

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
                {SHOE_NUMBERING.map((shoeNumber: number) => (
                  <TableCell key={shoeNumber} align="center">
                    {shoeNumber}
                  </TableCell>
                ))}
                <TableCell align="center">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="right">Pedidos</TableCell>
                {initialOrdersInput.map((orderInput) => (
                  <TableCell key={orderInput.size} align="center">
                    <InputNumberSole
                      type="number"
                      value={orderInput.amount}
                      onChange={(e) => updateOrdersInput(e, orderInput.size)}
                    />
                  </TableCell>
                ))}
                <TableCell align="center">{initialOrdersInput.reduce((acc, order) => acc + order.amount, 0)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <ContainerItens>
          <Button variant="contained" size="small" sx={{ textTransform: "none" }} onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="contained" size="small" sx={{ textTransform: "none" }} onClick={handleAddOrders}>
            Cadastrar
          </Button>
        </ContainerItens>
      </Container>
    </Modal>
  );
}
