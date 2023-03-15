import { Button, Modal, Typography } from "@mui/material";
import { ContainerItens } from "../ContainerItens";
import { Container } from "./CofirmationModal.styles";

type ConfirmationModalProps = {
  open: boolean;
  titleDescription: string;
  textDescription: string;
  handleClose: () => void;
  handleCancel: () => void;
  handleConfirm: () => void;
};

export function ConfirmationModal({
  open,
  handleClose,
  titleDescription,
  textDescription,
  handleCancel,
  handleConfirm,
}: ConfirmationModalProps) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Container>
        <Typography variant="h6" component="h2">
          {titleDescription}
        </Typography>
        <Typography>{textDescription}</Typography>

        <br />

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
            Confirmar
          </Button>
        </ContainerItens>
      </Container>
    </Modal>
  );
}
