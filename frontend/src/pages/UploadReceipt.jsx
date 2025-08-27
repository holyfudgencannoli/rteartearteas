import UnderConstruction from "./UnderConstruction";
import ReceiptUploader from "../components/ReceiptUploader";

export default function UploadReceipt({ sessionToken, userId}) {
    return(
        <>
        <ReceiptUploader state={{ sessionToken: sessionToken, userId: userId}}/> 
        </>
    )
}