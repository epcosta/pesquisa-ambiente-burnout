import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import Cadastro from "./pages/Cadastro";
import { Pesquisas } from "./pages/Pesquisas";
import Questionario from "./pages/Questionario";
import { Obrigado } from "./pages/Obrigado";
import Relatorio from "./pages/Relatorio";
import EnvioLink from "./pages/EnvioLink";
import VisualizarQrCode from "./pages/VisualizarQrCode";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/ambienteburnout/inicio/cadastro", element: <Cadastro /> },
      { path: "/ambienteburnout/listar", element: <Pesquisas /> },
      { path: "/ambienteburnout/envio-link/:id", element: <EnvioLink /> },
      { path: "/ambienteburnout/qrcode/:id", element: <VisualizarQrCode /> },

      { path: "/questionario-ambienteburnout/:id", element: <Questionario /> },
      { path: "/relatorio/:id", element: <Relatorio /> },
      { path: "/obrigado", element: <Obrigado /> },
      { path: "/relatorio/:id", element: <Relatorio /> },
    ],
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
