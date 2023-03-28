import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Grid from "@mui/material/Grid";
import { Autocomplete, Button, TextField } from "@mui/material";
import { Container } from "./styles";
import { Sole } from "./components/Sole";
import { ContainerItens } from "./components/ContainerItens";
import { RegisterSoleModal } from "./components/RegisterSoleModal";

type Sole = {
  id: number;
  name: string;
  deleted_at?: string;
};

function App() {
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [registerSoleModalOpened, setRegisterSoleModalOpened] = useState(false);
  const [soles, setSoles] = useState<Sole[]>([]);

  const refresh_soles = () => {
    invoke("get_soles").then((response) => setSoles(response as Sole[]));
  };

  useEffect(() => {
    refresh_soles();
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
              renderInput={(params) => (
                <TextField {...params} label="Solados" size="small" />
              )}
            />
          </Grid>
          <Grid item>
            <ContainerItens>
              <Button
                variant="contained"
                size="small"
                sx={{ textTransform: "none" }}
              >
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
          <Sole
            key={soles.filter((x) => x.name == value)[0].id}
            name={soles.filter((x) => x.name == value)[0].name}
            id={soles.filter((x) => x.name == value)[0].id}
            refresh_soles={refresh_soles}
          />
        ) : (
          <>
            {soles.map((sole) => (
              <Sole
                key={sole.id}
                name={sole.name}
                id={sole.id}
                refresh_soles={refresh_soles}
              />
            ))}
          </>
        )}
      </Container>
      <RegisterSoleModal
        open={registerSoleModalOpened}
        handleClose={() => setRegisterSoleModalOpened(false)}
        handleCancel={() => setRegisterSoleModalOpened(false)}
        refresh_soles={refresh_soles}
      />
    </>
  );
}

export default App;
