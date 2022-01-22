import {Fragment, useState} from "react";
import Sticky from "react-stickynode";
import TopBar from "../components/TopBar";
import AccountModal from "../components/AccountModal";
import {Toaster} from "react-hot-toast";

function Layout ({children}) {
    const [isSticky, setIsSticky] = useState(false);

    const handleStateChange = (status) => {
        if (status.status === Sticky.STATUS_FIXED) {
            setIsSticky(true);
        } else if (status.status === Sticky.STATUS_ORIGINAL) {
            setIsSticky(false);
        }
    };
    return <Fragment>
        <Toaster />
        <Sticky innerZ={1001} top={0} onStateChange={handleStateChange}>
            <TopBar className={`${isSticky ? 'sticky' : 'unSticky'}`} />
        </Sticky>
        <main  >
            {children}
        </main>
        <AccountModal />
    </Fragment>
}

export default Layout