import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Grid from "@mui/material/Grid";
import { Autocomplete, Button, TextField } from "@mui/material";
import { Container } from "./styles";
import { SoleContainer } from "./components/Sole";
import { ContainerItens } from "./components/ContainerItens";
import { RegisterSoleModal } from "./components/RegisterSoleModal";
import { Sole } from "./types";

export function App() {
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [registerSoleModalOpened, setRegisterSoleModalOpened] = useState(false);
  const [soles, setSoles] = useState<Sole[]>([]);

  const refreshSoles = () => {
    invoke("get_soles").then((response) => setSoles(response as Sole[]));
  };

  useEffect(() => {
    refreshSoles();
  }, []);

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
              <Button variant="contained" size="small" sx={{ textTransform: "none" }}>
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
      </Container>
      <RegisterSoleModal
        open={registerSoleModalOpened}
        handleClose={() => setRegisterSoleModalOpened(false)}
        handleCancel={() => setRegisterSoleModalOpened(false)}
        refreshSoles={refreshSoles}
      />
    </>
  );
}
