import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Grid from "@mui/material/Grid";
import { Autocomplete, Button, CircularProgress, TextField } from "@mui/material";
import { Container, ContainerLoading } from "./styles";
import { SoleContainer } from "./components/Sole";
import { ContainerItens } from "./components/ContainerItens";
import { RegisterSoleModal } from "./components/RegisterSoleModal";
import { Sole } from "./types";
import { generatePdfData, generatePdfFile } from "./utils/pdfUtils";
import { ConfirmationModal } from "./components/CofirmationModal";

export function App() {
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [registerSoleModalOpened, setRegisterSoleModalOpened] = useState(false);
  const [resetAllOrdersModalOpened, setResetAllOrdersModalOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [soles, setSoles] = useState<Sole[]>([]);

  useEffect(() => {
    refreshSoles();
  }, []);

  const refreshSoles = () => {
    invoke("get_soles").then((response) => setSoles(response as Sole[]));
  };

  const handleResetAllOrders = () => {
    soles.map(async (sole) => await invoke("reset_orders", { id: sole.id }));
    setSoles([]);
    setResetAllOrdersModalOpened(false);

    setLoading(true);
    refreshSoles();

    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };

  async function printDocument() {
    const data = generatePdfData(soles);
    generatePdfFile(await data);
  }

  return (
    <>
      <Container>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Autocomplete
              value={value}
              onChange={(event: any, newValue: string | null) => {
                setValue(newValue);
              }}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              options={soles.map((x) => x.name)}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Solados" size="small" />}
            />
          </Grid>
          <Grid item>
            <ContainerItens>
              <Button
                variant="contained"
                size="small"
                sx={{ textTransform: "none" }}
                onClick={() => setResetAllOrdersModalOpened(true)}
              >
                Reinicial todos os pedidos
              </Button>
              <Button variant="contained" size="small" sx={{ textTransform: "none" }} onClick={printDocument}>
                Imprimir
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ textTransform: "none" }}
                onClick={() => setRegisterSoleModalOpened(true)}
              >
                Cadastrar novo solado
              </Button>
            </ContainerItens>
          </Grid>
        </Grid>

        {loading ? (
          <ContainerLoading>
            <CircularProgress />
          </ContainerLoading>
        ) : (
          <>
            {value != null ? (
              <SoleContainer
                key={soles.filter((x) => x.name == value)[0].id}
                name={soles.filter((x) => x.name == value)[0].name}
                id={soles.filter((x) => x.name == value)[0].id}
                refreshSoles={refreshSoles}
              />
            ) : (
              <>
                {soles.map((sole) => (
                  <SoleContainer key={sole.id} name={sole.name} id={sole.id} refreshSoles={refreshSoles} />
                ))}
              </>
            )}
          </>
        )}
      </Container>

      <RegisterSoleModal
        open={registerSoleModalOpened}
        handleClose={() => setRegisterSoleModalOpened(false)}
        handleCancel={() => setRegisterSoleModalOpened(false)}
        refreshSoles={refreshSoles}
      />
      <ConfirmationModal
        textDescription={`Deseja reiniciar todos os pedidos?`}
        titleDescription="Reiniciar todos os pedidos"
        open={resetAllOrdersModalOpened}
        handleClose={() => setResetAllOrdersModalOpened(false)}
        handleCancel={() => setResetAllOrdersModalOpened(false)}
        handleConfirm={handleResetAllOrders}
      />
    </>
  );
}
