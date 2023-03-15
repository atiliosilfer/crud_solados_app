import { Button, Modal, TextField, Typography } from "@mui/material";
import { ContainerItens } from "../ContainerItens";
import { Container } from "./RegisterSoleModal.styles";

type RegisterSoleModalProps = {
  open: boolean;
  handleClose: () => void;
  handleCancel: () => void;
  handleConfirm: () => void;
};

export function RegisterSoleModal({
  open,
  handleClose,
  handleCancel,
  handleConfirm,
}: RegisterSoleModalProps) {
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
