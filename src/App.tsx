import { createBrowserRouter } from "react-router-dom";
import { Home } from './pages/home';
import { Layout } from './components/layout';
import { Login } from "./pages/login";
import { Private } from "./routes/private";
import { Opportunity } from "./pages/opportunity";
import { Leads } from "./pages/leads";


import { ErrorBoundary } from "./pages/error";
import { NotFound } from "./pages/notFound";


import { Gestoria } from "./pages/gestoria/gestoria";
import { GestoriaInterna } from "./pages/gestoria_interna/gestoriaInterna";
import { SuperGestoriaInterna } from "./pages/super_gestoria_interna/superGestoriaInterna";
import { Visualizadores } from "./pages/visualizador/visualizador";


import { LayoutGestoria } from "./components/gestoria/layoutGestoria";
import { LayoutGestoriaInterna } from "./components/gestoria_interna/layoutGestoriaInterna";
import { LayoutSuperGestoriaInterna } from "./components/super_gestoria_interna/layoutSuperGestoriaInterna";
import { LayoutVisualizadores } from "./components/visualizadores/layoutGestoria";



import { AutoLogin } from "./pages/autoLogin";
//import { Gestor } from "./routes/gestor";


const router = createBrowserRouter([
  {
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Private><Home/></Private>
      },
      {
        path: "/autologin",
        element: <AutoLogin/>
      },
      {
        path: "/opportunity/:id",
        element: <Private><Opportunity/></Private>
      },
      {
        path: "/leads/:id",
        element: <Private><Leads/></Private>
      },
      {
        element: <Private><ErrorBoundary/></Private>,
        path: "iohfpio",
      },
      {
        path: "*",
        element: <NotFound/>
      }
    ]
  },
  {
    element: <Login/>,
    path: "/login"
  },
  {
  element: <LayoutGestoria/>,
  children: [
    {
      path: "/gestoria",
      element: <Private><Gestoria/></Private>
    }
  ]
  },
  {
  element: <LayoutGestoriaInterna/>,
  children: [
    {
      path: "/gestoriaInterna",
      element: <Private><GestoriaInterna/></Private>
    }
  ]
  },
  {
    element: <LayoutSuperGestoriaInterna/>,
    children: [
      {
        path: "/supergestoria",
        element: <Private><SuperGestoriaInterna/></Private>
      }
    ]
  },
  {
    element: <LayoutVisualizadores/>,
    children: [
      {
        path: "visualizador",
        element: <Private><Visualizadores/></Private>
      }
    ]
  }
  
])





export { router } ;