import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Grid from "@mui/material/Grid";
import { Autocomplete, Button, TextField } from "@mui/material";
import { Container } from "./styles";
import { Sole } from "./components/Sole";
import { ContainerItens } from "./components/ContainerItens";
import { RegisterSoleModal } from "./components/RegisterSoleModal";

const options = ["Sola 1", "Sola 2"];

function App() {
  const [value, setValue] = useState<string | null>(options[0]);
  const [inputValue, setInputValue] = useState("");
  const [registerSoleModalOpened, setRegisterSoleModalOpened] = useState(false);

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

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
              options={options}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Controllable" size="small" />
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

        <Sole />
        <Sole />
        <Sole />
        <Sole />
        <Sole />
        <Sole />
      </Container>
      <RegisterSoleModal
        open={registerSoleModalOpened}
        handleClose={() => setRegisterSoleModalOpened(false)}
        handleConfirm={() => console.log("cadastrar solado")}
        handleCancel={() => setRegisterSoleModalOpened(false)}
      />
    </>
  );
}

export default App;
