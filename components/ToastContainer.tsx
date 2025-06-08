import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const CustomToastContainer = ({ containerId }: { containerId: string }) => {
    return (
        <>
            <ToastContainer
                containerId={containerId}
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <ToastContainer />
        </>
    )
}

export default CustomToastContainer
