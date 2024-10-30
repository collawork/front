import { Outlet } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import Aside from "../components/Aside";
import Footer from "../components/Footer";

const Layout = () => {

    return(
        <>
            <TopHeader/>
            <Outlet/>
            {/* <Aside/> */}
            <Footer/>
        </>
    )
    
}

export default Layout;