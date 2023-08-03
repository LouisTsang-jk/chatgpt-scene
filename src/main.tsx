import React, { useMemo } from "react"
import ReactDOM from "react-dom/client"
import { createHashRouter, RouterProvider } from "react-router-dom"
import "./index.css"
import Main from "./views/Main"
import styled from "styled-components"
import { DataProvider } from "./DataContext"
import Editor from "./views/Editor"
import { SnackbarProvider } from "./common/SnackbarContext/SnackbarProvider"
import About from "./views/About"
import {
  alpha,
  Card,
  CardContent,
  createTheme,
  ThemeProvider,
  useMediaQuery
} from "@mui/material"
import { grey } from "@mui/material/colors"

const router = createHashRouter([
  {
    path: "/",
    element: <Main />
  },
  {
    path: "create",
    element: <Editor />
  },
  {
    path: "edit/:id",
    element: <Editor />
  },
  {
    path: "about",
    element: <About />
  }
])

const LayoutDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
`

const violetDark = "rgb(171, 104, 255)"
const violetMain = alpha(violetDark, 0.7)
const violetLight = alpha(violetDark, 0.2)

const App = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            dark: violetDark,
            main: violetMain,
            light: violetLight
          },
          secondary: grey,
          mode: prefersDarkMode ? "dark" : "light",
          background: {
            default: prefersDarkMode ? "#213547" : "#fff",
            paper: prefersDarkMode ? "#213547" : "#fff"
          }
        },
        components: {
          MuiIconButton: {
            styleOverrides: {
              colorPrimary: violetMain
            }
          },
          MuiIcon: {
            styleOverrides: {
              colorPrimary: violetMain
            }
          }
        }
      }),
    [prefersDarkMode]
  )

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <DataProvider>
          <LayoutDiv>
            <Card sx={{ overflowY: "auto", borderRadius: 0 }}>
              <CardContent>
                <SnackbarProvider>
                  <RouterProvider router={router} />
                </SnackbarProvider>
              </CardContent>
            </Card>
          </LayoutDiv>
        </DataProvider>
      </ThemeProvider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
)
