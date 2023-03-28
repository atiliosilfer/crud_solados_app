import { Button, Modal, TextField, Typography } from "@mui/material";
import { invoke } from "@tauri-apps/api";
import { useState } from "react";
import { ContainerItens } from "../ContainerItens";
import { Container } from "./RegisterSoleModal.styles";

type RegisterSoleModalProps = {
  open: boolean;
  handleClose: () => void;
  handleCancel: () => void;
  refresh_soles: () => void;
};

export function RegisterSoleModal({
  open,
  handleClose,
  handleCancel,
  refresh_soles,
}: RegisterSoleModalProps) {
  const [soleName, setSoleName] = useState("");

  const handleConfirm = () => {
    invoke("add_new_sole", { soleName })
      .then(() => {
        refresh_soles();
        console.log("Solado cadastrado com sucesso!");
      })
      .catch((error) => console.log(error, "Erro ao cadastrar novo solado!"));

    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Container>
        <Typography variant="h6" component="h2">
          Cadastrar novo solado
        </Typography>

        <TextField
          id="outlined-basic"
          label="Descrição do solado"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ my: 1 }}
          onChange={(event) => setSoleName(event.target.value)}
        />

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
